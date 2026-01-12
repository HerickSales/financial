import type { TransactionType } from './transaction';

export interface CategoryStats {
  id: number;
  name: string;
  description?: string;
  color: string;
  icon: string;
  type: TransactionType;
  totalSpent: number;
  transactionCount: number;
  percentage: number;
}
