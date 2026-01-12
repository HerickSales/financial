import React, { useMemo, useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Scale, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import KpiCard from '../components/common/KpiCard';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import CategoryChart from '../components/charts/CategoryChart';
import MonthYearPicker from '../components/common/MonthYearPicker';
import Spinner from '../components/common/Spinner';
import { formatCurrency, formatDate } from '../utils/formatters';
import { CATEGORY_COLORS } from '../utils/colors';
import { useTransactions } from '../features/Transaction/useTransaction';

const Home: React.FC = () => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const { data: transactions, isLoading } = useTransactions(selectedYear, selectedMonth + 1);
  const latestTransactions = transactions?.slice(0, 5) || [];

  // useMemo calcula os KPIs apenas quando 'transactions' muda
  const kpis = useMemo(() => {
    const safeTransactions = transactions || [];
    const { totalIncome, totalExpense, biggestTransaction } = safeTransactions.reduce((acc, t) => {
      if (t.type === 'income') {
        acc.totalIncome += t.value;
      }
      if (t.type === 'expense') {
        acc.totalExpense += t.value;
      }
      if (t.value > acc.biggestTransaction.value) {
        acc.biggestTransaction = t;
      }
      return acc;
    },{totalIncome: 0, totalExpense: 0, biggestTransaction: { value: 0, description: '' }  });
    return { totalIncome, totalExpense, biggestTransaction };
  }, [transactions]);

  // useMemo calcula os usuários que mais gastam apenas quando 'transactions' muda

const usersMoreSpent = useMemo(() => {
  if (!transactions?.length) return [];

  const map = new Map<string, number>();

  for (const t of transactions) {
    if (t.type !== 'expense') continue;

    map.set(
      t.user.name,
      (map.get(t.user.name) ?? 0) + t.value
    );
  }

  const users = Array.from(map.entries()).map(([name, totalSpent]) => ({
    name,
    totalSpent,
  }));

  users.sort((a, b) => b.totalSpent - a.totalSpent);

  const topUsers = users.slice(0, 5);

  const totalSpentAllUsers = users.reduce(
    (sum, u) => sum + u.totalSpent,
    0
  );

  return topUsers.map(u => ({
    ...u,
    percentage: +((u.totalSpent / totalSpentAllUsers) * 100).toFixed(2),
  }));
}, [transactions]);

  // Dados para o gráfico de categorias (agrupa por categoria)
type CategoryTotal = Map<string, number>;

const categoryChart = useMemo(() => {
  if (!transactions?.length) {
    return { categories: [], values: [], colors: [] };
  }

  const totals: CategoryTotal = new Map();

  for (const t of transactions) {
    if (t.type !== 'expense') continue;

    const name = t.category.description;
    totals.set(name, (totals.get(name) ?? 0) + t.value);
  }

  const sorted = Array.from(totals.entries())
    .sort((a, b) => b[1] - a[1]);

  return {
    categories: sorted.map(([name]) => name),
    values: sorted.map(([, value]) => value),
    colors: sorted.map(
      (_, i) => CATEGORY_COLORS[i % CATEGORY_COLORS.length]
    ),
  };
}, [transactions]);



  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Visão geral das suas finanças</p>
        </div>
        <MonthYearPicker
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
        />
      </div>

      {/* KPI Cards */}
      {isLoading ? (
        <Card>
          <div className="py-12">
            <Spinner size="lg" />
            <p className="text-center mt-4 text-gray-500">Carregando dados...</p>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KpiCard
              title="Total de Receitas"
              value={formatCurrency(kpis.totalIncome)}
              icon={<TrendingUp size={24} />}
              color="success"
              trend="up"
            />
            <KpiCard
              title="Total de Despesas"
              value={formatCurrency(kpis.totalExpense)}
              icon={<TrendingDown size={24} />}
              color="danger"
              trend="down"
            />
            <KpiCard
              title="Balanço"
              value={formatCurrency(kpis.totalIncome - kpis.totalExpense)}
              icon={<Scale size={24} />}
              color={kpis.totalIncome - kpis.totalExpense >= 0 ? 'success' : 'danger'}
            />
            <KpiCard
              title="Maior Gasto"
              value={formatCurrency(kpis.biggestTransaction.value)}
              subtitle={kpis.biggestTransaction.description}
              icon={<DollarSign size={24} />}
              color="warning"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Gastos por Categoria
              </h2>
              {categoryChart.categories.length === 0 ? (
                <div className="flex items-center justify-center h-80 text-gray-500">
                  Nenhum gasto por categoria neste mês
                </div>
              ) : (
                <CategoryChart data={categoryChart} />
              )}
            </Card>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Latest Transactions */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Últimas Transações
                </h2>
                <Link
                  to="/transacoes"
                  className="text-primary hover:text-blue-600 text-sm font-medium flex items-center transition-base"
                >
                  Ver todas
                  <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
              <div className="space-y-3">
                {latestTransactions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">Nenhuma transação encontrada</div>
                ) : (
                  latestTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-base"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded ${
                              transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                            }`}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {transaction.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-gray-500">
                              {transaction.category.description}
                            </p>
                            <span className="text-gray-300">•</span>
                            <p className="text-sm text-gray-500">
                              {formatDate(transaction.date)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-semibold ${
                            transaction.type === 'income'
                              ? 'text-success'
                              : 'text-danger'
                          }`}
                        >
                          {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.value)}
                        </p>
                        <Badge
                          variant={transaction.type === 'income' ? 'success' : 'danger'}
                          className="mt-1"
                        >
                          {transaction.type === 'income' ? 'RECEITA' : 'DESPESA'}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Top Users */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Usuários que Mais Gastam
              </h2>
              <div className="space-y-4">
                {usersMoreSpent.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">Nenhum gasto encontrado</div>
                ) : (
                  usersMoreSpent.map((user, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">
                              {formatCurrency(user.totalSpent)}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-600">
                          {user.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all"
                          style={{ width: `${user.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
