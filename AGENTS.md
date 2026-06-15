# AGENTS.md — BookStore Library (Root)

## Identidade
BookStore Library — sistema de gerenciamento de biblioteca universitária.
Monorepo com `/backend` (API) e `/frontend` (web app).

## Stack
- Backend: NestJS + TypeScript + Prisma ORM
- Frontend: React + Vite + Zustand
- Banco: PostgreSQL (Neon.tech)
- Qualidade: Jest, Swagger, ESLint + Prettier

## Regras de Git (IMPORTANTE)
- **Nunca** fazer commit, push, merge ou qualquer alteração nas branches `main` ou `develop`.
- Trabalhar **sempre** na branch atual (`feature/*`).
- Mudanças de branch ocorrem **apenas** mediante instrução prévia e explícita do usuário.
- Commits em português, estilo conventional commits (`feat:`, `fix:`, `docs:`, etc.).

## Estrutura do Repositório
- `/backend` — API NestJS (ver `backend/AGENTS.md`)
- `/frontend` — React SPA (ver `frontend/AGENTS.md`)
- `/docs` — Documentação do projeto (PRD, SDD, User Stories, Checklist)
- `/.github/workflows/ci.yml` — CI pipeline
- `opencode.json` — Configuração do OpenCode (MCP Neon)
- `.envrc` — direnv (carrega `backend/.env` para o shell)

## Scripts raiz (package.json)
- `npm run dev` — sobe backend + frontend em paralelo
- `npm run build` — compila ambos os projetos
- `npm run test` — roda testes em ambos
- `npm run lint` — linter em ambos

## Conexão com Banco de Dados
- PostgreSQL na Neon.tech — configurado via `DATABASE_URL` em `/backend/.env`
- Neon MCP server configurado no `opencode.json`
- Variáveis carregadas via `.envrc` → `dotenv backend/.env`

## Ambiente
- Node v24.13.0
- npm gerenciado via nvm

## CI
- Roda lint → build → test em todo push (GitHub Actions)
- Backend e frontem em jobs paralelos e independentes

## Linter e Formatação
- ESLint com @typescript-eslint para qualidade de código
- Prettier para formatação consistente
- eslint-config-prettier para evitar conflitos
- Sem Husky/lint-staged por ora (CI já cobre)

## Testes (Jest)
- Unitários por módulo (`*.spec.ts` junto ao código, padrão NestJS)
- E2E separados em `test/` (NestJS) ou `src/__tests__/` (frontend)
- Coverage com `--coverage`, meta mínima 70%
- TDD: testes antes da implementação da lógica de negócio

## Variáveis de Ambiente
- **Backend**: `backend/.env` (gitignorado), `backend/.env.example` (versionado)
- **Frontend**: `frontend/.env` (gitignorado), `frontend/.env.example` (versionado)
- Apenas variáveis públicas (`VITE_API_URL`) vão pro frontend
