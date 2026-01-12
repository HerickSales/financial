export type CreateCategoryDto = {
    description: string;
    finality: 'income' | 'expense' | 'both';
}
export type UpdateCategoryDto = {
    description: string;
    finality: 'income' | 'expense'| 'both';
}
export type CategoryResponse = {
    id: number;
    description: string;
    finality: 'income' | 'expense'| 'both';
    transactions: transactionResponse[];
}
