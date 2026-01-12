# Instruções de Uso - Sistema de Gestão Financeira

## 🎉 Projeto Concluído!

O sistema de gestão financeira foi implementado com sucesso seguindo todas as especificações fornecidas.

## 🚀 Como Executar

### 1. Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

O aplicativo estará disponível em: `http://localhost:5173`

### 2. Build para Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

### 3. Preview da Build

```bash
npm run preview
```

## 📱 Páginas Implementadas

### 1. Dashboard (/)
- **KPIs Principais**: 4 cards com métricas (Receitas, Despesas, Balanço, Maior Gasto)
- **Gráficos**:
  - Receitas vs Despesas (gráfico de linhas)
  - Gastos por Categoria (gráfico de pizza)
- **Listas**:
  - Últimas 5 transações
  - Top 5 usuários que mais gastam
- Totalmente responsivo e com animações

### 2. Transações (/transacoes)
- **5 KPIs**: Receitas, Despesas, Tickets Médios, Balanço
- **Abas**: Todas / Receitas / Despesas
- **Tabela Completa** com todas as transações
- **Modal** para criar/editar transações
- **Busca visual** (componente pronto, sem lógica)
- **Ações**: Editar e Excluir (visuais)

### 3. Categorias (/categorias)
- **Grid de Cards** com informações de cada categoria
- **Informações**:
  - Nome, Descrição, Ícone, Cor
  - Total gasto, Número de transações
  - Barra de progresso com porcentagem
- **Modal** para criar/editar categorias
- **Resumos** separados por tipo (Receita/Despesa)

### 4. Usuários (/usuarios)
- **3 Cards de Estatísticas**: Total, Ativos, Total Gasto
- **Grid de Cards** com dados de cada usuário
- **Informações**:
  - Nome, Email, Cargo, Avatar
  - Total gasto, Transações, Status
  - Última atividade
- **Modal** para criar/editar usuários
- **Ranking** dos 5 maiores gastadores

## 🎨 Componentes Disponíveis

### Componentes Base (`src/components/common/`)
- **Button**: 4 variantes (primary, secondary, danger, ghost) e 3 tamanhos
- **Card**: Com opções de hover e glass effect
- **Input**: Com label, ícone e mensagem de erro
- **Select**: Dropdown estilizado
- **Textarea**: Área de texto com label
- **Modal**: Modal genérico e reutilizável
- **Badge**: 5 variantes de cores
- **KpiCard**: Card especializado para métricas
- **Toast**: Notificações (componente pronto)

### Componentes de Layout (`src/components/layout/`)
- **Header**: Navegação principal com menu desktop e mobile
- **Layout**: Wrapper principal da aplicação

### Componentes de Gráficos (`src/components/charts/`)
- **MonthlyChart**: Gráfico de linhas com Recharts
- **CategoryChart**: Gráfico de pizza com Recharts

## 📊 Dados Mockados

Todos os dados estão em `src/data/`:
- **mockTransactions.ts**: 20 transações de exemplo
- **mockCategories.ts**: 10 categorias (receitas e despesas)
- **mockUsers.ts**: 8 usuários
- **mockDashboard.ts**: Dados agregados para o dashboard

## 🎯 Funcionalidades

### ✅ Implementado
- ✅ Navegação entre páginas (React Router)
- ✅ Design responsivo (mobile, tablet, desktop)
- ✅ Modais de criação/edição (abrem e fecham)
- ✅ Animações e transições suaves
- ✅ Formatação de valores (moeda) e datas
- ✅ Estados visuais (hover, active, loading)
- ✅ Gráficos interativos
- ✅ Componentes reutilizáveis
- ✅ Tipagem completa com TypeScript

### ⚠️ NÃO Implementado (Conforme Especificação)
- ❌ Validações funcionais de formulários
- ❌ Persistência de dados (criar/editar/deletar funciona apenas visualmente)
- ❌ Integração com API/Backend
- ❌ Lógica de busca e filtros
- ❌ Autenticação
- ❌ Gerenciamento de estado global

## 🎨 Customização

### Alterar Cores
Edite `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#3B82F6',    // Azul
      secondary: '#8B5CF6',  // Roxo
      success: '#10B981',    // Verde
      danger: '#EF4444',     // Vermelho
      warning: '#F59E0B',    // Amarelo
    }
  }
}
```

### Adicionar Novos Dados Mockados
Edite os arquivos em `src/data/` para adicionar mais transações, categorias ou usuários.

## 📦 Dependências Principais

- React 19.2.0
- TypeScript
- Tailwind CSS (v4)
- React Router DOM
- Recharts
- Lucide React

## 🔧 Scripts Disponíveis

```bash
npm run dev      # Iniciar servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview da build
npm run lint     # Lint do código
```

## 📝 Estrutura de Arquivos

```
financialFront/
├── src/
│   ├── components/     # Componentes React
│   ├── pages/          # Páginas da aplicação
│   ├── data/           # Dados mockados
│   ├── types/          # Tipos TypeScript
│   ├── utils/          # Funções utilitárias
│   ├── App.tsx         # Componente principal
│   ├── main.tsx        # Entry point
│   └── index.css       # Estilos globais
├── public/             # Arquivos estáticos
├── dist/               # Build de produção (gerado)
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🎓 Próximos Passos (Para Desenvolvedor Backend)

1. **Criar API Backend**
   - Endpoints CRUD para transações, categorias e usuários
   - Autenticação JWT
   - Validações de dados

2. **Integrar Frontend com Backend**
   - Instalar axios
   - Criar serviços HTTP
   - Implementar gerenciamento de estado (Context API/Zustand)

3. **Adicionar Validações**
   - React Hook Form
   - Zod/Yup para schemas
   - Feedback de erros do servidor

4. **Implementar Autenticação**
   - Login/Logout
   - Rotas protegidas
   - Refresh token

5. **Adicionar Funcionalidades Extras**
   - Filtros e buscas funcionais
   - Paginação
   - Exportação de dados
   - Relatórios em PDF

## 💡 Dicas de Uso

- **Navegação**: Use o menu superior (desktop) ou inferior (mobile)
- **Nova Transação**: Clique no botão verde "Nova Transação" no header
- **Editar**: Clique no ícone de lápis em qualquer card/linha
- **Modais**: Clicam fora ou pressione ESC para fechar
- **Abas**: Na página de Transações, alterne entre Todas/Receitas/Despesas

## 🐛 Solução de Problemas

### Erro ao instalar dependências
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro no build
```bash
npm run build
```

Se houver erros de TypeScript, verifique os tipos nos arquivos.

### Porta 5173 em uso
O Vite tentará usar outra porta automaticamente ou você pode especificar:
```bash
npm run dev -- --port 3000
```

## 📄 Licença

Projeto desenvolvido para fins educacionais e de demonstração.

---

**Desenvolvido com ❤️ usando React + TypeScript + Tailwind CSS**
