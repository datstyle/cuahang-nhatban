import type { ProductSoundTheme } from "../types";

export type ProductSoundAction = "hover" | "click";

export interface ProductSoundOption {
  value: ProductSoundTheme;
  label: string;
  hoverFile: string;
  clickFile: string;
}

export const PRODUCT_SOUND_OPTIONS: ProductSoundOption[] = [
  {
    value: "forza-horizon",
    label: "Forza Horizon",
    hoverFile: "/sounds/forza-horizon-hover.mp3",
    clickFile: "/sounds/forza-horizon-click.mp3",
  },
  {
    value: "gta-v",
    label: "Grand Theft Auto V",
    hoverFile: "/sounds/gta-v-hover.mp3",
    clickFile: "/sounds/gta-v-click.mp3",
  },
  {
    value: "red-dead-redemption-2",
    label: "Red Dead Redemption 2",
    hoverFile: "/sounds/red-dead-redemption-2-hover.mp3",
    clickFile: "/sounds/red-dead-redemption-2-click.mp3",
  },
];

export const getProductSoundFile = (
  theme: ProductSoundTheme,
  action: ProductSoundAction,
): string => {
  const option =
    PRODUCT_SOUND_OPTIONS.find((item) => item.value === theme) ??
    PRODUCT_SOUND_OPTIONS[0];
  return action === "hover" ? option.hoverFile : option.clickFile;
};
