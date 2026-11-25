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
  personalizedRecommendations: true,
  deletionRequestedAt: null,
});

const getStorageKey = (email: string) =>
  `japan-shop-settings:${email.trim().toLowerCase()}`;

export const settingsService = {
  load: (email: string): UserSettings => {
    try {
      const rawSettings = localStorage.getItem(getStorageKey(email));
      return rawSettings
        ? { ...createDefaultSettings(), ...JSON.parse(rawSettings) }
        : createDefaultSettings();
    } catch {
      return createDefaultSettings();
    }
  },

  save: (email: string, settings: UserSettings) => {
    localStorage.setItem(getStorageKey(email), JSON.stringify(settings));
  },
};
