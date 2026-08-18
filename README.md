# Lendly

Application Next.js pour gérer une liste de prêts de matériel.

La première version fonctionne **en local** (persistance navigateur). L’authentification et une base de données viendront ensuite.

## Démarrage

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

Les prêts sont stockés dans `localStorage` (clé `lendly.loans`) : ajout, modification et suppression restent sur cet appareil.

```bash
npm test
```

## Branches

- `master` : branche principale (à définir comme branche par défaut sur GitHub)
- `develop` : branche de développement
