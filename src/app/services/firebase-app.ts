import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';

/** Single shared Firebase app instance, used by the auth and Firestore services. */
export const firebaseApp = initializeApp(environment.firebaseConfig);
