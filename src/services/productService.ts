import api from "./api";
import type {Product, ProductFromData} from "../types";

const product_url = "/products";

export const ProductService = {
    getAll: async(): Promise<Product[]> => {
        const {data} = await api.get<Product[]> (product_url);
        return data;
    },
    getById: async(id: string): Promise<Product> => {
        const {data} = await api.get<Product> (`${product_url} /${id}`);
        return data;
    },
    create: async(product: ProductFromData): Promise<Product> => {
        const {data} = await api.post<Product> (product_url, product);
        return data;
    }
}