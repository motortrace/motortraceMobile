// src/context/AuthContext.tsx
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import api from "../api/api";
import { login as loginApi, logout as logoutApi } from "../api/auth";
import { getToken, removeToken, setSupabaseUserId, removeSupabaseUserId } from "../utils/authStorage";

interface User {
  id: string;
  email: string;
  role: string;
  isRegistrationComplete: boolean;
  supabaseUserId?: string; // Add this field if available from backend
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  supabaseUserId?: string; // Expose supabaseUserId for convenience
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const token = await getToken();
        if (token) {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const res = await api.get("/auth/me"); // fetch current user
          setUser(res.data.user);
        }
      } catch (e) {
        await removeToken();
      } finally {
        setLoading(false);
      }
    };
    bootstrapAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await loginApi({ email, password });
    setUser(data.user);
    if (data.user && data.user.id) {
      await setSupabaseUserId(data.user.id);
    }
  };


const logout = async () => {
  try {
    await logoutApi();
  } catch (err) {
    // We already remove token in logoutApi finally, but keep defensive here
    console.warn('Logout API failed, continuing to clear local state', err);
  } finally {
    // Clear axios default header in case it was set at bootstrap
    try {
      delete api.defaults.headers.common['Authorization'];
    } catch (_) { /* ignore */ }

    // Remove any locally stored identifiers
    await removeSupabaseUserId();

    // Clear local user state so UI updates immediately
    setUser(null);
  }
};

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, supabaseUserId: user?.supabaseUserId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
