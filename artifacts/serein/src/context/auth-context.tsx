import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { getFirebaseAuth, missingFirebaseConfig } from "@/lib/firebase";

type AuthContextValue = {
  user: User | null;
  isReady: boolean;
  isConfigured: boolean;
  missingConfig: string[];
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);
  const auth = getFirebaseAuth();
  const isConfigured = Boolean(auth);

  useEffect(() => {
    if (!auth) {
      setIsReady(true);
      return;
    }

    void setPersistence(auth, browserLocalPersistence);

    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setIsReady(true);
    });
  }, [auth]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!auth) throw new Error("Firebase is not configured.");
      await signInWithEmailAndPassword(auth, email, password);
    },
    [auth],
  );

  const signUp = useCallback(
    async (email: string, password: string) => {
      if (!auth) throw new Error("Firebase is not configured.");
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(credential.user);
    },
    [auth],
  );

  const requestPasswordReset = useCallback(
    async (email: string) => {
      if (!auth) throw new Error("Firebase is not configured.");
      await sendPasswordResetEmail(auth, email);
    },
    [auth],
  );

  const signInWithGoogle = useCallback(async () => {
    if (!auth) throw new Error("Firebase is not configured.");
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    await signInWithPopup(auth, provider);
  }, [auth]);

  const signOut = useCallback(async () => {
    if (!auth) return;
    await firebaseSignOut(auth);
  }, [auth]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isReady,
      isConfigured,
      missingConfig: missingFirebaseConfig,
      signIn,
      signUp,
      signInWithGoogle,
      requestPasswordReset,
      signOut,
    }),
    [isConfigured, isReady, requestPasswordReset, signIn, signInWithGoogle, signOut, signUp, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
