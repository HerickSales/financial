import React, { useState, useMemo } from 'react';
import { Edit, Trash2, Search, TrendingUp, TrendingDown } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';
import MonthYearPicker from '../components/common/MonthYearPicker';
import CategoryModal from '../components/categories/CategoryModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Spinner from '../components/common/Spinner';
import { formatCurrency } from '../utils/formatters';
import { getCategoryColor } from '../utils/colors';
import { useCategories, useDeleteCategory } from '../features/Category/useCategory';
import { useTransactions } from '../features/Transaction/useTransaction';
import type { CategoryResponse } from '../features/Category/categoryInterfaces';

const Categories: React.FC = () => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryResponse | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: transactions } = useTransactions(selectedYear, selectedMonth + 1);
  const deleteCategoryMutation = useDeleteCategory();

  const handleEdit = (category: CategoryResponse) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setSelectedCategory(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(undefined);
  };

  const handleDelete = (categoryId: number) => {
    setCategoryToDelete(categoryId);
    setIsConfirmDialogOpen(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      deleteCategoryMutation.mutate(categoryToDelete);
      setCategoryToDelete(null);
    }
  };

  const categoryStats = useMemo(() => {
    if (!categories || !transactions) {
      return [];
    }

    return categories.map(category => {
     

      const totalSpent = category.transactions.reduce((sum, t) => sum + t.value, 0);

      return {
        ...category,
        totalSpent,
        transactionCount: category.transactions .length,
        color: getCategoryColor(category.id),
      };
    });
  }, [categories, transactions]);

  // Filter categories based on search term (memoized)
  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categoryStats;

    return categoryStats.filter(category =>
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categoryStats, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categorias</h1>
          <p className="text-gray-600 mt-1">Organize suas transações por categorias</p>
        </div>
        <div className="flex items-center gap-3">
          <MonthYearPicker
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
          />
          <Button variant="primary" onClick={handleNew}>
            Nova Categoria
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <Input
          placeholder="Buscar categorias..."
          icon={<Search size={20} className="text-gray-400" />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Card>

      {/* Categories Grid */}
      {categoriesLoading ? (
        <Card>
          <div className="py-12">
            <Spinner size="lg" />
            <p className="text-center mt-4 text-gray-500">Carregando categorias...</p>
          </div>
        </Card>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Nenhuma categoria encontrada</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <Card key={category.id} hover className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <div
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: category.color }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{category.description}</h3>
                    <Badge variant={
                      category.finality === 'income' ? 'success' :
                      category.finality === 'expense' ? 'danger' :
                      'neutral'
                    }>
                      {category.finality === 'income' ? 'RECEITA' :
                       category.finality === 'expense' ? 'DESPESA' :
                       'AMBOS'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total:</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(category.totalSpent)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Transações:</span>
                  <span className="font-semibold text-gray-900">
                    {category.transactionCount}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleEdit(category)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-transparent border border-gray-300 rounded-lg hover:bg-gray-100 transition-base"
                >
                  <Edit size={16} />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  disabled={deleteCategoryMutation.isPending}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white rounded-lg transition-base disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#EF4444' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#DC2626'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#EF4444'}
                >
                  {deleteCategoryMutation.isPending ? (
                    <>
                      <Spinner size="sm" className="text-white" />
                      <span>Excluindo...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      <span>Excluir</span>
                    </>
                  )}
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Categorias de Receitas
            </h3>
            <TrendingUp className="text-success" size={24} />
          </div>
          <div className="space-y-3">
            {categoryStats
              .filter((cat) => cat.finality === 'income' || cat.finality === 'both')
              .length === 0 ? (
                <div className="text-center py-4 text-gray-500">Nenhuma categoria de receita</div>
              ) : (
                categoryStats
                  .filter((cat) => cat.finality === 'income' || cat.finality === 'both')
                  .map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="text-sm text-gray-700">{cat.description}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(cat.totalSpent)}
                      </span>
                    </div>
                  ))
              )}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Categorias de Despesas
            </h3>
            <TrendingDown className="text-danger" size={24} />
          </div>
          <div className="space-y-3">
            {categoryStats
              .filter((cat) => cat.finality === 'expense' || cat.finality === 'both')
              .length === 0 ? (
                <div className="text-center py-4 text-gray-500">Nenhuma categoria de despesa</div>
              ) : (
                categoryStats
                  .filter((cat) => cat.finality === 'expense' || cat.finality === 'both')
                  .map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="text-sm text-gray-700">{cat.description}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(cat.totalSpent)}
                      </span>
                    </div>
                  ))
              )}
          </div>
        </Card>
      </div>

      {/* Modal */}
      <CategoryModal
        key={selectedCategory?.id || 'new'}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        category={selectedCategory}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Categoria"
        message="Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default Categories;
