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
