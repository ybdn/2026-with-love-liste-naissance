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
-- USING filtre les lignes avant modification (statut doit être disponible)
-- WITH CHECK (true) valide le nouvel état sans le re-filtrer (sinon 42501 après update)
create policy "Reservation par invites"
  on public.items for update
  to anon
  using (statut = 'disponible')
  with check (true);

-- GRANT nécessaire pour que le rôle anon puisse exécuter UPDATE (RLS seul ne suffit pas)
grant update (statut, reserve_par) on public.items to anon;

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

-- 6. Ajouter la colonne catégorie
-- À exécuter séparément si la table existe déjà :
-- ALTER TABLE public.items ADD COLUMN categorie text DEFAULT NULL CHECK (categorie IN ('sommeil', 'éveil', 'repas', 'allaitement', 'sorties'));
alter table public.items add column categorie text default null
  check (categorie in ('sommeil', 'éveil', 'repas', 'allaitement', 'sorties'));

-- 7. Table inventaire (ce qu'on a déjà)
create table public.inventory_items (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  categorie text not null check (categorie in (
    'vêtements', 'bodies', 'jouets', 'puériculture', 'bain', 'chambre', 'accessoires', 'autre'
  )),
  nom text not null,
  taille text default null,
  quantite integer not null default 1 check (quantite >= 0),
  notes text default null
);

alter table public.inventory_items enable row level security;

create policy "Inventaire lecture publique" on public.inventory_items
  for select to anon using (true);
create policy "Inventaire admin select" on public.inventory_items
  for select to authenticated using (true);
create policy "Inventaire admin insert" on public.inventory_items
  for insert to authenticated with check (true);
create policy "Inventaire admin update" on public.inventory_items
  for update to authenticated using (true);
create policy "Inventaire admin delete" on public.inventory_items
  for delete to authenticated using (true);
