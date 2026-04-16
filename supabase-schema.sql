create extension if not exists "pgcrypto";

create table if not exists public.guestbook_messages (
  id uuid primary key default gen_random_uuid(),
  text varchar(100) not null,
  name varchar(40) not null,
  ip_hash char(64) not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id text primary key,
  "titleZh" text not null,
  "titleEn" text not null,
  "descZh" text not null default '',
  "descEn" text not null default '',
  "longDescZh" text not null default '',
  "longDescEn" text not null default '',
  status text not null default 'soon',
  tracks jsonb not null default '[]'::jsonb,
  year text not null default '',
  "roleZh" text not null default '',
  "roleEn" text not null default '',
  stack jsonb not null default '[]'::jsonb,
  tags jsonb not null default '[]'::jsonb,
  link text not null default '#',
  "detailLink" text not null default '',
  sort_order int not null default 999,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_status_check check (status in ('live', 'building', 'soon'))
);

create index if not exists projects_sort_order_idx on public.projects (sort_order);
create index if not exists projects_created_at_idx on public.projects (created_at desc);
create index if not exists guestbook_created_at_idx on public.guestbook_messages (created_at desc);
create index if not exists guestbook_ip_hash_created_at_idx on public.guestbook_messages (ip_hash, created_at desc);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_projects_updated_at on public.projects;
create trigger trg_projects_updated_at
before update on public.projects
for each row execute procedure public.set_updated_at();

alter table public.guestbook_messages enable row level security;
alter table public.projects enable row level security;

drop policy if exists guestbook_no_direct_access on public.guestbook_messages;
create policy guestbook_no_direct_access
on public.guestbook_messages
for all
to anon, authenticated
using (false)
with check (false);

drop policy if exists projects_no_direct_access on public.projects;
create policy projects_no_direct_access
on public.projects
for all
to anon, authenticated
using (false)
with check (false);
