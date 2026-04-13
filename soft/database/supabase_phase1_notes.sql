-- Notas mínimas para conectar Fase 1 con Supabase
-- 1) Crear usuarios con Supabase Auth
-- 2) Crear tabla profiles asociada a auth.users
-- 3) Después agregar roles, permisos y suscripciones

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can read own profile"
on profiles for select
to authenticated
using (auth.uid() = id);

create policy "Users can update own profile"
on profiles for update
to authenticated
using (auth.uid() = id);
