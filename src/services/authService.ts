import { seedAccounts } from "../types/accounts";
import type { Account } from "../types/accounts";
import type { AuthUser } from "../context/authContext";

const STORAGE_KEY = "japan-shop-accounts";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  gender?: Account["gender"];
  birthday?: string;
}

export type ProfileUpdate = Pick<
  Account,
  "name" | "email" | "phone" | "gender" | "birthday" | "avatar"
>;

const PROFILE_STORAGE_KEY = "japan-shop-profiles";

const loadProfiles = (): Record<string, ProfileUpdate> => {
  try {
    const rawProfiles = localStorage.getItem(PROFILE_STORAGE_KEY);
    return rawProfiles ? (JSON.parse(rawProfiles) as Record<string, ProfileUpdate>) : {};
  } catch {
    return {};
  }
};

const loadRegisteredAccounts = (): Account[] => {
  try {
    const storedAccounts = localStorage.getItem(STORAGE_KEY);
    return storedAccounts ? (JSON.parse(storedAccounts) as Account[]) : [];
  } catch {
    return [];
  }
};

const getAllAccounts = (): Account[] => {
  const accountsByEmail = new Map<string, Account>();

  [...seedAccounts, ...loadRegisteredAccounts()].forEach((account) => {
    accountsByEmail.set(account.email.toLowerCase(), account);
  });

  return [...accountsByEmail.values()];
};

const toAuthUser = (account: Account, profile?: ProfileUpdate): AuthUser => ({
  name: profile?.name ?? account.name,
  role: account.role,
  email: profile?.email ?? account.email,
  phone: profile?.phone ?? account.phone,
  gender: profile?.gender ?? account.gender,
  birthday: profile?.birthday ?? account.birthday,
  avatar: profile?.avatar ?? account.avatar,
});

export const authService = {
  login: (email: string, password: string): AuthUser | null => {
    const normalizedEmail = email.trim().toLowerCase();
    const profiles = loadProfiles();
    const account = getAllAccounts().find((item) => {
      const profile = profiles[item.email.toLowerCase()];
      const loginEmail = (profile?.email ?? item.email).toLowerCase();
      return loginEmail === normalizedEmail && item.password === password;
    });

    return account
      ? toAuthUser(account, profiles[account.email.toLowerCase()])
      : null;
  },

  register: ({ name, email, password }: RegisterData): string | null => {
    const normalizedEmail = email.trim().toLowerCase();
    const emailExists = getAllAccounts().some(
      (item) => item.email === normalizedEmail,
    );

    if (emailExists) {
      return "Email này đã được đăng ký.";
    }

    const registeredAccounts = loadRegisteredAccounts();
    registeredAccounts.push({
      email: normalizedEmail,
      password,
      name: name.trim(),
      role: "user",
      phone: "",
      gender: "",
      birthday: "",
    });

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(registeredAccounts),
    );

    return null;
  },

  updateProfile: (currentEmail: string, updates: ProfileUpdate): AuthUser | null => {
    const normalizedCurrentEmail = currentEmail.trim().toLowerCase();
    const normalizedEmail = updates.email.trim().toLowerCase();
    const accounts = getAllAccounts();
    const profiles = loadProfiles();
    const account = accounts.find((item) => {
      const originalEmail = item.email.toLowerCase();
      const profileEmail = profiles[originalEmail]?.email?.toLowerCase();
      return originalEmail === normalizedCurrentEmail || profileEmail === normalizedCurrentEmail;
    });

    if (!account) return null;

    const emailTaken = accounts.some(
      (item) => {
        const originalEmail = item.email.toLowerCase();
        const existingEmail = profiles[originalEmail]?.email?.toLowerCase() ?? originalEmail;
        return existingEmail === normalizedEmail && originalEmail !== account.email.toLowerCase();
      },
    );

    if (emailTaken) {
      throw new Error("Email này đã được sử dụng bởi tài khoản khác.");
    }

    const normalizedUpdates = { ...updates, email: normalizedEmail };
    profiles[account.email.toLowerCase()] = normalizedUpdates;
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profiles));

    return toAuthUser(account, normalizedUpdates);
  },

  changePassword: (
    email: string,
    currentPassword: string,
    newPassword: string,
  ): string | null => {
    const normalizedEmail = email.trim().toLowerCase();
    const profiles = loadProfiles();
    const account = getAllAccounts().find((item) => {
      const profileEmail = profiles[item.email.toLowerCase()]?.email;
      return (
        (item.email.toLowerCase() === normalizedEmail ||
          profileEmail?.toLowerCase() === normalizedEmail) &&
        item.password === currentPassword
      );
    });

    if (!account) return "Mật khẩu hiện tại không chính xác.";

    const registeredAccounts = loadRegisteredAccounts();
    const updatedAccount = { ...account, password: newPassword };
    const existingIndex = registeredAccounts.findIndex(
      (item) => item.email.toLowerCase() === account.email.toLowerCase(),
    );

    if (existingIndex >= 0) {
      registeredAccounts[existingIndex] = updatedAccount;
    } else {
      registeredAccounts.push(updatedAccount);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(registeredAccounts));
    return null;
  },
};
