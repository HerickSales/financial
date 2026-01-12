export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

export const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return `Há ${diffDays} dias`;
  if (diffDays < 30) return `Há ${Math.floor(diffDays / 7)} semanas`;
  if (diffDays < 365) return `Há ${Math.floor(diffDays / 30)} meses`;
  return `Há ${Math.floor(diffDays / 365)} anos`;
};

export const formatPercent = (value: number): string => {
  return `${value.toFixed(1)}%`;
};
