import React, { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import type { CategoryResponse } from '../../features/Category/categoryInterfaces';
import { useCreateCategory, useUpdateCategory } from '../../features/Category/useCategory';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: CategoryResponse;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  category
}) => {
  const [description, setDescription] = useState(category?.description || '');
  const [finality, setFinality] = useState<'income' | 'expense' | 'both'>(
    category?.finality || 'expense'
  );

  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();

  const onCloseReset = () => {
    setDescription('');
    setFinality('expense');
    onClose();
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!description.trim()) {
      return;
    }

    if (category) {
      // Editar categoria existente
      updateCategoryMutation.mutate(
        { id: category.id, data: { description, finality } },
        {
          onSuccess: () => {
            setDescription('');
            setFinality('expense');
            onCloseReset();
          },
        }
      );
    } else {
      // Criar nova categoria
      createCategoryMutation.mutate(
        { description, finality },
        {
          onSuccess: () => {
            onCloseReset();
          },
        }
      );
    }
  };

  const isLoading = createCategoryMutation.isPending || updateCategoryMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCloseReset}
      title={category ? 'Editar Categoria' : 'Nova Categoria'}
      size="medium"
      footer={
        <>
          <Button variant="ghost" onClick={onCloseReset} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            type="submit"
            form="category-form"
            disabled={isLoading}
          >
            {isLoading ? 'Salvando...' : category ? 'Salvar' : 'Criar'}
          </Button>
        </>
      }
    >
      <form id="category-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Descrição */}
        <Input
          label="Descrição da Categoria"
          placeholder="Ex: Alimentação, Transporte..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          maxLength={100}
        />

        {/* Finalidade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Finalidade
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="finality"
                value="income"
                checked={finality === 'income'}
                onChange={(e) => setFinality(e.target.value as 'income' | 'expense' | 'both')}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Receita</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="finality"
                value="expense"
                checked={finality === 'expense'}
                onChange={(e) => setFinality(e.target.value as 'income' | 'expense' | 'both')}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Despesa</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="finality"
                value="both"
                checked={finality === 'both'}
                onChange={(e) => setFinality(e.target.value as 'income' | 'expense' | 'both')}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Ambos</span>
            </label>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default CategoryModal;
