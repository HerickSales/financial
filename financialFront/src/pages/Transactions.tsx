import React, { useState, useMemo } from 'react';
import { Edit, Trash2, Search, Filter } from 'lucide-react';
import Card from '../components/common/Card';
import KpiCard from '../components/common/KpiCard';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import MonthYearPicker from '../components/common/MonthYearPicker';
import TransactionModal from '../components/transactions/TransactionModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Spinner from '../components/common/Spinner';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useTransactions, useDeleteTransaction } from '../features/Transaction/useTransaction';
import type { TransactionResponse } from '../features/Transaction/transactionInterfaces';

const Transactions: React.FC = () => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [activeTab, setActiveTab] = useState<'all' | 'income' | 'expense'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionResponse | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<number | null>(null);

  const { data: transactions, isLoading, isError, error } = useTransactions(selectedYear, selectedMonth + 1);
  const deleteTransactionMutation = useDeleteTransaction();

  // Filtrar transações baseado na tab ativa e termo de busca (memoizado)
  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];

    let filtered = transactions;

    // Filtrar por tipo
    if (activeTab !== 'all') {
      filtered = filtered.filter((transaction) => transaction.type === activeTab);
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter((transaction) =>
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [transactions, activeTab, searchTerm]);

  // Calculate KPIs (memoized)
type Kpis = {
  totalIncome: number;
  totalExpense: number;
  incomeCount: number;
  expenseCount: number;
  averageIncome: number;
  averageExpense: number;
};

const kpis = useMemo<Kpis>(() => {
  if (!transactions?.length) {
    return {
      totalIncome: 0,
      totalExpense: 0,
      incomeCount: 0,
      expenseCount: 0,
      averageIncome: 0,
      averageExpense: 0,
    };
  }

  let totalIncome = 0;
  let totalExpense = 0;
  let incomeCount = 0;
  let expenseCount = 0;

  for (const t of transactions) {
    if (t.type === 'income') {
      totalIncome += t.value;
      incomeCount++;
      continue;
    }

    if (t.type === 'expense') {
      totalExpense += t.value;
      expenseCount++;
    }
  }

  return {
    totalIncome,
    totalExpense,
    incomeCount,
    expenseCount,
    averageIncome: incomeCount ? totalIncome / incomeCount : 0,
    averageExpense: expenseCount ? totalExpense / expenseCount : 0,
  };
}, [transactions]);


  const handleEdit = (transaction: TransactionResponse) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setSelectedTransaction(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(undefined);
  };

  const handleDelete = (transactionId: number) => {
    setTransactionToDelete(transactionId);
    setIsConfirmDialogOpen(true);
  };

  const confirmDelete = () => {
    if (transactionToDelete) {
      deleteTransactionMutation.mutate(transactionToDelete);
      setTransactionToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transações</h1>
          <p className="text-gray-600 mt-1">Gerencie todas as suas transações</p>
        </div>
        <div className="flex items-center gap-3">
          <MonthYearPicker
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
          />
          <Button variant="primary" onClick={handleNew}>
            Nova Transação
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          title="Total Receitas"
          value={formatCurrency(kpis.totalIncome)}
          subtitle={`${kpis.incomeCount} transações`}
          color="success"
        />
        <KpiCard
          title="Total Despesas"
          value={formatCurrency(kpis.totalExpense)}
          subtitle={`${kpis.expenseCount} transações`}
          color="danger"
        />
        <KpiCard
          title="Ticket Médio Receitas"
          value={formatCurrency(kpis.averageIncome)}
          color="info"
        />
        <KpiCard
          title="Ticket Médio Despesas"
          value={formatCurrency(kpis.averageExpense)}
          color="warning"
        />
        <KpiCard
          title="Balanço"
          value={formatCurrency(kpis.totalIncome - kpis.totalExpense)}
          color={kpis.totalIncome - kpis.totalExpense >= 0 ? 'success' : 'danger'}
        />
      </div>

      {/* Filters and Tabs */}
      <Card>
        <div className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por descrição..."
                icon={<Search size={20} className="text-gray-400" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="ghost">
              <Filter size={20} className="mr-2" />
              Filtros
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-gray-200">
            {[
              { key: 'all', label: 'Todas' },
              { key: 'income', label: 'Receitas' },
              { key: 'expense', label: 'Despesas' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'all' | 'income' | 'expense')}
                className={`
                  px-4 py-2 font-medium text-sm transition-base
                  ${activeTab === tab.key
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Transactions Table */}
      <Card>
        {isLoading ? (
          <div className="py-12">
            <Spinner size="lg" />
            <p className="text-center mt-4 text-gray-500">Carregando transações...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-8">
            <p className="text-red-600 font-semibold">Erro ao carregar transações</p>
            <p className="text-gray-500 text-sm mt-2">{error?.message || 'Tente novamente mais tarde'}</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Nenhuma transação encontrada</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Data</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Descrição</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Categoria</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Usuário</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Tipo</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Valor</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-base"
                  >
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-700">{transaction.category.description}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-700">{transaction.user.name}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={transaction.type === 'income' ? 'success' : 'danger'}>
                        {transaction.type === 'income' ? 'RECEITA' : 'DESPESA'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`font-semibold ${
                          transaction.type === 'income' ? 'text-success' : 'text-danger'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.value)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="p-2 text-primary hover:bg-blue-50 rounded-lg transition-base"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          disabled={deleteTransactionMutation.isPending}
                          className="p-2 text-danger hover:bg-red-50 rounded-lg transition-base disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deleteTransactionMutation.isPending ? (
                            <Spinner size="sm" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal */}
      <TransactionModal
        key={selectedTransaction?.id || 'new'}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        transaction={selectedTransaction}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Transação"
        message="Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default Transactions;
