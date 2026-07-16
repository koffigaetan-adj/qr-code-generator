# Générateur de QR Code

Application web permettant de créer, personnaliser et télécharger des QR codes : URL, texte, vCard, Wi-Fi, réseaux sociaux, email, SMS, PDF, vidéo et applications mobiles.

Construite avec **Angular** (composants standalone, Angular Signals pour la gestion d'état), **Tailwind CSS** et la librairie [`qr-code-styling`](https://www.npmjs.com/package/qr-code-styling). La génération, le design et l'export sont 100% côté client (y compris l'upload de logo) — aucune donnée n'est envoyée à un serveur, **sauf si vous activez volontairement un lien dynamique** (fonctionnalité optionnelle décrite plus bas).

## Fonctionnalités

- Assistant en 3 étapes : choix du type de QR code → contenu → design & téléchargement.
- 10 types de contenu : URL, texte, vCard, Wi-Fi, réseaux sociaux, email, SMS, PDF, vidéo, application (App Store / Google Play, avec redirection automatique iOS/Android sans backend).
- Personnalisation complète : couleurs (unies ou dégradé), style des points et des coins, logo centré, cadre avec texte d'appel à l'action.
- Augmentation automatique du niveau de correction d'erreur (ECC) sur "Élevé" lorsqu'un logo est ajouté, pour garantir la lisibilité.
- Aperçu en direct pendant toute l'édition.
- Export en PNG (512/1024/2048 px), SVG (vectoriel) et PDF.
- **QR codes dynamiques** (optionnel, nécessite un compte Google) : pour les types URL/PDF/Vidéo, le QR encode un lien court stable — vous pouvez changer sa destination à tout moment depuis "Mes QR codes", sans réimprimer le QR. Inclut un compteur de scans. Voir [`FIREBASE_SETUP.md`](./FIREBASE_SETUP.md) pour la configuration (Firebase + Google Auth).
- Bonus : thème clair/sombre, préréglages de design sauvegardés dans le `localStorage`, lien partageable, génération en lot à partir d'un fichier CSV (export ZIP).

## Prérequis

- Node.js 20 ou supérieur
- npm

## Installation

```bash
npm install
```

## Développement

Lancer le serveur de développement :

```bash
npm start
# ou
ng serve
```

Puis ouvrir [http://localhost:4200](http://localhost:4200) dans votre navigateur. L'application se recharge automatiquement à chaque modification.

## Build de production

```bash
ng build
```

Les fichiers statiques sont générés dans `dist/app/browser/`. L'application est statique (aucun serveur requis pour la génération/le design/l'export de QR codes classiques).

## QR codes dynamiques (optionnel)

La fonctionnalité "lien modifiable après impression" nécessite un projet Firebase (Firestore + Auth Google) et une fonction serverless Vercel (`api/r/[code].ts`). Suivez le guide pas-à-pas dans [`FIREBASE_SETUP.md`](./FIREBASE_SETUP.md) avant d'utiliser cette option — sans cette configuration, le reste de l'application fonctionne normalement, seul le bouton "Rendre ce lien modifiable" sera inopérant.

## Déploiement sur Vercel

Le fichier [`vercel.json`](./vercel.json) à la racine configure :
- le répertoire de sortie (`dist/app/browser`),
- les réécritures nécessaires pour que le routage côté client (Angular Router) fonctionne correctement sur toutes les routes,
- la réécriture `/r/:code → /api/r/:code` pour les liens dynamiques.

Pour déployer :

```bash
npm install -g vercel   # si Vercel CLI n'est pas déjà installé
vercel --prod
```

Vercel détecte automatiquement la commande de build (`npm run build`), le répertoire de sortie et la fonction serverless `api/r/[code].ts` grâce à `vercel.json`. Si vous utilisez les QR codes dynamiques, pensez à définir les variables d'environnement `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL` et `FIREBASE_PRIVATE_KEY` dans les paramètres du projet Vercel (voir `FIREBASE_SETUP.md`).

## Structure du projet

```
api/r/[code].ts               # Fonction serverless Vercel : redirection des liens dynamiques
firestore.rules               # Règles de sécurité à déployer dans votre projet Firebase
src/environments/             # Configuration publique Firebase (firebaseConfig)
src/app/
├── i18n/fr.ts                 # Toutes les chaînes de texte en français
├── models/                    # Types TypeScript (QR types, contenu, design, dynamic-link)
├── services/                  # Encodage du contenu, génération QR, export, thème, presets, Firebase...
├── validators/                # Validateurs de formulaires réactifs
└── components/
    ├── landing/               # Page d'accueil
    ├── wizard/                # Les 3 étapes de l'assistant (dont le lien dynamique à l'étape 3)
    ├── dashboard/              # "Mes QR codes" : gestion des liens dynamiques
    ├── batch/                 # Génération en lot depuis un CSV
    └── shared/                # Icônes, sélecteur de couleur, aperçu QR, etc.
```

## Tests

```bash
ng test
```
