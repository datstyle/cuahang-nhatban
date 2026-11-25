export interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    description: string;
    stock: number;
    status?: "pending" | "visible" | "hidden";
    discountedPrice?: number;
    nameEn?: string;
    nameJa?: string;
}

export interface Category {
    id: string;
    name: string;
    nameEn?: string;
    nameJa?: string;
}

export type Lang = "vi" | "en" | "ja";

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface ProductFromData {
    name: string;
    price: number;
    image: string;
    category: string;
    description: string;
    stock: string;
}
