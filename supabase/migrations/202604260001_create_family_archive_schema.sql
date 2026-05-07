begin;

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.current_user_family_archive_id()
returns uuid
language sql
stable
as $$
  select fa.id
  from public.family_archives fa
  where fa.owner_id = auth.uid()
  limit 1
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  username text unique,
  avatar_url text,
  bio text,
  onboarding_complete boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.family_archives (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references auth.users (id) on delete cascade,
  name text not null default 'My Family Archive',
  description text,
  cover_image_url text,
  privacy text default 'private',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.people (
  id uuid primary key default gen_random_uuid(),
  archive_id uuid not null default public.current_user_family_archive_id() references public.family_archives (id) on delete cascade,
  full_name text not null,
  birth_year int,
  death_year int,
  location text,
  notes text,
  image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  archive_id uuid not null default public.current_user_family_archive_id() references public.family_archives (id) on delete cascade,
  title text not null,
  story_text text,
  story_date text,
  location text,
  media_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.story_people (
  story_id uuid not null references public.stories (id) on delete cascade,
  person_id uuid not null references public.people (id) on delete cascade,
  primary key (story_id, person_id)
);

create index if not exists idx_family_archives_owner_id
  on public.family_archives (owner_id);

create index if not exists idx_people_archive_id
  on public.people (archive_id);

create index if not exists idx_stories_archive_id
  on public.stories (archive_id);

create index if not exists idx_story_people_person_id
  on public.story_people (person_id);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists set_family_archives_updated_at on public.family_archives;
create trigger set_family_archives_updated_at
before update on public.family_archives
for each row
execute function public.set_updated_at();

drop trigger if exists set_people_updated_at on public.people;
create trigger set_people_updated_at
before update on public.people
for each row
execute function public.set_updated_at();

drop trigger if exists set_stories_updated_at on public.stories;
create trigger set_stories_updated_at
before update on public.stories
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'display_name'),
    new.raw_user_meta_data ->> 'username'
  )
  on conflict (id) do update
  set
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    username = coalesce(excluded.username, public.profiles.username),
    updated_at = timezone('utc', now());

  insert into public.family_archives (owner_id)
  values (new.id)
  on conflict (owner_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

insert into public.profiles (id)
select u.id
from auth.users u
on conflict (id) do nothing;

insert into public.family_archives (owner_id)
select u.id
from auth.users u
on conflict (owner_id) do nothing;

alter table public.profiles enable row level security;
alter table public.family_archives enable row level security;
alter table public.people enable row level security;
alter table public.stories enable row level security;
alter table public.story_people enable row level security;

drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
on public.profiles
for insert
with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Users can delete their own profile" on public.profiles;
drop policy if exists "Users can view their own family archive" on public.family_archives;
create policy "Users can view their own family archive"
on public.family_archives
for select
using (auth.uid() = owner_id);

drop policy if exists "Users can insert their own family archive" on public.family_archives;
create policy "Users can insert their own family archive"
on public.family_archives
for insert
with check (auth.uid() = owner_id);

drop policy if exists "Users can update their own family archive" on public.family_archives;
create policy "Users can update their own family archive"
on public.family_archives
for update
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

drop policy if exists "Users can delete their own family archive" on public.family_archives;
create policy "Users can delete their own family archive"
on public.family_archives
for delete
using (auth.uid() = owner_id);

drop policy if exists "Users can view people in their own family archive" on public.people;
create policy "Users can view people in their own family archive"
on public.people
for select
using (
  exists (
    select 1
    from public.family_archives fa
    where fa.id = people.archive_id
      and fa.owner_id = auth.uid()
  )
);

drop policy if exists "Users can insert people in their own family archive" on public.people;
create policy "Users can insert people in their own family archive"
on public.people
for insert
with check (
  exists (
    select 1
    from public.family_archives fa
    where fa.id = people.archive_id
      and fa.owner_id = auth.uid()
  )
);

drop policy if exists "Users can update people in their own family archive" on public.people;
create policy "Users can update people in their own family archive"
on public.people
for update
using (
  exists (
    select 1
    from public.family_archives fa
    where fa.id = people.archive_id
      and fa.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.family_archives fa
    where fa.id = people.archive_id
      and fa.owner_id = auth.uid()
  )
);

drop policy if exists "Users can delete people in their own family archive" on public.people;
create policy "Users can delete people in their own family archive"
on public.people
for delete
using (
  exists (
    select 1
    from public.family_archives fa
    where fa.id = people.archive_id
      and fa.owner_id = auth.uid()
  )
);

drop policy if exists "Users can view stories in their own family archive" on public.stories;
create policy "Users can view stories in their own family archive"
on public.stories
for select
using (
  exists (
    select 1
    from public.family_archives fa
    where fa.id = stories.archive_id
      and fa.owner_id = auth.uid()
  )
);

drop policy if exists "Users can insert stories in their own family archive" on public.stories;
create policy "Users can insert stories in their own family archive"
on public.stories
for insert
with check (
  exists (
    select 1
    from public.family_archives fa
    where fa.id = stories.archive_id
      and fa.owner_id = auth.uid()
  )
);

drop policy if exists "Users can update stories in their own family archive" on public.stories;
create policy "Users can update stories in their own family archive"
on public.stories
for update
using (
  exists (
    select 1
    from public.family_archives fa
    where fa.id = stories.archive_id
      and fa.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.family_archives fa
    where fa.id = stories.archive_id
      and fa.owner_id = auth.uid()
  )
);

drop policy if exists "Users can delete stories in their own family archive" on public.stories;
create policy "Users can delete stories in their own family archive"
on public.stories
for delete
using (
  exists (
    select 1
    from public.family_archives fa
    where fa.id = stories.archive_id
      and fa.owner_id = auth.uid()
  )
);

drop policy if exists "Users can view story links in their own family archive" on public.story_people;
create policy "Users can view story links in their own family archive"
on public.story_people
for select
using (
  exists (
    select 1
    from public.stories s
    join public.family_archives fa on fa.id = s.archive_id
    where s.id = story_people.story_id
      and fa.owner_id = auth.uid()
  )
  and exists (
    select 1
    from public.people p
    join public.family_archives fa on fa.id = p.archive_id
    where p.id = story_people.person_id
      and fa.owner_id = auth.uid()
  )
);

drop policy if exists "Users can insert story links in their own family archive" on public.story_people;
create policy "Users can insert story links in their own family archive"
on public.story_people
for insert
with check (
  exists (
    select 1
    from public.stories s
    join public.family_archives fa on fa.id = s.archive_id
    where s.id = story_people.story_id
      and fa.owner_id = auth.uid()
  )
  and exists (
    select 1
    from public.people p
    join public.family_archives fa on fa.id = p.archive_id
    where p.id = story_people.person_id
      and fa.owner_id = auth.uid()
      and fa.id = (
        select s.archive_id
        from public.stories s
        where s.id = story_people.story_id
      )
  )
);

drop policy if exists "Users can update story links in their own family archive" on public.story_people;
create policy "Users can update story links in their own family archive"
on public.story_people
for update
using (
  exists (
    select 1
    from public.stories s
    join public.family_archives fa on fa.id = s.archive_id
    where s.id = story_people.story_id
      and fa.owner_id = auth.uid()
  )
  and exists (
    select 1
    from public.people p
    join public.family_archives fa on fa.id = p.archive_id
    where p.id = story_people.person_id
      and fa.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.stories s
    join public.family_archives fa on fa.id = s.archive_id
    where s.id = story_people.story_id
      and fa.owner_id = auth.uid()
  )
  and exists (
    select 1
    from public.people p
    join public.family_archives fa on fa.id = p.archive_id
    where p.id = story_people.person_id
      and fa.owner_id = auth.uid()
      and fa.id = (
        select s.archive_id
        from public.stories s
        where s.id = story_people.story_id
      )
  )
);

drop policy if exists "Users can delete story links in their own family archive" on public.story_people;
create policy "Users can delete story links in their own family archive"
on public.story_people
for delete
using (
  exists (
    select 1
    from public.stories s
    join public.family_archives fa on fa.id = s.archive_id
    where s.id = story_people.story_id
      and fa.owner_id = auth.uid()
  )
  and exists (
    select 1
    from public.people p
    join public.family_archives fa on fa.id = p.archive_id
    where p.id = story_people.person_id
      and fa.owner_id = auth.uid()
  )
);

commit;
