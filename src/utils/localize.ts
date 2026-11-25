import type { Category, Lang } from "../types";

export function getCategoryName(category: Category, lang: Lang): string {
  switch (lang) {
    case "en":
      return category.nameEn || category.name;
    case "ja":
      return category.nameJa || category.name;
    default:
      return category.name;
  }
}

export function getCategoryLabel(
  name: string,
  categories: readonly Category[],
  lang: Lang,
): string {
  const category = categories.find((category) => category.name === name);

  return category ? getCategoryName(category, lang) : name;
}
