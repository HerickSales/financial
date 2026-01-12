import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from './userService';
import { type CreateUserDto, type UpdateUserDto} from './userInterfaces';
import { useAlert } from '../../contexts/AlertContext';



export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: userService.getUsers,
    refetchOnWindowFocus: true,
    staleTime: 30000, // 30 segundos
  });
};


export const useUser = (id: number) => {
  return useQuery({
    queryKey: ['users', id], 
    queryFn: () => userService.getUserById(id),
    enabled: !!id, // Só executa se o ID existir
  });
};


export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlert();

  return useMutation({
    mutationFn: (data: CreateUserDto) => userService.createUser(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showSuccess(response?.message || 'Usuário criado com sucesso!');
    },
    onError: () => {
      showError('Erro ao criar usuário.');
    },
  });
};


export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlert();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserDto }) =>
      userService.updateUser(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
      showSuccess(response?.message || 'Usuário atualizado com sucesso!');
    },
    onError: () => {
      showError('Erro ao atualizar usuário.');
    },
  });
};


export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlert();

  return useMutation({
    mutationFn: (id: number) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showSuccess('Usuário deletado com sucesso!');
    },
    onError: () => {
      showError('Erro ao deletar usuário.');
    },
  });
};