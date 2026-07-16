import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { DynamicLink, DynamicLinkTarget, DynamicLinkType } from '../models/dynamic-link.model';
import { FirebaseAuthService } from './firebase-auth.service';
import { firebaseApp } from './firebase-app';

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
const COLLECTION_NAME = 'dynamicLinks';

function generateCode(length = 8): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes, (b) => CODE_CHARS[b % CODE_CHARS.length]).join('');
}

interface DynamicLinkDoc {
  userId: string;
  qrType: DynamicLinkType;
  target: DynamicLinkTarget;
  scanCount: number;
  lastScannedAt: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

function mapDoc(id: string, data: DynamicLinkDoc): DynamicLink {
  return {
    id,
    userId: data.userId,
    qrType: data.qrType,
    target: data.target,
    scanCount: data.scanCount,
    lastScannedAt: data.lastScannedAt ? data.lastScannedAt.toDate().toISOString() : null,
    createdAt: data.createdAt.toDate().toISOString(),
    updatedAt: data.updatedAt.toDate().toISOString(),
  };
}

/** CRUD for dynamicLinks, scoped to the signed-in user via Firestore security rules. */
@Injectable({ providedIn: 'root' })
export class DynamicLinkService {
  private readonly auth = inject(FirebaseAuthService);
  private readonly db: Firestore = getFirestore(firebaseApp);

  buildShortUrl(id: string): string {
    return `${window.location.origin}/r/${id}`;
  }

  async create(qrType: DynamicLinkType, target: DynamicLinkTarget): Promise<DynamicLink> {
    const userId = this.auth.user()?.uid;
    if (!userId) throw new Error('Not authenticated');

    const id = generateCode();
    const now = serverTimestamp();
    await setDoc(doc(this.db, COLLECTION_NAME, id), {
      userId,
      qrType,
      target,
      scanCount: 0,
      lastScannedAt: null,
      createdAt: now,
      updatedAt: now,
    });

    return {
      id,
      userId,
      qrType,
      target,
      scanCount: 0,
      lastScannedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async list(): Promise<DynamicLink[]> {
    const userId = this.auth.user()?.uid;
    if (!userId) return [];

    const snapshot = await getDocs(
      query(collection(this.db, COLLECTION_NAME), where('userId', '==', userId), orderBy('createdAt', 'desc')),
    );
    return snapshot.docs.map((docSnapshot) => mapDoc(docSnapshot.id, docSnapshot.data() as DynamicLinkDoc));
  }

  async updateTarget(id: string, target: DynamicLinkTarget): Promise<void> {
    await updateDoc(doc(this.db, COLLECTION_NAME, id), { target, updatedAt: serverTimestamp() });
  }

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(this.db, COLLECTION_NAME, id));
  }
}
