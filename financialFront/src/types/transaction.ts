export type TransactionType = 'RECEITA' | 'DESPESA';

export interface Category {
  id: number;
  name: string;
  color: string;
  icon: string;
  description?: string;
  type?: TransactionType;
}

export interface User {
  id: number;
  name: string;
  email?: string;
  avatar: string;
  role?: string;
}

export interface Transaction {
  id: number;
  description: string;
  value: number;
  type: TransactionType;
  category: Category;
  date: string;
  user: User;
  observations?: string;
  status?: 'PAGO' | 'PENDENTE';
}
