import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';
import Users from './pages/Users';
import TransactionModal from './components/transactions/TransactionModal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AlertProvider } from './contexts/AlertContext';

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
    },
  },
});

function App() {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <AlertProvider>
        <BrowserRouter>
          <Layout onNewTransaction={() => setIsTransactionModalOpen(true)}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/transacoes" element={<Transactions />} />
              <Route path="/categorias" element={<Categories />} />
              <Route path="/usuarios" element={<Users />} />
            </Routes>
          </Layout>

          <TransactionModal
            isOpen={isTransactionModalOpen}
            onClose={() => setIsTransactionModalOpen(false)}
          />
        </BrowserRouter>
      </AlertProvider>
    </QueryClientProvider>
  );
}

export default App;
