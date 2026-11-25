import { useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./authContext";
import type { AuthUser } from "./authContext";

const STORAGE_KEY = "japan-shop-user";

const loadUser = (): AuthUser | null => {
  try {
    const storedUser =
      localStorage.getItem(STORAGE_KEY) ??
      sessionStorage.getItem(STORAGE_KEY);

    return storedUser ? (JSON.parse(storedUser) as AuthUser) : null;
  } catch {
    return null;
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(loadUser);

  const login = (nextUser: AuthUser, remember = true) => {
    const storage = remember ? localStorage : sessionStorage;
    const otherStorage = remember ? sessionStorage : localStorage;

    otherStorage.removeItem(STORAGE_KEY);
    storage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const updateUser = (updatedUser: AuthUser) => {
    const storage = localStorage.getItem(STORAGE_KEY)
      ? localStorage
      : sessionStorage;
    storage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
