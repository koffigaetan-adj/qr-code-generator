# Configuration Firebase — QR codes dynamiques

Cette fonctionnalité (lien modifiable après impression) nécessite un projet [Firebase](https://console.firebase.google.com) (plan gratuit Spark, aucune carte bancaire requise). Aucune de ces étapes n'est automatisable : suivez-les dans l'ordre.

## 1. Créer le projet Firebase

1. Rendez-vous sur [console.firebase.google.com](https://console.firebase.google.com) et créez un projet (plan Spark, gratuit).
2. Dans le projet, ajoutez une **application Web** (icône `</>`) — vous n'avez pas besoin d'Hébergement Firebase, juste de la config.

## 2. Activer la connexion Google

1. **Authentication → Sign-in method → Google** → activer. C'est tout : Firebase gère automatiquement la configuration OAuth (contrairement à d'autres fournisseurs, pas besoin de créer manuellement un client OAuth séparé).
2. Dans **Authentication → Settings → Authorized domains**, ajoutez votre domaine Vercel (ex. `votre-app.vercel.app`). `localhost` y est déjà par défaut.

## 3. Créer Firestore et déployer les règles

1. **Firestore Database → Créer une base de données** (mode production).
2. Ouvrez l'onglet **Règles** et collez le contenu de [`firestore.rules`](./firestore.rules), puis publiez.
3. La première fois que l'application liste les QR codes dynamiques d'un utilisateur, Firestore peut demander un index composite (message d'erreur avec un lien direct dans la console du navigateur) — cliquez simplement sur ce lien pour le créer.

## 4. Configurer l'application Angular

1. **Project Settings (⚙) → General → Vos applications** → copiez l'objet de config `firebaseConfig`.
2. Éditez [`src/environments/environment.ts`](./src/environments/environment.ts) avec ces valeurs :

```ts
export const environment = {
  firebaseConfig: {
    apiKey: '...',
    authDomain: '...',
    projectId: '...',
    storageBucket: '...',
    messagingSenderId: '...',
    appId: '...',
  },
};
```

Ces valeurs sont publiques par conception (protégées par les règles de sécurité Firestore) — pas de risque à les committer.

## 5. Configurer la fonction de redirection Vercel

La fonction serverless `api/r/[code].ts` a besoin d'un **compte de service** (secret, ne jamais l'exposer côté client) :

1. **Project Settings → Comptes de service → Générer une nouvelle clé privée** — télécharge un fichier JSON.
2. Dans Vercel : **Project Settings → Environment Variables**, ajoutez :
   - `FIREBASE_PROJECT_ID` = `project_id` du JSON
   - `FIREBASE_CLIENT_EMAIL` = `client_email` du JSON
   - `FIREBASE_PRIVATE_KEY` = `private_key` du JSON (collez-la telle quelle, avec les `\n` ; le code s'occupe de les convertir en retours à la ligne réels)

Sans ces variables, `/r/:code` répondra une erreur 500.

## Limites à connaître

- `/r/:code` est une fonction serverless : elle ne fonctionne que sur Vercel (ou via `vercel dev` en local), pas avec `ng serve` seul.
- Le mode "lien dynamique" n'est proposé que pour les types URL, PDF et Vidéo.
