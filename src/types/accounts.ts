import type { AuthUser } from "../context/authContext";

export interface Account extends AuthUser {
  email: string;
  password: string;
}

export const seedAccounts: Account[] = [
  { email: "admin@gmail.com", password: "admin123", name: "Quản Trị Viên", role: "admin" },
  { email: "user@gmail.com", password: "user123", name: "Người dùng", role: "user" },
];
