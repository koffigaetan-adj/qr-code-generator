/** Centralized French UI strings. Do not hardcode user-facing text elsewhere. */
export const FR = {
  app: {
    title: 'Générateur de QR Code',
    metaDescription:
      "Créez, personnalisez et téléchargez des QR codes gratuitement : URL, Wi-Fi, vCard, réseaux sociaux et plus encore.",
    footer: 'Créé avec Angular — 100% gratuit, aucune donnée envoyée sur un serveur.',
  },

  nav: {
    home: 'Accueil',
    newQr: 'Nouveau QR code',
    batch: 'Génération en lot',
  },

  landing: {
    heroTitle: 'Créez des QR Codes Uniques et Magnifiques',
    heroSubtitle: 'Générez des QR codes haut de gamme en quelques clics. Ajoutez des cadres, des dégradés, et votre logo.',
    createButton: 'Créer un QR Code',
    featuresTitle: 'Pourquoi nous choisir ?',
    features: {
      customTitle: 'Personnalisation Avancée',
      customDesc: 'Cadres, dégradés, et intégration de logos.',
      formatsTitle: 'Multiples Formats',
      formatsDesc: 'URL, vCard, Wi-Fi, réseaux sociaux...',
      exportTitle: 'Export Haute Qualité',
      exportDesc: 'Téléchargement en PNG, SVG et PDF.',
    }
  },

  theme: {
    light: 'Thème clair',
    dark: 'Thème sombre',
    toggle: 'Basculer le thème',
  },

  wizard: {
    stepLabel: 'Étape',
    stepOf: 'sur',
    steps: {
      1: 'Choisir le type de QR code',
      2: 'Renseigner le contenu',
      3: 'Personnaliser et télécharger',
    },
    back: 'Retour',
    next: 'Suivant',
    restart: 'Recommencer',
    restartConfirm: 'Voulez-vous vraiment recommencer ? Le contenu actuel sera perdu.',
  },

  common: {
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    close: 'Fermer',
    copy: 'Copier',
    copied: 'Copié !',
    download: 'Télécharger',
    optional: '(optionnel)',
    required: 'Champ requis',
    add: 'Ajouter',
    remove: 'Retirer',
    loading: 'Chargement...',
    yes: 'Oui',
    no: 'Non',
    none: 'Aucun',
  },

  qrTypes: {
    sectionTitle: 'Quel type de QR code souhaitez-vous créer ?',
    sectionSubtitle: 'Sélectionnez une catégorie pour commencer.',
    url: {
      label: 'URL / Site web',
      description: 'Redirige vers une page web ou un site internet.',
    },
    text: {
      label: 'Texte simple',
      description: 'Affiche un message texte libre.',
    },
    vcard: {
      label: 'Carte de contact (vCard)',
      description: 'Partagez vos coordonnées professionnelles.',
    },
    wifi: {
      label: 'Wi-Fi',
      description: 'Connexion automatique à un réseau Wi-Fi.',
    },
    social: {
      label: 'Réseaux sociaux',
      description: 'Regroupez vos liens de réseaux sociaux.',
    },
    email: {
      label: 'Email',
      description: 'Prépare un email avec destinataire, sujet et message.',
    },
    sms: {
      label: 'SMS',
      description: 'Prépare un SMS avec numéro et message.',
    },
    pdf: {
      label: 'PDF / Fichier',
      description: 'Lien vers un document PDF ou un fichier téléchargeable.',
    },
    video: {
      label: 'Vidéo',
      description: 'Lien vers une vidéo en ligne.',
    },
    app: {
      label: 'Application mobile',
      description: "Lien vers l'App Store ou Google Play.",
    },
  },

  content: {
    sectionTitle: 'Renseignez le contenu de votre QR code',
    url: {
      fieldLabel: 'Adresse du site web',
      placeholder: 'https://exemple.com',
      errors: {
        required: "Veuillez renseigner une URL.",
        pattern: 'Veuillez saisir une URL valide (ex : https://exemple.com).',
      },
    },
    text: {
      fieldLabel: 'Votre texte',
      placeholder: 'Saisissez votre message ici...',
      errors: {
        required: 'Veuillez saisir un texte.',
        maxlength: 'Le texte ne doit pas dépasser {max} caractères.',
      },
    },
    vcard: {
      firstName: { label: 'Prénom', placeholder: 'Jean' },
      lastName: { label: 'Nom', placeholder: 'Dupont' },
      phone: { label: 'Téléphone', placeholder: '+33 6 12 34 56 78' },
      email: { label: 'Email', placeholder: 'jean.dupont@exemple.com' },
      company: { label: 'Société', placeholder: 'Mon Entreprise' },
      address: { label: 'Adresse', placeholder: '12 rue de Paris, 75001 Paris' },
      errors: {
        required: 'Ce champ est requis.',
        email: 'Veuillez saisir une adresse email valide.',
        phone: 'Veuillez saisir un numéro de téléphone valide.',
        atLeastOne: 'Veuillez renseigner au moins le nom ou le téléphone.',
      },
    },
    wifi: {
      ssid: { label: 'Nom du réseau (SSID)', placeholder: 'MonReseauWifi' },
      password: { label: 'Mot de passe', placeholder: 'Mot de passe Wi-Fi' },
      encryption: {
        label: 'Type de chiffrement',
        options: { WPA: 'WPA/WPA2', WEP: 'WEP', nopass: 'Aucun (réseau ouvert)' },
      },
      hidden: { label: 'Réseau masqué' },
      errors: {
        required: 'Veuillez renseigner le nom du réseau.',
        passwordRequired: 'Veuillez renseigner un mot de passe ou choisir "Aucun".',
      },
    },
    social: {
      addLink: 'Ajouter un réseau social',
      networkLabel: 'Réseau',
      urlLabel: 'Lien du profil',
      urlPlaceholder: 'https://...',
      networks: {
        instagram: 'Instagram',
        facebook: 'Facebook',
        linkedin: 'LinkedIn',
        tiktok: 'TikTok',
        x: 'X (Twitter)',
        youtube: 'YouTube',
      },
      errors: {
        required: 'Veuillez saisir un lien.',
        pattern: 'Veuillez saisir un lien valide.',
        atLeastOne: 'Veuillez ajouter au moins un réseau social.',
      },
    },
    email: {
      to: { label: 'Destinataire', placeholder: 'contact@exemple.com' },
      subject: { label: 'Sujet', placeholder: 'Sujet du message' },
      body: { label: 'Message', placeholder: 'Corps du message...' },
      errors: {
        required: "Veuillez renseigner l'adresse email du destinataire.",
        email: 'Veuillez saisir une adresse email valide.',
      },
    },
    sms: {
      phone: { label: 'Numéro de téléphone', placeholder: '+33 6 12 34 56 78' },
      message: { label: 'Message', placeholder: 'Votre message...' },
      errors: {
        required: 'Veuillez renseigner un numéro de téléphone.',
        phone: 'Veuillez saisir un numéro de téléphone valide.',
      },
    },
    pdf: {
      fieldLabel: 'Lien vers le fichier PDF',
      placeholder: 'https://exemple.com/document.pdf',
      errors: {
        required: 'Veuillez renseigner un lien vers le fichier.',
        pattern: 'Veuillez saisir une URL valide.',
      },
    },
    video: {
      fieldLabel: 'Lien vers la vidéo',
      placeholder: 'https://youtube.com/watch?v=...',
      errors: {
        required: 'Veuillez renseigner un lien vidéo.',
        pattern: 'Veuillez saisir une URL valide.',
      },
    },
    app: {
      platform: {
        label: "Plateforme",
        options: {
          auto: 'Détection automatique',
          ios: 'iOS (App Store)',
          android: 'Android (Google Play)',
        },
      },
      iosUrl: { label: "Lien App Store", placeholder: 'https://apps.apple.com/...' },
      androidUrl: { label: 'Lien Google Play', placeholder: 'https://play.google.com/...' },
      errors: {
        required: 'Veuillez renseigner au moins un lien de téléchargement.',
        pattern: 'Veuillez saisir une URL valide.',
        iosRequired: "Veuillez renseigner le lien App Store.",
        androidRequired: 'Veuillez renseigner le lien Google Play.',
      },
    },
  },

  design: {
    sectionTitle: 'Personnalisez votre QR code',
    previewTitle: 'Aperçu en direct',
    colorsTitle: 'Couleurs',
    foregroundColor: 'Couleur du premier plan',
    backgroundColor: 'Couleur du fond',
    gradient: {
      enable: 'Activer le dégradé',
      colorStart: 'Couleur de départ',
      colorEnd: "Couleur d'arrivée",
      rotation: 'Angle du dégradé',
    },
    dotsTitle: 'Style des points',
    dotStyles: {
      square: 'Carré',
      rounded: 'Arrondi',
      dots: 'Points',
    },
    cornersTitle: 'Style des coins',
    cornerStyles: {
      square: 'Carré',
      rounded: 'Arrondi',
      'extra-rounded': 'Extra-arrondi',
    },
    logoTitle: 'Logo',
    logoUpload: 'Choisir une image',
    logoRemove: 'Retirer le logo',
    logoSize: 'Taille du logo',
    logoHint:
      "Le niveau de correction d'erreur passe automatiquement à \"Élevé\" pour garantir la lisibilité du QR code.",
    eccTitle: "Niveau de correction d'erreur",
    eccLevels: {
      L: 'Faible (L)',
      M: 'Moyen (M)',
      Q: 'Élevé (Q)',
      H: 'Maximal (H)',
    },
    frameTitle: 'Cadre',
    frameEnable: 'Ajouter un cadre',
    frameStylesTitle: 'Style du cadre',
    frameStyles: {
      bottom: 'Bannière bas',
      top: 'Bannière haut',
      solid: 'Boîte pleine',
      outline: 'Bordure épaisse',
      'app-store': 'Bouton App Store',
      'play-store': 'Bouton Google Play',
    },
    frameCtaText: "Texte d'appel à l'action",
    frameCtaPlaceholder: 'Scannez-moi',
    frameColor: 'Couleur du cadre',
    frameTextColor: 'Couleur du texte',
    presetsTitle: 'Préréglages',
    presetsSave: 'Enregistrer le préréglage actuel',
    presetsSaveNamePrompt: 'Nom du préréglage',
    presetsEmpty: 'Aucun préréglage enregistré.',
    presetsLoad: 'Charger',
    presetsDelete: 'Supprimer le préréglage',
  },

  export: {
    sectionTitle: 'Télécharger',
    format: 'Format',
    resolution: 'Résolution',
    downloadButton: 'Télécharger le QR code',
    shareTitle: 'Partager',
    shareCopyLink: 'Copier le lien partageable',
    shareCopied: 'Lien copié dans le presse-papiers !',
  },

  batch: {
    title: 'Génération en lot',
    subtitle: 'Importez une liste d\'URLs (CSV) pour générer plusieurs QR codes à la fois.',
    uploadCsv: 'Importer un fichier CSV',
    dropHint: 'Glissez-déposez un fichier CSV, ou cliquez pour sélectionner.',
    columnHint: 'Le fichier doit contenir une URL par ligne (une colonne "url" optionnelle).',
    generateAll: 'Générer tous les QR codes',
    downloadAll: 'Télécharger tout (ZIP)',
    entriesFound: 'entrées trouvées',
    errors: {
      empty: 'Le fichier CSV ne contient aucune URL valide.',
      invalidFile: 'Veuillez importer un fichier CSV valide.',
    },
  },

  errors: {
    genericTitle: 'Une erreur est survenue',
    qrGenerationFailed: 'Impossible de générer le QR code. Veuillez vérifier le contenu saisi.',
    fileTooLarge: 'Le fichier est trop volumineux (5 Mo maximum).',
    invalidImageFile: 'Veuillez sélectionner un fichier image valide (PNG, JPG, SVG).',
  },
} as const;
