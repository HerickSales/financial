import { useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import { categoryService } from "./categoryService";
import { type CreateCategoryDto, type UpdateCategoryDto } from "./categoryInterfaces";
import { useAlert } from '../../contexts/AlertContext';


export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: categoryService.getCategories,
        refetchOnWindowFocus: true,
        staleTime: 30000, // 30 segundos
    })
}
export  const useCategory = (id: number) => {
    return useQuery({
        queryKey: ['categories', id],
        queryFn: () => categoryService.getCategoryById(id),
        enabled: !!id,
    })
}

export const useCreateCategory = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useAlert();

    return useMutation({
        mutationFn: (data: CreateCategoryDto) => categoryService.createCategory(data),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            showSuccess(response?.message || 'Categoria criada com sucesso!');
        },
        onError: () => {

            showError('Erro ao criar categoria.');
        },
    });
}
export const useUpdateCategory = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useAlert();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateCategoryDto }) =>
            categoryService.updateCategory(id, data),
        onSuccess: (response, variables) => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            queryClient.invalidateQueries({ queryKey: ['categories', variables.id] });
            showSuccess(response?.message || 'Categoria atualizada com sucesso!');
        },
        onError: () => {
            showError('Erro ao atualizar categoria.');
        },
    });
}
export const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useAlert();

    return useMutation({
        mutationFn: (id: number) => categoryService.deleteCategory(id),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            showSuccess(response?.message || 'Categoria deletada com sucesso!');
        },
        onError: () => {
            showError('Erro ao deletar categoria.');
        },
    });
}

