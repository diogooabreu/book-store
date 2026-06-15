# AGENTS.md — Frontend (React + Vite)

## Stack
- React 18+ com TypeScript
- Vite para build/dev
- Zustand para estado global
- React Router DOM para navegação
- Axios para HTTP
- Testes: Vitest + testing-library

## Estrutura de Pastas
```
src/
├── components/     # Componentes reutilizáveis (Navbar, Modal, Tabela, Botão)
├── pages/          # Páginas da aplicação agrupadas por domínio
│   ├── auth/       # Login, Register
│   ├── dashboard/  # Catálogo + Meus Empréstimos (Leitor)
│   └── admin/      # Gestão de acervo + Circulação (Bibliotecário/Admin)
├── stores/         # Zustand stores
│   └── useAuthStore.ts      # Sessão do usuário (id, email, role, JWT)
├── services/       # Axios instance + funções de API
│   ├── api.ts               # Instância axios c/ interceptors
│   ├── auth.ts              # login, register
│   ├── books.ts             # CRUD livros
│   ├── authors.ts           # CRUD autores
│   └── loans.ts             # empréstimos
├── types/          # Interfaces/typos compartilhados
│   └── index.ts
├── test/           # Setup de teste
│   └── setup.ts
├── App.tsx
└── main.tsx
```

## Convenções
- Componentes: PascalCase (LoginPage, BookTable)
- Stores: camelCase com prefixo `use` (useAuthStore)
- Serviços: camelCase (authService.login)
- Pastas: kebab-case

## Autenticação
- JWT armazenado na store Zustand
- Interceptor do axios adiciona `Authorization: Bearer <token>`
- Rotas protegidas via React Router (PrivateRoute)
- Logout limpa a store e redireciona para /login

## Variáveis de Ambiente
- `VITE_API_URL` — URL base da API NestJS
- Nenhuma variável secreta no frontend (tudo é exposto no browser)
- `.env` gitignorado, `.env.example` versionado com placeholder
