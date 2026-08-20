# Lendly

Application Next.js pour gérer une liste de prêts de matériel.

Les prêts sont persistés dans **Supabase** (Postgres + Storage) et accessibles sur plusieurs appareils après connexion par magic link.

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
2. Auth → URL Configuration : Site URL `http://localhost:3000` et Redirect URL `http://localhost:3000/auth/callback`.
3. Auth → Providers : e-mail / magic link activé.

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000), entrer ton e-mail, puis ouvrir le lien reçu.

```bash
npm test
```

Si des prêts existaient déjà dans `localStorage` (clé `lendly.loans`), un bandeau propose de les importer après la première connexion.

## Branches

- `master` : branche principale (à définir comme branche par défaut sur GitHub)
- `develop` : branche de développement
