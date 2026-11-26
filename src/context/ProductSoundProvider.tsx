import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { ProductSoundSettings } from "../types";
import useAuth from "../types/useAuth";
import { settingsService } from "../services/settingsService";
import { getProductSoundFile, type ProductSoundAction } from "../utils/productSounds";

interface ProductSoundContextValue {
  updateSettings: (settings: ProductSoundSettings) => void;
}

const ProductSoundContext = createContext<ProductSoundContextValue | null>(null);

export function ProductSoundProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const email = user?.email ?? "";
  const hoverAudioRef = useRef<HTMLAudioElement>(null);
  const clickAudioRef = useRef<HTMLAudioElement>(null);
  const [settings, setSettings] = useState<ProductSoundSettings>(
    () => settingsService.load(email).productSounds,
  );

  useEffect(() => {
    setSettings(settingsService.load(email).productSounds);
  }, [email]);

  const playSound = useCallback((action: ProductSoundAction) => {
    if (!settings.enabled) return;

    const audio = action === "hover" ? hoverAudioRef.current : clickAudioRef.current;
    if (!audio) return;

    const source = getProductSoundFile(settings.theme, action);
    if (audio.getAttribute("src") !== source) {
      audio.src = source;
      audio.load();
    }

    audio.volume = Math.min(100, Math.max(0, settings.volume)) / 100;
    audio.currentTime = 0;
    void audio.play().catch(() => undefined);
  }, [settings]);

  useEffect(() => {
    const handlePointerOver = (event: PointerEvent) => {
      if (event.pointerType === "touch" || !(event.target instanceof Element)) return;

      const card = event.target.closest("[data-sound-hover]");
      if (!card) return;

      if (event.relatedTarget instanceof Node && card.contains(event.relatedTarget)) return;
      playSound("hover");
    };

    const handleClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      if (event.target.closest("[data-sound-click]")) playSound("click");
    };

    document.addEventListener("pointerover", handlePointerOver);
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("click", handleClick);
    };
  }, [playSound]);

  return (
    <ProductSoundContext.Provider value={{ updateSettings: setSettings }}>
      <audio ref={hoverAudioRef} preload="none" aria-hidden="true" />
      <audio ref={clickAudioRef} preload="none" aria-hidden="true" />
      {children}
    </ProductSoundContext.Provider>
  );
}

export function useProductSound() {
  const context = useContext(ProductSoundContext);
  if (!context) {
    throw new Error("useProductSound phải được dùng bên trong ProductSoundProvider");
  }

  return context;
}
