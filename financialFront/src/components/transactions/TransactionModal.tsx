import React, { useState, useMemo } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { useCategories } from '../../features/Category/useCategory';
import { useUsers } from '../../features/User/useUser';
import { useCreateTransaction, useUpdateTransaction } from '../../features/Transaction/useTransaction';
import type { TransactionResponse } from '../../features/Transaction/transactionInterfaces';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: TransactionResponse;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  transaction
}) => {
  const { data: categories } = useCategories();
  const { data: users } = useUsers();
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();

  // Initialize form values from transaction or defaults
  const [type, setType] = useState<'income' | 'expense'>(transaction?.type || 'expense');
  const [description, setDescription] = useState(transaction?.description || '');
  const [value, setValue] = useState(transaction?.value.toString() || '');
  const [categoryId, setCategoryId] = useState(transaction?.category.id.toString() || '');
  const [userId, setUserId] = useState(transaction?.user.id.toString() || '');

  const onCloseReset = () => {
    setType('expense');
    setDescription('');
    setValue('');
    setCategoryId('');
    setUserId('');
    onClose();
  }

  // Filtrar categorias baseado no tipo (memoizado)
  const filteredCategories = useMemo(() => {
    return categories?.filter(cat => {
      if (cat.finality === 'both') return true;
      return cat.finality === type;
    }) || [];
  }, [categories, type]);

  // Todos os usuários disponíveis
  const availableUsers = users || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!description.trim()) {
      return;
    }

    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue) || parsedValue <= 0) {
      return;
    }

    const parsedCategoryId = parseInt(categoryId);
    if (isNaN(parsedCategoryId) || !categoryId) {
      return;
    }

    const parsedUserId = parseInt(userId);
    if (isNaN(parsedUserId) || !userId) {
      return;
    }

    const data = {
      description,
      value: parsedValue,
      type,
      categoryId: parsedCategoryId,
      userId: parsedUserId
    };

    if (transaction) {
      // Atualizar transação existente
      updateMutation.mutate(
        { id: transaction.id, data },
        {
          onSuccess: () => {
            onCloseReset();
          }
        }
      );
    } else {
      // Criar nova transação
      createMutation.mutate(data, {
        onSuccess: () => {
          onCloseReset();
        }
      });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCloseReset}
      title={transaction ? 'Editar Transação' : 'Nova Transação'}
      size="medium"
      footer={
        <>
          <Button variant="ghost" onClick={onCloseReset} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Salvando...' : transaction ? 'Salvar' : 'Criar'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tipo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="income"
                checked={type === 'income'}
                onChange={(e) => setType(e.target.value as 'income' | 'expense')}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Receita</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="expense"
                checked={type === 'expense'}
                onChange={(e) => setType(e.target.value as 'income' | 'expense')}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Despesa</span>
            </label>
          </div>
        </div>

        {/* Descrição */}
        <Input
          label="Descrição"
          placeholder="Ex: Supermercado, Salário..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        {/* Valor */}
        <Input
          label="Valor"
          type="number"
          step="0.01"
          placeholder="0,00"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
        />

        {/* Categoria */}
        <Select
          label="Categoria"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          options={[
            { value: '', label: 'Selecione uma categoria' },
            ...filteredCategories.map(cat => ({
              value: cat.id.toString(),
              label: cat.description
            }))
          ]}
          required
        />

        {/* Usuário */}
        <Select
          label="Usuário Responsável"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          options={[
            { value: '', label: 'Selecione um usuário' },
            ...availableUsers.map(user => ({
              value: user.id.toString(),
              label: user.name
            }))
          ]}
          required
        />
      </form>
    </Modal>
  );
};

export default TransactionModal;
