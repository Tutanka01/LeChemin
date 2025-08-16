-- Extensions requises
create extension if not exists pgcrypto;

-- Reset progress table (safe to re-run)
drop table if exists public.progress cascade;

create table public.progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id text not null,
  type text not null check (type in ('skill','resource')),
  -- key compacte: ex "fondamentaux:skill:0:linux-cli"
  key text not null check (
    length(key) between 3 and 80 and key ~ '^[a-z0-9:-]+$'
  ),
  completed boolean not null default false,
  updated_at timestamp with time zone default now(),
  primary key (user_id, module_id, type, key)
);

-- RLS
alter table public.progress enable row level security;

create policy "Users can manage own progress"
  on public.progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Waitlist pour notifications (ex: parcours cybersécurité)
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  topic text not null check (topic in ('cyber')),
  created_at timestamp with time zone not null default now()
);

-- Unicité email (insensible à la casse) par sujet
create unique index if not exists waitlist_email_topic_key on public.waitlist (lower(email), topic);

-- RLS activé et aucune policy large: pas d'accès direct aux lignes
alter table public.waitlist enable row level security;

-- Fonction RPC sécurisée pour ajouter un email à la liste d'attente
create or replace function public.add_to_waitlist(_email text, _topic text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Validation basique côté serveur
  if _email is null or length(_email) < 6 or length(_email) > 254 then
    raise exception 'invalid_email';
  end if;
  if _topic is null then
    raise exception 'invalid_topic';
  end if;
  -- Regex email simple (RFC simplified)
  if lower(_email) !~* '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$' then
    raise exception 'invalid_email_format';
  end if;
  -- Restreindre aux sujets autorisés
  if lower(_topic) not in ('cyber') then
    raise exception 'invalid_topic';
  end if;

  insert into public.waitlist(email, topic)
  values (lower(_email), lower(_topic))
  on conflict (lower(email), topic) do nothing;
end;
$$;

-- Autoriser l'exécution de la fonction aux rôles publics (anonymes et authentifiés)
grant execute on function public.add_to_waitlist(text, text) to anon, authenticated;

-- Active RLS + politiques sûres par défaut.
-- Adapte les noms de tables/colonnes (user_id, email, etc.) si nécessaire.

-- 0) Helper: activer RLS proprement si la table existe
DO $$
BEGIN
  -- 1) profiles (id = auth.uid())
  IF to_regclass('public.profiles') IS NOT NULL THEN
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS profiles_select_own ON public.profiles;
    CREATE POLICY profiles_select_own ON public.profiles
      FOR SELECT USING (auth.uid() = id);

    DROP POLICY IF EXISTS profiles_insert_own ON public.profiles;
    CREATE POLICY profiles_insert_own ON public.profiles
      FOR INSERT WITH CHECK (auth.uid() = id);

    DROP POLICY IF EXISTS profiles_update_own ON public.profiles;
    CREATE POLICY profiles_update_own ON public.profiles
      FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

    DROP POLICY IF EXISTS profiles_delete_own ON public.profiles;
    CREATE POLICY profiles_delete_own ON public.profiles
      FOR DELETE USING (auth.uid() = id);
  END IF;

  -- 2) progress (user_id = auth.uid())
  IF to_regclass('public.progress') IS NOT NULL THEN
    ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS progress_select_own ON public.progress;
    CREATE POLICY progress_select_own ON public.progress
      FOR SELECT USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS progress_insert_own ON public.progress;
    CREATE POLICY progress_insert_own ON public.progress
      FOR INSERT WITH CHECK (auth.uid() = user_id);

    DROP POLICY IF EXISTS progress_update_own ON public.progress;
    CREATE POLICY progress_update_own ON public.progress
      FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

    -- Pas de delete public (seulement service_role)
  END IF;

  -- 3) roadmaps personnalisées (user_id = auth.uid())
  IF to_regclass('public.roadmaps') IS NOT NULL THEN
    ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS roadmaps_select_own ON public.roadmaps;
    CREATE POLICY roadmaps_select_own ON public.roadmaps
      FOR SELECT USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS roadmaps_insert_own ON public.roadmaps;
    CREATE POLICY roadmaps_insert_own ON public.roadmaps
      FOR INSERT WITH CHECK (auth.uid() = user_id);

    DROP POLICY IF EXISTS roadmaps_update_own ON public.roadmaps;
    CREATE POLICY roadmaps_update_own ON public.roadmaps
      FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

    -- Pas de delete public (seulement service_role)
  END IF;

  -- Table des roadmaps personnalisées (IA) — si absente, la créer
  do $$
  begin
    if to_regclass('public.roadmaps') is null then
      create table public.roadmaps (
        id uuid primary key default gen_random_uuid(),
        user_id uuid not null references auth.users(id) on delete cascade,
        topic text not null check (length(topic) between 1 and 200),
        kind text not null default 'skills' check (kind in ('skills')),
        payload jsonb not null,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );

      create index roadmaps_user_id_created_at_idx on public.roadmaps(user_id, created_at desc);
    end if;
  end$$;

  -- Activer RLS + politiques si non déjà définies (sécurité propriétaire)
  alter table public.roadmaps enable row level security;

  do $$
  begin
    if not exists (
      select 1 from pg_policies where schemaname='public' and tablename='roadmaps' and policyname='roadmaps_select_own'
    ) then
      create policy roadmaps_select_own on public.roadmaps for select using (auth.uid() = user_id);
    end if;
    if not exists (
      select 1 from pg_policies where schemaname='public' and tablename='roadmaps' and policyname='roadmaps_insert_own'
    ) then
      create policy roadmaps_insert_own on public.roadmaps for insert with check (auth.uid() = user_id);
    end if;
    if not exists (
      select 1 from pg_policies where schemaname='public' and tablename='roadmaps' and policyname='roadmaps_update_own'
    ) then
      create policy roadmaps_update_own on public.roadmaps for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
    end if;
  end$$;

  -- 4) quiz_sessions (si vous stockez les réponses du quiz; user_id nullable => on n’autorise la lecture/écriture qu’au propriétaire)
  IF to_regclass('public.quiz_sessions') IS NOT NULL THEN
    ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS quiz_sessions_select_own ON public.quiz_sessions;
    CREATE POLICY quiz_sessions_select_own ON public.quiz_sessions
      FOR SELECT USING (user_id IS NOT NULL AND auth.uid() = user_id);

    DROP POLICY IF EXISTS quiz_sessions_insert_own ON public.quiz_sessions;
    CREATE POLICY quiz_sessions_insert_own ON public.quiz_sessions
      FOR INSERT WITH CHECK (user_id IS NOT NULL AND auth.uid() = user_id);

    DROP POLICY IF EXISTS quiz_sessions_update_own ON public.quiz_sessions;
    CREATE POLICY quiz_sessions_update_own ON public.quiz_sessions
      FOR UPDATE USING (user_id IS NOT NULL AND auth.uid() = user_id)
      WITH CHECK (user_id IS NOT NULL AND auth.uid() = user_id);
  END IF;

  -- 5) waitlist (insert ouvert; lecture limitée à l’email de l’utilisateur connecté)
  IF to_regclass('public.waitlist') IS NOT NULL THEN
    ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

    -- Insert ouvert à tous (y compris anon); prévoir du throttling côté Edge Function
    DROP POLICY IF EXISTS waitlist_insert_all ON public.waitlist;
    CREATE POLICY waitlist_insert_all ON public.waitlist
      FOR INSERT WITH CHECK (true);

    -- Lecture uniquement par l’utilisateur dont le JWT contient le même email
    DROP POLICY IF EXISTS waitlist_select_own_email ON public.waitlist;
    CREATE POLICY waitlist_select_own_email ON public.waitlist
      FOR SELECT USING (
        (auth.jwt() ->> 'email') IS NOT NULL AND email = (auth.jwt() ->> 'email')
      );

    -- Pas d’UPDATE/DELETE (réservé au service_role)
  END IF;

  -- 6) Contenu catalogue (parcours, modules) : lecture publique, aucune écriture
  IF to_regclass('public.parcours') IS NOT NULL THEN
    ALTER TABLE public.parcours ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS parcours_read_all ON public.parcours;
    CREATE POLICY parcours_read_all ON public.parcours
      FOR SELECT USING (true);
    -- Pas d’INSERT/UPDATE/DELETE pour les clients (gérés via migrations / service_role)
  END IF;

  IF to_regclass('public.modules') IS NOT NULL THEN
    ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS modules_read_all ON public.modules;
    CREATE POLICY modules_read_all ON public.modules
      FOR SELECT USING (true);
  END IF;

  -- 7) Logs IA (ai_logs) : insertion par utilisateurs connectés; lecture interdite (sauf service_role)
  IF to_regclass('public.ai_logs') IS NOT NULL THEN
    ALTER TABLE public.ai_logs ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS ai_logs_insert_auth ON public.ai_logs;
    CREATE POLICY ai_logs_insert_auth ON public.ai_logs
      FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

    -- Pas de SELECT/UPDATE/DELETE (service_role seulement)
  END IF;
