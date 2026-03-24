import admin from 'firebase-admin';
import { config } from '../config/index.js';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: config.firebase.projectId,
      clientEmail: config.firebase.clientEmail,
      privateKey: config.firebase.privateKey,
    }),
  });
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();