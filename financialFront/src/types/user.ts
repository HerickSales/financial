export interface UserStats {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: string;
  totalSpent: number;
  transactionCount: number;
  status: 'ATIVO' | 'INATIVO';
  lastActivity: string;
}
