-- ==============================================================================
-- LIGHTFLOW - SUPABASE DATENBANKSCHEMA
-- ==============================================================================
-- Sicherheits-Standard: Rene (Row Level Security für 100% Datenschutz)
-- ==============================================================================

-- 1. Tabelle: Verbindungsprofil (User Matrix)
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  profession text not null default 'Küchenmonteur / Handwerk',
  mindset text not null default 'Lösungsorientiert & Analytisch',
  relationship_status text not null default 'Single / Alleinlebend',
  faith_stage text not null default 'Hinterfragend',
  daily_mood text default 'Unter Druck / Erschöpft',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_user_profile unique (user_id)
);

-- RLS aktivieren
alter table public.profiles enable row level security;

-- Policies für Profiles
create policy "Benutzer können ihr eigenes Profil einsehen"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "Benutzer können ihr eigenes Profil erstellen"
  on public.profiles for insert
  with check (auth.uid() = user_id);

create policy "Benutzer können ihr eigenes Profil bearbeiten"
  on public.profiles for update
  using (auth.uid() = user_id);

-- 2. Tabelle: Gespeicherte Lichtfluss-Reports (6 Stufen)
create table if not exists public.saved_reports (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade,
  passage text not null,
  mood text not null,
  core_conduit text not null,
  workbench text not null,
  system_decoded text not null,
  daily_freedom text not null,
  heart_garden text not null,
  oxygen_mask text not null,
  favorite boolean default false not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS aktivieren
alter table public.saved_reports enable row level security;

-- Policies für Saved Reports
create policy "Benutzer können nur ihre eigenen Berichte einsehen"
  on public.saved_reports for select
  using (auth.uid() = user_id);

create policy "Benutzer können eigene Berichte speichern"
  on public.saved_reports for insert
  with check (auth.uid() = user_id);

create policy "Benutzer können eigene Berichte aktualisieren"
  on public.saved_reports for update
  using (auth.uid() = user_id);

create policy "Benutzer können eigene Berichte löschen"
  on public.saved_reports for delete
  using (auth.uid() = user_id);

-- Indizes für schnelle Abfragen
create index if not exists idx_saved_reports_user_id on public.saved_reports(user_id);
create index if not exists idx_saved_reports_favorite on public.saved_reports(favorite);
