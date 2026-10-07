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

-- ==============================================================================
-- 3. Tabelle: Nutzer & Viral-Referrals (v1.9.0)
-- ==============================================================================
create table if not exists public.users (
  id text primary key,
  name text not null default 'Freund',
  referral_code text unique not null,
  referred_by_code text,
  reports_count integer default 0 not null,
  last_active_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS für users aktivieren
alter table public.users enable row level security;

-- Anonyme Leserechte & Upsert-Rechte für PWA Clients
create policy "Jeder kann Referral-Status und Nutzer abfragen"
  on public.users for select
  using (true);

create policy "Jeder kann seinen Status synchronisieren"
  on public.users for insert
  with check (true);

create policy "Jeder kann seinen Status aktualisieren"
  on public.users for update
  using (true);

-- Indizes
create index if not exists idx_users_referral_code on public.users(referral_code);
create index if not exists idx_users_referred_by on public.users(referred_by_code);
create index if not exists idx_users_last_active on public.users(last_active_at);

-- ==============================================================================
-- 4. Tabelle: Feedback-Kanal (v1.9.0)
-- ==============================================================================
create table if not exists public.feedbacks (
  id uuid primary key default gen_random_uuid(),
  user_name text not null,
  message text not null,
  status text not null default 'new',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS für feedbacks aktivieren
alter table public.feedbacks enable row level security;

create policy "Jeder kann Feedback einreichen"
  on public.feedbacks for insert
  with check (true);

create policy "Jeder kann Feedbacks einsehen (oder über Service Role)"
  on public.feedbacks for select
  using (true);

create policy "Status von Feedbacks aktualisieren"
  on public.feedbacks for update
  using (true);

create policy "Feedbacks löschen"
  on public.feedbacks for delete
  using (true);

