/**
 * Configuration publique Firebase (protégée côté serveur par les règles
 * de sécurité Firestore). À remplacer par les valeurs de votre projet —
 * voir FIREBASE_SETUP.md.
 */
export const environment = {
  firebaseConfig: {
    apiKey: 'YOUR-API-KEY',
    authDomain: 'YOUR-PROJECT.firebaseapp.com',
    projectId: 'YOUR-PROJECT',
    storageBucket: 'YOUR-PROJECT.appspot.com',
    messagingSenderId: 'YOUR-SENDER-ID',
    appId: 'YOUR-APP-ID',
  },
};