END$$;

-- 8) Storage policies (pour buckets 'public' et 'avatars')
-- Note: storage.objects.owner existe et peut servir pour limiter l’accès.

-- Lire tout ce qui est dans le bucket 'public'
DROP POLICY IF EXISTS storage_public_read ON storage.objects;
CREATE POLICY storage_public_read ON storage.objects
  FOR SELECT USING (bucket_id = 'public');

-- Écrire/mettre à jour/supprimer uniquement ses propres fichiers sous le préfixe `${uid}/`
DROP POLICY IF EXISTS storage_user_write ON storage.objects;
CREATE POLICY storage_user_write ON storage.objects
  FOR INSERT WITH CHECK (
    auth.uid() = owner
    AND bucket_id IN ('public','avatars')
    AND name LIKE auth.uid()::text || '/%'
  );

DROP POLICY IF EXISTS storage_user_update ON storage.objects;
CREATE POLICY storage_user_update ON storage.objects
  FOR UPDATE USING (
    auth.uid() = owner
    AND bucket_id IN ('public','avatars')
    AND name LIKE auth.uid()::text || '/%'
  )
  WITH CHECK (
    auth.uid() = owner
    AND bucket_id IN ('public','avatars')
    AND name LIKE auth.uid()::text || '/%'
  );

DROP POLICY IF EXISTS storage_user_delete ON storage.objects;
CREATE POLICY storage_user_delete ON storage.objects
  FOR DELETE USING (
    auth.uid() = owner
    AND bucket_id IN ('public','avatars')
    AND name LIKE auth.uid()::text || '/%'
  );