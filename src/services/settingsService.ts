import type { ProductSoundSettings } from "../types";

export interface BankAccount {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
}

export interface ShippingAddress {
  id: string;
  recipient: string;
  phone: string;
  address: string;
  isDefault: boolean;
}

export interface UserSettings {
  bankAccounts: BankAccount[];
  addresses: ShippingAddress[];
  notifications: {
    orderUpdates: boolean;
    promotions: boolean;
    accountActivity: boolean;
  };
  productSounds: ProductSoundSettings;
  personalizedRecommendations: boolean;
  deletionRequestedAt: string | null;
}

const createDefaultSettings = (): UserSettings => ({
  bankAccounts: [],
  addresses: [],
  notifications: {
    orderUpdates: true,
    promotions: false,
    accountActivity: true,
  },
  productSounds: {
    enabled: true,
    theme: "forza-horizon",
    volume: 20,
  },
  personalizedRecommendations: true,
  deletionRequestedAt: null,
});

const getStorageKey = (email: string) =>
  `japan-shop-settings:${email.trim().toLowerCase()}`;

export const settingsService = {
  load: (email: string): UserSettings => {
    try {
      const rawSettings = localStorage.getItem(getStorageKey(email));
      if (!rawSettings) return createDefaultSettings();

      const defaults = createDefaultSettings();
      const savedSettings = JSON.parse(rawSettings) as Partial<UserSettings>;

      return {
        ...defaults,
        ...savedSettings,
        notifications: {
          ...defaults.notifications,
          ...savedSettings.notifications,
        },
        productSounds: {
          ...defaults.productSounds,
          ...savedSettings.productSounds,
        },
      };
    } catch {
      return createDefaultSettings();
    }
  },

  save: (email: string, settings: UserSettings) => {
    localStorage.setItem(getStorageKey(email), JSON.stringify(settings));
  },
};
