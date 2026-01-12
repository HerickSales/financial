import { api } from "../../api/apiFinancial";
import type {  CreateTransactionDto, TransactionResponse, UpdateTransactionDto } from "./transactionInterfaces";

export const transactionService = {
    getTransactions: async (month: number, year: number, ): Promise<TransactionResponse[]> => {
        const response = await api.get(`/transaction?month=${month}&year=${year}`);
        return response.data.data;
    },

    getTransactionById: async (id: number): Promise<TransactionResponse> => {
        const response = await api.get(`/transaction/${id}`);
        return response.data.data;
    },
    createTransaction: async (transactionData: CreateTransactionDto) => {
        const response =  await api.post('/transaction', transactionData);
        return response.data;
    },
    updateTransaction: async (id: number, transactionData: UpdateTransactionDto) => {
        const response = await api.put(`/transaction/${id}`, transactionData);
        return response.data;
    },
    deleteTransaction: async (id: number) => {
        const response = await api.delete(`/transaction/${id}`);
        return response.data;
    }
};