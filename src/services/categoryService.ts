import api from "./api";
import type { Category } from "../types";

export const categoryService = {
    getAll: async(): Promise<Category[]> => {
        const {data} = await api.get<Category[]> ("/categories");
        return data;
    },
};