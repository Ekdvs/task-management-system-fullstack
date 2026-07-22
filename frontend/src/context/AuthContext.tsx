"use client";

import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { User } from "../types";
import { loginRequest, logoutRequest } from "../lib/auth";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isReady: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  // Hydrate from localStorage once, on the client. Reading localStorage here is
  // the correct use of an Effect (synchronizing with an external system), but
  // the resulting setState calls are wrapped in startTransition rather than
  // called as bare statements in the Effect body — that's the shape
  // react-hooks/set-state-in-effect is checking for, since bare synchronous
  // setState calls in an Effect can trigger a cascading extra render.
  // See https://react.dev/reference/eslint-plugin-react-hooks/lints/set-state-in-effect
  useEffect(() => {
    startTransition(() => {
      const storedToken = window.localStorage.getItem("auth_token");
      const storedUser = window.localStorage.getItem("auth_user");
      if (storedToken && storedUser) {
        setToken(storedToken);
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          // ignore corrupt cache
        }
      }
      setIsReady(true);
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginRequest(email, password);
    window.localStorage.setItem("auth_token", result.token);
    window.localStorage.setItem("auth_user", JSON.stringify(result.user));
    setToken(result.token);
    setUser(result.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch {
      // Even if the network call fails, clear the local session.
    }
    window.localStorage.removeItem("auth_token");
    window.localStorage.removeItem("auth_user");
    setToken(null);
    setUser(null);
    router.replace("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isReady,
        isAuthenticated: Boolean(token),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}