create table if not exists public.user_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique,
  role text not null default 'admin' check (role in ('admin', 'super_admin')),
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.user_profiles enable row level security;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id, username, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_app_meta_data ->> 'role', 'admin')
  )
  on conflict (id) do update
  set
    username = excluded.username,
    role = excluded.role;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

create or replace function public.is_admin_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_profiles
    where id = auth.uid()
      and role in ('admin', 'super_admin')
  );
$$;

create or replace function public.is_super_admin_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_profiles
    where id = auth.uid()
      and role = 'super_admin'
  );
$$;

drop policy if exists "Users can view own profile" on public.user_profiles;
create policy "Users can view own profile"
on public.user_profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "Admins can view all profiles" on public.user_profiles;
create policy "Admins can view all profiles"
on public.user_profiles
for select
to authenticated
using ((select public.is_admin_user()));

drop policy if exists "Super admins can insert profiles" on public.user_profiles;
create policy "Super admins can insert profiles"
on public.user_profiles
for insert
to authenticated
with check ((select public.is_super_admin_user()));

drop policy if exists "Super admins can update profiles" on public.user_profiles;
create policy "Super admins can update profiles"
on public.user_profiles
for update
to authenticated
using ((select public.is_super_admin_user()))
with check ((select public.is_super_admin_user()));

drop policy if exists "Super admins can delete profiles" on public.user_profiles;
create policy "Super admins can delete profiles"
on public.user_profiles
for delete
to authenticated
using ((select public.is_super_admin_user()));

create table if not exists public.mahasiswa (
  id bigint generated always as identity primary key,
  nama text not null,
  nim text not null unique,
  jurusan text not null,
  alamat text not null,
  no_hp text not null,
  foto_url text,
  status text not null default 'Menunggu' check (status in ('Aktif', 'Menunggu')),
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.mahasiswa enable row level security;

drop policy if exists "Admins can read mahasiswa" on public.mahasiswa;
create policy "Admins can read mahasiswa"
on public.mahasiswa
for select
to authenticated
using ((select public.is_admin_user()));

drop policy if exists "Admins can insert mahasiswa" on public.mahasiswa;
create policy "Admins can insert mahasiswa"
on public.mahasiswa
for insert
to authenticated
with check ((select public.is_admin_user()));

drop policy if exists "Admins can update mahasiswa" on public.mahasiswa;
create policy "Admins can update mahasiswa"
on public.mahasiswa
for update
to authenticated
using ((select public.is_admin_user()))
with check ((select public.is_admin_user()));

drop policy if exists "Admins can delete mahasiswa" on public.mahasiswa;
create policy "Admins can delete mahasiswa"
on public.mahasiswa
for delete
to authenticated
using ((select public.is_admin_user()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'foto-mahasiswa',
  'foto-mahasiswa',
  true,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admins can view mahasiswa photos" on storage.objects;
create policy "Admins can view mahasiswa photos"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'foto-mahasiswa'
  and (select public.is_admin_user())
);

drop policy if exists "Admins can upload mahasiswa photos" on storage.objects;
create policy "Admins can upload mahasiswa photos"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'foto-mahasiswa'
  and (select public.is_admin_user())
);

drop policy if exists "Admins can update mahasiswa photos" on storage.objects;
create policy "Admins can update mahasiswa photos"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'foto-mahasiswa'
  and (select public.is_admin_user())
)
with check (
  bucket_id = 'foto-mahasiswa'
  and (select public.is_admin_user())
);

drop policy if exists "Admins can delete mahasiswa photos" on storage.objects;
create policy "Admins can delete mahasiswa photos"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'foto-mahasiswa'
  and (select public.is_admin_user())
);
