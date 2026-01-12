import type { CategoryResponse } from "../Category/categoryInterfaces";
import type { UserResponse } from "../User/userInterfaces";

export type CreateTransactionDto = {
    description: string;
    value: number;
    type: 'income' | 'expense';
    categoryId: number;
    userId: number;
}

export type UpdateTransactionDto = {
    description: string;
    value: number;
    type: 'income' | 'expense';
    categoryId: number;
    userId: number;
}
export type TransactionResponse = {
    id: number;
    description: string;
    value: number;
    type: 'income' | 'expense';
    category: CategoryResponse;
    user: UserResponse;
    date: string;
}