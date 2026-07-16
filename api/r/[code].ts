import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';

/**
 * Redirects a short dynamic-link code (/r/:code) to its current target.
 * Uses a Firebase service account (server-side only) to bypass Firestore
 * security rules and increment the scan counter.
 */
function getAdminApp() {
  const existing = getApps();
  if (existing.length) return existing[0];

  return initializeApp({
    credential: cert({
      projectId: process.env['FIREBASE_PROJECT_ID'],
      clientEmail: process.env['FIREBASE_CLIENT_EMAIL'],
      privateKey: (process.env['FIREBASE_PRIVATE_KEY'] ?? '').replace(/\\n/g, '\n'),
    }),
  });
}

export default async function handler(req: any, res: any) {
  const code = Array.isArray(req.query.code) ? req.query.code[0] : req.query.code;

  if (!code) {
    res.status(400).send('Code manquant.');
    return;
  }

  if (!process.env['FIREBASE_PROJECT_ID'] || !process.env['FIREBASE_CLIENT_EMAIL'] || !process.env['FIREBASE_PRIVATE_KEY']) {
    res.status(500).send('Configuration serveur manquante.');
    return;
  }

  const db = getFirestore(getAdminApp());
  const ref = db.collection('dynamicLinks').doc(code);
  const snapshot = await ref.get();

  const targetUrl = snapshot.exists ? snapshot.data()?.['target']?.url : undefined;
  if (!targetUrl) {
    res.status(404).send('Ce QR code est introuvable ou a été supprimé.');
    return;
  }

  await ref.update({
    scanCount: FieldValue.increment(1),
    lastScannedAt: FieldValue.serverTimestamp(),
  });

  res.writeHead(302, { Location: targetUrl });
  res.end();
}
