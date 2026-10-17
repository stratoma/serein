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
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { getFirebaseAuth, missingFirebaseConfig } from "@/lib/firebase";

type AuthContextValue = {
  user: User | null;
  isReady: boolean;
  isConfigured: boolean;
  googleAuthErrorCode: string | null;
  missingConfig: string[];
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function getAuthErrorCode(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    return error.code;
  }

  return "auth/unknown";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [googleAuthErrorCode, setGoogleAuthErrorCode] = useState<string | null>(null);
  const auth = getFirebaseAuth();
  const isConfigured = Boolean(auth);

  useEffect(() => {
    if (!auth) {
      setIsReady(true);
      return;
    }

    void setPersistence(auth, browserLocalPersistence);

    void getRedirectResult(auth).catch((error: unknown) => {
      setGoogleAuthErrorCode(getAuthErrorCode(error));
    });

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

    try {
      await signInWithPopup(auth, provider);
      setGoogleAuthErrorCode(null);
    } catch (error: unknown) {
      const errorCode = getAuthErrorCode(error);

      // Redirect is retained only for browsers that cannot open an OAuth popup,
      // such as some mobile or embedded browser environments.
      if (
        errorCode === "auth/popup-blocked" ||
        errorCode === "auth/operation-not-supported-in-this-environment"
      ) {
        try {
          await signInWithRedirect(auth, provider);
          return;
        } catch (redirectError: unknown) {
          setGoogleAuthErrorCode(getAuthErrorCode(redirectError));
          throw redirectError;
        }
      }

      setGoogleAuthErrorCode(errorCode);
      throw error;
    }
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
      googleAuthErrorCode,
      missingConfig: missingFirebaseConfig,
      signIn,
      signUp,
      signInWithGoogle,
      requestPasswordReset,
      signOut,
    }),
    [googleAuthErrorCode, isConfigured, isReady, requestPasswordReset, signIn, signInWithGoogle, signOut, signUp, user],
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
