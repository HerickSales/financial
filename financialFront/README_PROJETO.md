# Sistema de Gestão Financeira - Frontend

## 📋 Visão Geral

Este é um sistema de gestão financeira desenvolvido com **React + TypeScript + Vite** e **Tailwind CSS**. O projeto está configurado como **MOCKUP** com foco em design e estilização, utilizando dados mockados para demonstração.

## 🚀 Tecnologias Utilizadas

- **React 19.2.0** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Vite** - Build tool e dev server ultrarrápido
- **Tailwind CSS** - Framework CSS utility-first
- **React Router DOM** - Roteamento para aplicações React
- **Recharts** - Biblioteca de gráficos para React
- **Lucide React** - Biblioteca de ícones moderna

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── common/              # Componentes reutilizáveis
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── KpiCard.tsx
│   │   ├── Modal.tsx
│   │   ├── Select.tsx
│   │   ├── Textarea.tsx
│   │   └── Toast.tsx
│   ├── layout/              # Componentes de layout
│   │   ├── Header.tsx
│   │   └── Layout.tsx
│   ├── transactions/        # Componentes de transações
│   │   └── TransactionModal.tsx
│   ├── categories/          # Componentes de categorias
│   │   └── CategoryModal.tsx
│   ├── users/               # Componentes de usuários
│   │   └── UserModal.tsx
│   └── charts/              # Componentes de gráficos
│       ├── MonthlyChart.tsx
│       └── CategoryChart.tsx
├── pages/                   # Páginas da aplicação
│   ├── Home.tsx             # Dashboard principal
│   ├── Transactions.tsx     # Página de transações
│   ├── Categories.tsx       # Página de categorias
│   └── Users.tsx            # Página de usuários
├── data/                    # Dados mockados
│   ├── mockTransactions.ts
│   ├── mockCategories.ts
│   ├── mockUsers.ts
│   └── mockDashboard.ts
├── types/                   # Definições TypeScript
│   ├── transaction.ts
│   ├── category.ts
│   └── user.ts
├── utils/                   # Funções utilitárias
│   └── formatters.ts
├── App.tsx                  # Componente principal
├── main.tsx                 # Entry point
└── index.css                # Estilos globais
```

## 🎨 Funcionalidades Implementadas

### ✅ Dashboard (Home)
- 4 KPI Cards (Receitas, Despesas, Balanço, Maior Gasto)
- Gráfico de linha: Receitas vs Despesas mensal
- Gráfico de pizza: Gastos por categoria
- Lista das últimas 5 transações
- Top 5 usuários que mais gastam
- Totalmente responsivo

### ✅ Página de Transações
- 5 KPI Cards com métricas detalhadas
- Sistema de abas (Todas/Receitas/Despesas)
- Tabela completa de transações
- Modal de criação/edição com todos os campos
- Busca visual (sem lógica)
- Botões de editar e excluir
- Formatação de valores e datas

### ✅ Página de Categorias
- Grid de cards de categorias
- Informações detalhadas por categoria
- Barras de progresso visual
- Modal de criação/edição
- Seletor de cores
- Ícones customizáveis
- Resumos separados por tipo (Receita/Despesa)

### ✅ Página de Usuários
- Grid de cards de usuários
- Estatísticas de cada usuário
- Modal de criação/edição
- Status Ativo/Inativo
- Ranking dos maiores gastadores
- Informações de última atividade

### ✅ Componentes Reutilizáveis
- Button (4 variantes: primary, secondary, danger, ghost)
- Card (com suporte a hover e glass effect)
- Input, Select, Textarea (com labels e validação visual)
- Modal (totalmente customizável)
- Badge (5 variantes de cores)
- KpiCard (para métricas)
- Toast (notificações - componente pronto)

## 🎯 Design System

### Paleta de Cores
```css
Primary: #3B82F6 (Azul)
Secondary: #8B5CF6 (Roxo)
Success: #10B981 (Verde)
Danger: #EF4444 (Vermelho)
Warning: #F59E0B (Amarelo)
Receita: #10B981
Despesa: #EF4444
```

### Tipografia
- Font Family: Inter (Google Fonts)
- Pesos: 300, 400, 500, 600, 700, 800

### Responsividade
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🚦 Como Executar

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Instalação

1. As dependências já foram instaladas, mas caso necessário:
```bash
npm install
```

2. Iniciar o servidor de desenvolvimento:
```bash
npm run dev
```

3. Abrir no navegador:
```
http://localhost:5173
```

### Build para Produção

```bash
npm run build
```

### Preview da Build

```bash
npm run preview
```

## 📝 Observações Importantes

### ⚠️ Este é um MOCKUP
- **Todos os dados são mockados** (não há backend)
- **Nenhuma alteração é persistida** (criar/editar/deletar apenas fecha modais)
- **Validações são apenas visuais** (sem lógica funcional)
- **Filtros e buscas são componentes visuais** (sem funcionalidade)

### O que NÃO está implementado
❌ Integração com API/Backend
❌ Persistência de dados
❌ Validações funcionais de formulários
❌ Lógica de autenticação
❌ Gerenciamento de estado global
❌ Testes unitários
❌ Lógica de negócio real

### O que ESTÁ implementado
✅ Design completo e responsivo
✅ Navegação entre páginas
✅ Todos os componentes visuais
✅ Modais funcionando (abrir/fechar)
✅ Animações e transições
✅ Formatação de dados (moeda, datas)
✅ Estados visuais (hover, loading, etc)
✅ Gráficos com dados mockados

## 🔄 Próximos Passos (Para Desenvolvedor Backend)

1. **Integração com API**
   - Criar serviços para chamadas HTTP
   - Implementar axios ou fetch
   - Gerenciar estados de loading/error

2. **Gerenciamento de Estado**
   - Implementar Context API ou Zustand
   - Gerenciar estado global da aplicação

3. **Validações**
   - Implementar validações com Zod ou Yup
   - Adicionar React Hook Form

4. **Autenticação**
   - Implementar login/logout
   - Gerenciar tokens JWT
   - Proteger rotas

5. **Testes**
   - Adicionar testes com Vitest
   - Testes de componentes com Testing Library

## 🎨 Customização

### Alterar Cores
Edite o arquivo `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#SEU_COR',
      // ...
    }
  }
}
```

### Adicionar Novos Ícones
Importe do Lucide React:
```typescript
import { IconName } from 'lucide-react';
```

## 📞 Suporte

Este é um projeto mockado para demonstração de design. Para implementação completa, entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido com ❤️ usando React + TypeScript + Tailwind CSS**
