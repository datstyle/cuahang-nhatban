import { useEffect } from "react";
import type { RefObject } from "react";

export default function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  onOutside: () => void
) {
  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      const element = ref.current;

      if (element && !element.contains(event.target as Node)) {
        onOutside();
      }
    };

    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [ref, onOutside]);
}