import React, { useState, useMemo } from 'react';
import { Edit, Trash2, Search, Eye, XCircle } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import MonthYearPicker from '../components/common/MonthYearPicker';
import UserModal from '../components/users/UserModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Spinner from '../components/common/Spinner';
import { formatCurrency } from '../utils/formatters';
import { useUsers, useDeleteUser } from '../features/User/useUser';
import type { UserResponse } from '../features/User/userInterfaces';

const Users: React.FC = () => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const { data: users, isLoading: usersLoading } = useUsers();
  const deleteUserMutation = useDeleteUser();

  const handleEdit = (user: UserResponse) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setSelectedUser(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(undefined);
  };

  const handleDelete = (userId: number) => {
    setUserToDelete(userId);
    setIsConfirmDialogOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteUserMutation.mutate(userToDelete);
      setUserToDelete(null);
    }
  };

  // Calcula estatísticas dos usuários com base nas transações do mês selecionado
  const userStats = useMemo(() => {
    if (!users) {
      return [];
    }

    return users.map(user => {
      const userTransactions = user.transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return (
          transactionDate.getMonth() === selectedMonth &&
          transactionDate.getFullYear() === selectedYear
        );
      });
      let accumulatedGain = 0;
      let accumulatedSpent = 0;

      userTransactions.forEach(t => {
        if (t.type === 'expense') {
          accumulatedSpent += t.value;
        } else if (t.type === 'income') {
          accumulatedGain += t.value;
        }
      })
      return {
        ...user,
        totalSpent: accumulatedSpent,
        totalGain: accumulatedGain,
        transactionCount: userTransactions.length,
      };
    });
  }, [users, selectedMonth, selectedYear]);

  // Filtra usuários baseado no termo de busca
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return userStats;

    return userStats.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [userStats, searchTerm]);

  // Calcula totais
  const totalUsers = users?.length || 0;
  const { totalSpent, totalGain } = userStats.reduce(
    (acc, u) => ({
      totalSpent: acc.totalSpent + u.totalSpent,
      totalGain: acc.totalGain + u.totalGain
    }),
    { totalSpent: 0, totalGain: 0 }
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
          <p className="text-gray-600 mt-1">Gerencie os usuários do sistema</p>
        </div>
        <div className="flex items-center gap-3">
          <MonthYearPicker
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
          />
          <Button variant="primary" onClick={handleNew}>
            Novo Usuário
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Usuários</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{totalUsers}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Eye className="text-primary" size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Gastos (mês selecionado)</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(totalSpent)}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <XCircle className="text-warning" size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <Input
          placeholder="Buscar usuários..."
          icon={<Search size={20} className="text-gray-400" />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Card>

      {/* Users Grid */}
      {usersLoading ? (
        <Card>
          <div className="py-12">
            <Spinner size="lg" />
            <p className="text-center mt-4 text-gray-500">Carregando usuários...</p>
          </div>
        </Card>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Nenhum usuário encontrado</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <Card key={user.id} hover>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-500">Idade: {user.age}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total gasto (mês):</span>
                  <span className="text-gray-900 font-semibold">
                    {formatCurrency(user.totalSpent)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total ganho (mês):</span>
                  <span className="text-gray-900 font-semibold">
                    {formatCurrency(user.totalGain)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Balanço mensal (mês):</span>
                  <span className={`font-semibold ${user.totalGain > user.totalSpent ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(user.totalGain - user.totalSpent)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Transações:</span>
                  <span className="text-gray-900 font-semibold">
                    {user.transactionCount}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleEdit(user)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-transparent border border-gray-300 rounded-lg hover:bg-gray-100 transition-base"
                >
                  <Edit size={16} />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  disabled={deleteUserMutation.isPending}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white rounded-lg transition-base disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#EF4444' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#DC2626'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#EF4444'}
                >
                  {deleteUserMutation.isPending ? (
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

      {/* Top Spenders */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Maiores Gastadores (mês selecionado)
        </h2>
        <div className="space-y-3">
          {userStats.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Nenhum dado disponível</div>
          ) : (
            userStats
              .sort((a, b) => b.totalSpent - a.totalSpent)
              .slice(0, 5)
              .map((user, index) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-base"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-300">
                      #{index + 1}
                    </span>
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.transactionCount} transações</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(user.totalSpent)}
                  </span>
                </div>
              ))
          )}
        </div>
      </Card>

      {/* Modal */}
      <UserModal
        key={selectedUser?.id || 'new'}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        user={selectedUser}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Usuário"
        message="Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default Users;
