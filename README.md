# Générateur de QR Code

Application web permettant de créer, personnaliser et télécharger des QR codes : URL, texte, vCard, Wi-Fi, réseaux sociaux, email, SMS, PDF, vidéo et applications mobiles.

Construite avec **Angular** (composants standalone, Angular Signals pour la gestion d'état), **Tailwind CSS** et la librairie [`qr-code-styling`](https://www.npmjs.com/package/qr-code-styling). Aucune donnée n'est envoyée à un serveur : tout (y compris l'upload de logo) est traité côté client, dans le navigateur.

## Fonctionnalités

- Assistant en 3 étapes : choix du type de QR code → contenu → design & téléchargement.
- 10 types de contenu : URL, texte, vCard, Wi-Fi, réseaux sociaux, email, SMS, PDF, vidéo, application (App Store / Google Play, avec redirection automatique iOS/Android sans backend).
- Personnalisation complète : couleurs (unies ou dégradé), style des points et des coins, logo centré, cadre avec texte d'appel à l'action.
- Augmentation automatique du niveau de correction d'erreur (ECC) sur "Élevé" lorsqu'un logo est ajouté, pour garantir la lisibilité.
- Aperçu en direct pendant toute l'édition.
- Export en PNG (512/1024/2048 px), SVG (vectoriel) et PDF.
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

Les fichiers statiques sont générés dans `dist/app/browser/`. L'application est 100% statique (aucun serveur requis).

## Déploiement sur Vercel

Le fichier [`vercel.json`](./vercel.json) à la racine configure :
- le répertoire de sortie (`dist/app/browser`),
- les réécritures nécessaires pour que le routage côté client (Angular Router) fonctionne correctement sur toutes les routes.

Pour déployer :

```bash
npm install -g vercel   # si Vercel CLI n'est pas déjà installé
vercel --prod
```

Vercel détecte automatiquement la commande de build (`npm run build`) et le répertoire de sortie grâce à `vercel.json`. Aucune variable d'environnement n'est nécessaire.

## Structure du projet

```
src/app/
├── i18n/fr.ts                 # Toutes les chaînes de texte en français
├── models/                    # Types TypeScript (QR types, contenu, design)
├── services/                  # Encodage du contenu, génération QR, export, thème, presets...
├── validators/                # Validateurs de formulaires réactifs
└── components/
    ├── landing/               # Page d'accueil
    ├── wizard/                # Les 3 étapes de l'assistant
    ├── batch/                 # Génération en lot depuis un CSV
    └── shared/                # Icônes, sélecteur de couleur, aperçu QR, etc.
```

## Tests

```bash
ng test
```
