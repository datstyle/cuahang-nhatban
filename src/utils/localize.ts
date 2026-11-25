import type { Category, Lang, Product } from "../types";

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
  const category = categories.find(
    (category) => category.name === name || category.id === name,
  );

  return category ? getCategoryName(category, lang) : name;
}

const priceFormatters = {
  vi: new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }),
  en: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
  ja: new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" }),
};

export function getProductDisplay(product: Product, lang: Lang) {
  const translations = {
    vi: { name: product.name, description: product.description, price: product.price },
    en: { name: product.nameEn, description: product.descriptionEn, price: product.priceUsd },
    ja: { name: product.nameJa, description: product.descriptionJa, price: product.priceJpy },
  };
  const { name, description, price } = translations[lang];
  const formattedPrice = price == null
    ? priceFormatters.vi.format(product.price)
    : priceFormatters[lang].format(price);

  return {
    name: name || product.name,
    description: description || product.description,
    price: formattedPrice,
  };
}
