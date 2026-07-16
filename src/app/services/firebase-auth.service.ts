import { Injectable, computed, signal } from '@angular/core';
import { Auth, GoogleAuthProvider, User, getAuth, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { firebaseApp } from './firebase-app';

/** Wraps Firebase Auth (Google sign-in) and exposes the user as a signal. */
@Injectable({ providedIn: 'root' })
export class FirebaseAuthService {
  readonly auth: Auth = getAuth(firebaseApp);

  readonly user = signal<User | null>(null);
  readonly isSignedIn = computed(() => !!this.user());

  constructor() {
    onAuthStateChanged(this.auth, (user) => this.user.set(user));
  }

  async signInWithGoogle(): Promise<void> {
    await signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  async signOut(): Promise<void> {
    await signOut(this.auth);
  }
}
