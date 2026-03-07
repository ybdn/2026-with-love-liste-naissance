-- =============================================
-- 2026 with Love — Setup Supabase
-- À exécuter dans l'éditeur SQL de Supabase
-- =============================================

-- 1. Créer la table items
create table public.items (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  titre text not null,
  description text,
  prix numeric,
  lien_url text,
  image_url text,
  statut text default 'disponible' check (statut in ('disponible', 'reserve')),
  reserve_par text
);

-- 2. Activer RLS
alter table public.items enable row level security;

-- 3. Lecture publique (invités anonymes)
-- On exclut reserve_par pour les anonymes → mode surprise
create policy "Lecture publique sans reserve_par"
  on public.items for select
  to anon
  using (true);

-- 4. Réservation par les invités (anonymes)
-- Ils ne peuvent modifier QUE statut et reserve_par, et SEULEMENT si l'article est disponible
create policy "Reservation par invites"
  on public.items for update
  to anon
  using (statut = 'disponible');

-- 5. CRUD complet pour les parents authentifiés
create policy "Admin lecture"
  on public.items for select
  to authenticated
  using (true);

create policy "Admin insert"
  on public.items for insert
  to authenticated
  with check (true);

create policy "Admin update"
  on public.items for update
  to authenticated
  using (true);

create policy "Admin delete"
  on public.items for delete
  to authenticated
  using (true);
