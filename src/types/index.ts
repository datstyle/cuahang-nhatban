export interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    description: string;
    stock: number;
}

export interface Category {
    id: string;
    name: string;
}

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