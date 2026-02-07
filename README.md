# Admin Hub Lite - Backoffice Administrativo

Um sistema administrativo completo construído com React, TypeScript e shadcn/ui, consumindo dados de arquivos JSON locais que simulam uma API backend.

## 📋 Índice

- [Tecnologias](#-tecnologias)
- [Como Rodar](#-como-rodar)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Funcionalidades](#-funcionalidades)
- [Arquitetura de Dados](#-arquitetura-de-dados)
- [Decisões Técnicas](#-decisões-técnicas)
- [Limitações e Melhorias](#-limitações-e-melhorias)

## 🧰 Tecnologias

Este projeto utiliza a seguinte stack:

- **React 18.3** - Biblioteca para construção da interface
- **TypeScript 5.8** - Tipagem estática
- **Vite 5.4** - Build tool e dev server
- **shadcn/ui** - Componentes UI baseados em Radix UI
- **Tailwind CSS 3.4** - Framework de estilização
- **React Router DOM 6.30** - Roteamento
- **React Hook Form 7.61** - Gerenciamento de formulários
- **Zod 3.25** - Validação de schemas
- **TanStack Query 5.83** - Gerenciamento de estado servidor (preparado para uso futuro)
- **date-fns 3.6** - Manipulação de datas
- **lucide-react** - Ícones

## 🚀 Como Rodar

### Pré-requisitos

- Node.js 18+ ou Bun
- npm, yarn, pnpm ou bun

### Instalação

```bash
# Clone o repositório
git clone <YOUR_GIT_URL>
cd admin-hub-lite

# Instale as dependências
npm install
# ou
bun install
```

### Executar em Desenvolvimento

```bash
npm run dev
# ou
bun dev
```

O servidor estará disponível em `http://localhost:8080`

### Build para Produção

```bash
npm run build
# ou
bun build
```

### Preview da Build

```bash
npm run preview
# ou
bun preview
```

## 📁 Estrutura do Projeto

```
admin-hub-lite/
├── public/
│   └── data/              # Arquivos JSON simulando API
│       ├── users.json
│       ├── orders.json
│       └── commissions.json
├── src/
│   ├── components/
│   │   ├── common/        # Componentes reutilizáveis
│   │   │   ├── StatCard.tsx
│   │   │   ├── StateComponents.tsx (Loading, Error, Empty)
│   │   │   └── StatusBadge.tsx
│   │   ├── layout/
│   │   │   └── AdminLayout.tsx  # Layout principal com sidebar
│   │   └── ui/            # Componentes shadcn/ui
│   ├── data/              # (Legado - será movido para public/)
│   ├── hooks/
│   │   └── useData.ts     # Hooks para consumo de dados
│   ├── lib/
│   │   ├── formatters.ts  # Funções de formatação
│   │   └── utils.ts       # Utilitários gerais
│   ├── pages/             # Páginas/rotas da aplicação
│   │   ├── Dashboard.tsx
│   │   ├── UsersList.tsx
│   │   ├── UserDetail.tsx
│   │   ├── OrdersList.tsx
│   │   ├── OrderDetail.tsx
│   │   ├── CommissionsList.tsx
│   │   └── NotFound.tsx
│   ├── types/
│   │   └── index.ts       # Definições TypeScript
│   ├── App.tsx            # Componente raiz e rotas
│   ├── main.tsx           # Entry point
│   └── index.css          # Estilos globais
├── components.json        # Configuração shadcn/ui
├── tailwind.config.ts     # Configuração Tailwind
├── tsconfig.json          # Configuração TypeScript
├── vite.config.ts         # Configuração Vite
└── package.json
```

## ✨ Funcionalidades

### 1. Dashboard

Visão geral do sistema com métricas principais:
- Total de usuários cadastrados
- Usuários ativos (com percentual)
- Total de pedidos
- Valor total dos pedidos
- Valor total de comissões

**Componentes utilizados:** `StatCard`, `LoadingState`, `ErrorState`

### 2. Usuários - Listagem

Tabela completa com:
- **Colunas:** Nome, Email, Tipo (role), País, Status
- **Filtros:**
  - Busca por nome ou email
  - Filtro por status (ativo/inativo)
  - Filtro por tipo (admin/manager/seller/customer)
- **Ações:**
  - Ativar/Desativar usuário (toggle)
  - Visualizar detalhes

**Componentes utilizados:** `Table`, `Input`, `Select`, `StatusBadge`, `Button`

### 3. Usuários - Detalhe

Página de detalhes com:
- **Informações:** ID, Tipo, País, Data de criação
- **Edição:**
  - Nome (input)
  - Email (input)
  - Status (select)
- **Persistência:** Alterações salvas no localStorage
- **Feedback:** Toast de sucesso/erro

**Componentes utilizados:** `Card`, `Form`, `Input`, `Select`, `Button`, `Toast`

### 4. Pedidos - Listagem

Tabela com:
- **Colunas:** ID, Usuário, Status, Valor, Data
- **Filtros:**
  - Por status (pending/processing/completed/cancelled)
- **Ordenação:**
  - Por data (asc/desc)
  - Por valor (asc/desc)
- **Ações:**
  - Visualizar detalhes

**Componentes utilizados:** `Table`, `Select`, `Button`

### 5. Pedidos - Detalhe

Página completa com:
- **Informações do pedido:** ID, Cliente (link), Data, Status
- **Itens do pedido:** Tabela com produtos, quantidades e valores
- **Resumo financeiro:**
  - Subtotal
  - Impostos (10%)
  - Total
- **Operações:**
  - Alterar status do pedido
  - Recalcular valores automaticamente

**Componentes utilizados:** `Card`, `Table`, `Select`, `Button`

### 6. Comissões

Listagem com:
- **Cards de resumo:**
  - Total em comissões
  - Comissões pendentes
  - Comissões pagas
- **Tabela:** Usuário, Pedido, Taxa, Valor, Status, Data
- **Filtros:** Por status (pending/paid)
- **Navegação:** Links para usuário e pedido relacionados

**Componentes utilizados:** `StatCard`, `Table`, `Select`, `StatusBadge`

## 🗄️ Arquitetura de Dados

### Estrutura dos JSONs

Os dados são armazenados em arquivos JSON na pasta `public/data/`:

#### `users.json`
```json
[
  {
    "id": "usr_001",
    "name": "Carlos Silva",
    "email": "carlos.silva@email.com",
    "role": "admin" | "manager" | "seller" | "customer",
    "country": "Brasil",
    "status": "active" | "inactive",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

#### `orders.json`
```json
[
  {
    "id": "ord_001",
    "userId": "usr_005",
    "status": "pending" | "processing" | "completed" | "cancelled",
    "items": [
      {
        "id": "item_001",
        "productName": "Notebook Dell Inspiron",
        "quantity": 1,
        "unitPrice": 4500.00,
        "total": 4500.00
      }
    ],
    "subtotal": 5200.00,
    "tax": 520.00,
    "total": 5720.00,
    "createdAt": "2024-06-15T10:30:00Z"
  }
]
```

#### `commissions.json`
```json
[
  {
    "id": "com_001",
    "userId": "usr_003",
    "orderId": "ord_001",
    "amount": 286.00,
    "rate": 0.05,
    "status": "pending" | "paid",
    "createdAt": "2024-06-16T10:00:00Z"
  }
]
```

### Relacionamentos

- **Pedido → Usuário:** `order.userId` referencia `user.id`
- **Comissão → Usuário:** `commission.userId` referencia `user.id`
- **Comissão → Pedido:** `commission.orderId` referencia `order.id`

### Consumo de Dados

O sistema utiliza `fetch()` para carregar os JSONs, simulando chamadas de API:

1. **Simulação de delay:** 500-800ms para simular latência de rede
2. **Simulação de erros:** 10% de chance de erro aleatório
3. **Persistência local:** Alterações são salvas no `localStorage`
4. **Cache:** Dados carregados são mantidos em memória

**Fluxo:**
```
Componente → Hook (useData.ts) → fetch('/data/users.json') → JSON → Estado React
```

### Hooks Disponíveis

- `useUsers()` - Lista de usuários
- `useUser(id)` - Usuário específico
- `useOrders()` - Lista de pedidos
- `useOrder(id)` - Pedido específico
- `useCommissions()` - Lista de comissões
- `useDashboardStats()` - Estatísticas do dashboard

### Helpers Síncronos

Para uso em componentes que precisam de acesso síncrono aos dados (ex: renderização de tabelas):

- `getUserById(userId)` - Retorna usuário do cache
- `getOrderById(orderId)` - Retorna pedido do cache

**Nota:** Esses helpers usam cache em memória. Se os dados ainda não foram carregados, podem retornar `undefined`. Use os hooks assíncronos para garantir que os dados estejam disponíveis.

## 🎯 Decisões Técnicas

### 1. Uso de `fetch()` ao invés de Axios

**Decisão:** Utilizar `fetch()` nativo do navegador.

**Motivo:**
- Sem dependências extras
- Suporte nativo em navegadores modernos
- Adequado para simulação de API simples

### 2. Persistência em localStorage

**Decisão:** Alterações são persistidas localmente.

**Motivo:**
- Simula persistência de backend
- Mantém estado entre recarregamentos
- Não requer servidor real

**Limitação:** Dados são perdidos ao limpar cache do navegador.

### 3. Componentes shadcn/ui

**Decisão:** Usar componentes do shadcn/ui.

**Motivo:**
- Acessibilidade (Radix UI)
- Customizável via Tailwind
- TypeScript nativo
- Manutenção ativa

### 4. Estados de Loading/Error/Empty

**Decisão:** Componentes reutilizáveis para estados.

**Motivo:**
- Consistência visual
- Reutilização
- Melhor UX

### 5. TypeScript Strict

**Decisão:** Tipagem forte em todo o projeto.

**Motivo:**
- Detecção de erros em tempo de desenvolvimento
- Melhor autocomplete
- Documentação implícita

### 6. React Router para Navegação

**Decisão:** React Router DOM para roteamento.

**Motivo:**
- Padrão da indústria
- Suporte a rotas dinâmicas (`/users/:id`)
- Navegação programática

### 7. Cache em Memória

**Decisão:** Implementar cache síncrono para helpers.

**Motivo:**
- Permite acesso síncrono aos dados já carregados
- Melhora performance em renderizações
- Reduz chamadas desnecessárias

## ⚠️ Limitações e Melhorias

### Limitações Atuais

1. **Persistência temporária:** Dados salvos apenas no localStorage
2. **Sem autenticação:** Não há sistema de login/autorização
3. **Sem validação de formulários:** Validações básicas apenas
4. **Sem paginação:** Todas as listas carregam todos os dados
5. **Sem busca avançada:** Busca apenas por nome/email
6. **Sem exportação:** Não é possível exportar dados
7. **Sem histórico:** Não há log de alterações

### Melhorias Futuras Sugeridas

1. **Backend Real:**
   - Integração com API REST
   - Autenticação JWT
   - Banco de dados persistente

2. **Funcionalidades:**
   - Paginação e virtualização de listas
   - Busca avançada com múltiplos filtros
   - Exportação para CSV/Excel
   - Histórico de alterações (audit log)
   - Dashboard com gráficos (Recharts já incluído)

3. **Performance:**
   - Implementar React Query para cache
   - Lazy loading de rotas
   - Code splitting

4. **UX:**
   - Animações de transição
   - Modo escuro/claro
   - Notificações em tempo real
   - Confirmações para ações destrutivas

5. **Testes:**
   - Testes unitários (Vitest já configurado)
   - Testes de integração
   - Testes E2E (Playwright/Cypress)

6. **Acessibilidade:**
   - Navegação por teclado completa
   - Screen reader optimization
   - ARIA labels

## 📝 Scripts Disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run build:dev    # Build em modo desenvolvimento
npm run preview      # Preview da build de produção
npm run lint         # Executa ESLint
npm run test         # Executa testes
npm run test:watch   # Executa testes em modo watch
```

## 🤝 Contribuindo

Este é um projeto de demonstração. Para contribuições:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

---

**Desenvolvido com ❤️ usando React, TypeScript e shadcn/ui**
