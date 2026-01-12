import { api } from "../../api/apiFinancial";
import type { CategoryResponse, CreateCategoryDto, UpdateCategoryDto } from "./categoryInterfaces";

export const categoryService = {
    getCategories: async (): Promise<CategoryResponse[]> => {
        const response = await api.get("/category");
        return response.data.data;
    },
    getCategoryById: async (id: number): Promise<CategoryResponse> => {
        const response = await api.get(`/category/${id}`);
        return response.data.data;
    },
    createCategory: async (categoryData: CreateCategoryDto) => {
        const response = await api.post("/category", categoryData);
        return response.data;
    },
    updateCategory:async (id: number, categoryData: UpdateCategoryDto) => {
        const response = await api.put(`/category/${id}`, categoryData);
        return response.data;
    },
    deleteCategory: async (id: number) => {
        const response = await api.delete(`/category/${id}`);
        return response.data;
    }
};