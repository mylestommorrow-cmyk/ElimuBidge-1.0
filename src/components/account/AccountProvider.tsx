import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { onAuthStateChanged, signOut as firebaseSignOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";

const AccountContext = createContext<{
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}>({ user: null, loading: true, signOut: async () => {} });

export const useAccount = () => useContext(AccountContext);

export function AccountProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    let alive = true;
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!alive) return;
      setUser(firebaseUser);
      setLoading(false);
      void router.invalidate();
      if (!firebaseUser) {
        queryClient.clear();
      } else {
        void queryClient.invalidateQueries();
      }
    });

    return () => {
      alive = false;
      unsubscribe();
    };
  }, [router, queryClient]);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await firebaseSignOut(auth);
    setUser(null);
    try {
      localStorage.removeItem("elimubridge_active_profile");
    } catch {
      // ignore
    }
    await router.navigate({ to: "/auth", replace: true });
  }

  return (
    <AccountContext.Provider value={{ user, loading, signOut }}>{children}</AccountContext.Provider>
  );
}
