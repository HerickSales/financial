import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { transactionService } from "./transactionService";
import { type CreateTransactionDto, type UpdateTransactionDto } from "./transactionInterfaces";
import { useAlert } from "../../contexts/AlertContext";

export const useTransactions = (year: number, month: number) => {
    return  useQuery({
        queryKey: ['transactions', year, month],
        queryFn: () => transactionService.getTransactions(month, year),
        refetchOnWindowFocus: true,
        staleTime: 30000, // 30 segundos
    })
};

export const useTransaction = (id: number) => {
    return useQuery({
        queryKey: ['transactions', id],
        queryFn: () => transactionService.getTransactionById(id),
        enabled: !!id,
    })
}

export const useCreateTransaction = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useAlert();

    return useMutation({
        mutationFn: (data: CreateTransactionDto) => transactionService.createTransaction(data),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            showSuccess(response?.message || 'Transação criada com sucesso!');
        },
        onError: () => {
            showError('Erro ao criar transação.');
        },
    });
}
export const useUpdateTransaction = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useAlert();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateTransactionDto }) =>
            transactionService.updateTransaction(id, data),
        onSuccess: (response, variables) => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['transactions', variables.id] });
            showSuccess(response?.message || 'Transação atualizada com sucesso!');
        },
        onError: () => {
            showError('Erro ao atualizar transação.');
        },
    });
}
export const useDeleteTransaction = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useAlert();

    return useMutation({
        mutationFn: (id: number) => transactionService.deleteTransaction(id),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            showSuccess(response?.message || 'Transação deletada com sucesso!');
        },
        onError: () => {
            showError('Erro ao deletar transação.');
        },
    });
}