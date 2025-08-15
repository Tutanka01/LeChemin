-- Tables minimales pour la progression
create table if not exists public.progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id text not null,
  type text not null check (type in ('skill','resource')),
  key text not null,
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
