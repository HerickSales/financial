import React, { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import type { UserResponse } from '../../features/User/userInterfaces';
import { useCreateUser, useUpdateUser } from '../../features/User/useUser';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserResponse;
}

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  user
}) => {
  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState<number>(user?.age || 0);

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const onCloseReset = () => {
    setName('');
    setAge(0);
    onClose();
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name.trim()) {
      return;
    }

    if (age < 0 || age > 150) {
      return;
    }

    if (user) {
      // Editar usuário existente
      updateUserMutation.mutate(
        { id: user.id, data: { name, age } },
        {
          onSuccess: () => {
            onCloseReset();
          },
        }
      );
    } else {
      // Criar novo usuário
      createUserMutation.mutate(
        { name, age },
        {
          onSuccess: () => {{
            onCloseReset();
          }

          },
        }
      );
    }
  };

  const isLoading = createUserMutation.isPending || updateUserMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCloseReset}
      title={user ? 'Editar Usuário' : 'Novo Usuário'}
      size="medium"
      footer={
        <>
          <Button variant="ghost" onClick={onCloseReset} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Salvando...' : user ? 'Salvar' : 'Criar'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nome */}
        <Input
          label="Nome Completo"
          placeholder="Digite o nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={100}
        />

        {/* Idade */}
        <Input
          label="Idade"
          type="number"
          placeholder="Digite a idade"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
          required
          min={0}
          max={150}
        />
      </form>
    </Modal>
  );
};

export default UserModal;
