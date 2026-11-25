import { createContext } from "react";

export type Role = "admin" | "user";
export type Gender = "male" | "female" | "other" | "";

export interface AuthUser {
  name: string;
  role: Role;
  email?: string;
  phone?: string;
  gender?: Gender;
  birthday?: string;
  avatar?: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  login: (user: AuthUser, remember?: boolean) => void;
  updateUser: (user: AuthUser) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
