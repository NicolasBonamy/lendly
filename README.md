# Lendly

Application Next.js pour gérer une liste de **prêts** et d’**emprunts** de matériel.

Les données sont persistées dans **Supabase** (Postgres + Storage) et accessibles sur plusieurs appareils après connexion par magic link.

## Démarrage

```bash
npm install
cp .env.example .env.local
```

Renseigne dans `.env.local` :

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Dans le projet Supabase :

1. Exécute [`supabase/schema.sql`](supabase/schema.sql) dans le SQL Editor (table `loans`, RLS, bucket `loan-photos`).
2. Si le projet existait déjà avant les emprunts, exécute aussi [`supabase/add-loan-kind.sql`](supabase/add-loan-kind.sql) (ajoute la colonne `kind`).
3. Auth → URL Configuration :
   - **Site URL** : `https://lendlyapp.netlify.app` (prod) ou `http://localhost:3000` (dev)
   - **Redirect URLs** (ajouter les deux) :
     - `http://localhost:3000/auth/callback`
     - `https://lendlyapp.netlify.app/auth/callback`
4. Auth → Providers : e-mail / magic link activé.

Sur Netlify, définir aussi `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` dans *Site configuration → Environment variables*.

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000), entrer ton e-mail, puis ouvrir le lien reçu.

```bash
npm test
```

Si des prêts existaient déjà dans `localStorage` (clé `lendly.loans`), un bandeau propose de les importer après la première connexion. Ils sont importés comme des prêts.

## Branches

- `master` : branche principale (à définir comme branche par défaut sur GitHub)
- `develop` : branche de développement
