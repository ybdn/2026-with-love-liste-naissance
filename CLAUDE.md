# 2026 with Love — Liste de Naissance

## Contexte du projet

Application web "mobile-first" de liste de naissance. Les proches (invités) consultent et réservent des cadeaux sans inscription. Les parents (administrateurs) gèrent le catalogue avec un "mode surprise" : ils voient quels articles sont réservés mais jamais par qui.

## Stack technique

- **Frontend** : React 19 + Vite 7 + Tailwind CSS v4
- **Backend** : Supabase (PostgreSQL + Auth + RLS)
- **Hébergement** : GitHub Pages (site statique, build dans `dist/`)
- **Routing** : HashRouter (compatibilité GitHub Pages)

## Architecture

```
src/
├── main.jsx              # Point d'entrée, HashRouter
├── App.jsx               # Routes : / (invités) et /admin (parents)
├── index.css             # Tailwind + thème custom (cream, blush, rose, sage, warm)
├── lib/
│   └── supabase.js       # Client Supabase (URL + clé anon)
├── pages/
│   ├── GuestList.jsx     # Page publique : grille cadeaux, filtres, réservation
│   ├── AdminLogin.jsx    # Login email/password
│   └── AdminDashboard.jsx # CRUD cadeaux + compteurs réservés/total
├── components/
│   ├── Header.jsx        # En-tête avec titre et message d'accueil
│   ├── GiftCard.jsx      # Carte cadeau (mode invité ou admin)
│   ├── ReserveModal.jsx  # Modale de réservation (prénom/nom)
│   └── AdminGiftForm.jsx # Formulaire ajout/modification cadeau
```

## Base de données Supabase

**Table `items`** :
- `id` (UUID, PK), `created_at` (timestamptz)
- `titre` (text, NOT NULL), `description` (text), `prix` (numeric)
- `lien_url` (text), `image_url` (text)
- `statut` (text : 'disponible' | 'reserve'), `reserve_par` (text)

**RLS activé** :
- `anon` : SELECT all, UPDATE uniquement si `statut = 'disponible'`
- `authenticated` : CRUD complet

Le fichier `supabase-setup.sql` contient le script complet à exécuter dans le SQL Editor de Supabase.

## Supabase credentials

- URL : `https://zojbmfhsinghyogpbbho.supabase.co`
- Clé anon : dans `src/lib/supabase.js`

## Commandes

- `npm run dev` — serveur de développement
- `npm run build` — build production (output `dist/`)
- `npm run preview` — prévisualisation du build

## Design system

- **Polices** : Playfair Display (titres), Inter (corps)
- **Couleurs** : cream (#FDF8F4), blush (#F5E6DA), rose (#D4A59A), sage (#A8B5A2), warm (#8B7355)
- **Style** : arrondi (rounded-2xl), ombres douces, transitions subtiles

## État actuel

- [x] Structure projet React + Vite + Tailwind
- [x] Client Supabase configuré
- [x] Page invités avec grille, filtres, réservation en 1 clic
- [x] Page admin avec login, CRUD, mode surprise
- [x] Script SQL pour table + RLS
- [ ] Exécuter `supabase-setup.sql` dans Supabase
- [ ] Créer un compte parent dans Supabase Auth
- [ ] Déployer sur GitHub Pages (GitHub Actions ou `gh-pages`)
- [ ] Tester le parcours complet invité + admin
