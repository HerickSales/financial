# Financial - Sistema de Controle Financeiro

Sistema de controle financeiro pessoal desenvolvido com React + TypeScript no frontend e ASP.NET Core 9.0 no backend.

## Sobre o Sistema

O **Financial** é uma aplicação web para gerenciamento de finanças pessoais que permite:

- Cadastro e autenticação de usuários
- Criação e gerenciamento de categorias personalizadas
- Registro de transações financeiras (receitas e despesas)
- Visualização de relatórios e estatísticas
- Acompanhamento do saldo e histórico financeiro

### Arquitetura

O projeto está dividido em dois módulos principais:

- **financialFront**: Interface web desenvolvida em React + TypeScript com Vite
- **financialBack**: API REST desenvolvida em ASP.NET Core 9.0 com Entity Framework Core

## Tecnologias Utilizadas

### Backend

- .NET 9.0
- Entity Framework Core (SQLite)
- AutoMapper
- FluentValidation
- FluentResults
- xUnit (testes unitários)
- Moq (mocks)
- FluentAssertions (assertions)

### Frontend

- React 19
- TypeScript
- Vite
- TailwindCSS
- React Query (TanStack Query)
- Axios
- React Router DOM
- Recharts (gráficos)
- Lucide React (ícones)

## Estrutura do Projeto

```
Financial/
├── financialBack/          # Backend API
│   ├── Controller/         # Controllers da API
│   ├── Service/           # Camada de serviços
│   ├── Domain/            # Entidades e interfaces
│   ├── Data/              # Contexto e UnitOfWork
│   ├── Handlers/          # Validadores
│   ├── Tests/             # Testes automatizados
│   │   ├── Financial.UnitTests/  # Testes unitários
│   │   └── e2e/                  # Testes end-to-end
│   └── db/                # Banco de dados SQLite
│
└── financialFront/         # Frontend React
    ├── src/
    │   ├── api/           # Configuração Axios
    │   ├── components/    # Componentes React
    │   ├── hooks/         # Custom hooks
    │   ├── pages/         # Páginas da aplicação
    │   ├── services/      # Serviços de API
    │   └── types/         # Tipos TypeScript
    └── public/            # Arquivos estáticos
```

## Como Executar o Projeto

### Pré-requisitos

- .NET SDK 9.0 ou superior
- Node.js 18+ e npm/yarn

### Backend

1. Navegue até a pasta do backend:
```bash
cd financialBack
```

2. Restaure as dependências:
```bash
dotnet restore
```

3. Execute a aplicação:
```bash
dotnet run
```

A API estará disponível em `https://localhost:5122` (ou porta configurada).

### Frontend

1. Navegue até a pasta do frontend:
```bash
cd financialFront
```

2. Instale as dependências:
```bash
npm install
```

3. Configure a URL da API no arquivo `.env`:
```env
VITE_API_URL=https://localhost:5001
```

4. Execute a aplicação:
```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173`.

## Como Rodar os Testes da API

O projeto possui testes unitários configurados com xUnit, Moq e FluentAssertions.

### Executar Todos os Testes

Na pasta raiz do backend:

```bash
cd financialBack
dotnet test
```

### Executar Testes com Cobertura

```bash
dotnet test --collect:"XPlat Code Coverage"
```

### Executar Testes de um Projeto Específico

```bash
dotnet test Tests/Financial.UnitTests/Financial.UnitTests.csproj
```

### Executar Testes com Saída Detalhada

```bash
dotnet test --verbosity detailed
```

### Executar Testes por Filtro

Executar apenas testes de uma classe específica:
```bash
dotnet test --filter "FullyQualifiedName~UserServiceTests"
```

Executar apenas um teste específico:
```bash
dotnet test --filter "Name=DeveRetornarErroQuandoEmailInvalido"
```

### Estrutura de Testes

- **Financial.UnitTests/**: Testes unitários dos serviços e validadores
  - Utiliza Moq para criar mocks de repositórios
  - FluentAssertions para assertions mais legíveis
  - Testa a lógica de negócio isoladamente

- **Tests/e2e/**: Testes end-to-end (se configurados)

## Banco de Dados

O sistema utiliza SQLite como banco de dados, que é criado automaticamente na primeira execução da API no diretório `financialBack/db/`.

Para recriar o banco de dados:

```bash
cd financialBack
rm -rf db/
dotnet run
```

## Endpoints Principais da API

- `POST /api/users` - Cadastro de usuário
- `GET /api/users/{id}` - Buscar usuário
- `POST /api/categories` - Criar categoria
- `GET /api/categories` - Listar categorias
- `POST /api/transactions` - Criar transação
- `GET /api/transactions` - Listar transações

## Scripts Disponíveis

### Backend
- `dotnet run` - Executa a aplicação
- `dotnet test` - Executa os testes
- `dotnet build` - Compila o projeto

### Frontend
- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run lint` - Executa o linter
- `npm run preview` - Visualiza build de produção

## Desenvolvimento

O projeto segue boas práticas de desenvolvimento:

- Arquitetura em camadas no backend
- Injeção de dependências
- Validação de dados com FluentValidation
- Tratamento de erros com FluentResults
- Unit of Work pattern para gerenciamento de transações
- Testes automatizados

