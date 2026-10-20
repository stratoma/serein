import { deleteApp, initializeApp, type FirebaseApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  inMemoryPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  type Auth,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
};

const requiredConfig = [
  ["VITE_FIREBASE_API_KEY", firebaseConfig.apiKey],
  ["VITE_FIREBASE_AUTH_DOMAIN", firebaseConfig.authDomain],
  ["VITE_FIREBASE_PROJECT_ID", firebaseConfig.projectId],
  ["VITE_FIREBASE_APP_ID", firebaseConfig.appId],
];

export const missingFirebaseConfig = requiredConfig
  .filter(([, value]) => !value)
  .map(([key]) => key);

let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;

export function getFirebaseAuth() {
  if (missingFirebaseConfig.length > 0) {
    return null;
  }

  if (!firebaseApp) {
    firebaseApp = initializeApp(firebaseConfig);
  }

  if (!firebaseAuth) {
    firebaseAuth = getAuth(firebaseApp);
  }

  return firebaseAuth;
}

function firebaseErrorCode(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && typeof error.code === "string"
    ? error.code
    : "auth/unknown";
}

/**
 * Creates a separate, in-memory Firebase session so adding a dashboard user
 * never signs the administrator out of their own browser session.
 */
export async function provisionAdminAccount(email: string, password: string) {
  if (missingFirebaseConfig.length > 0) throw new Error("Firebase is not configured.");
  const app = initializeApp(firebaseConfig, `admin-provision-${Date.now()}-${Math.random()}`);
  const auth = getAuth(app);
  try {
    await setPersistence(auth, inMemoryPersistence);
    let credential;
    try {
      credential = await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      // Retrying after a temporary API failure must be possible without asking
      // an administrator to locate a Firebase user ID.
      if (firebaseErrorCode(error) !== "auth/email-already-in-use") throw error;
      credential = await signInWithEmailAndPassword(auth, email, password);
    }
    return credential.user.getIdToken();
  } finally {
    await signOut(auth).catch(() => undefined);
    await deleteApp(app).catch(() => undefined);
  }
}
