# AGENTS.md — BookStore Library (Root)

## Identidade
BookStore Library — sistema de gerenciamento de biblioteca universitária.
Monorepo com `/backend` (API) e `/frontend` (web app).

## Stack
- Backend: NestJS + TypeScript + Prisma ORM
- Frontend: React + Vite + Zustand
- Banco: PostgreSQL (Neon.tech)
- Qualidade: Jest, Swagger

## Regras de Git (IMPORTANTE)
- **Nunca** fazer commit, push, merge ou qualquer alteração nas branches `main` ou `develop`.
- Trabalhar **sempre** na branch atual (`feature/*`).
- Mudanças de branch ocorrem **apenas** mediante instrução prévia e explícita do usuário.
- Commits em português, estilo conventional commits (`feat:`, `fix:`, `docs:`, etc.).

## Estrutura do Repositório
- `/backend` — API NestJS (ver backend/AGENTS.md para detalhes)
- `/frontend` — React SPA (ver frontend/AGENTS.md para detalhes)
- `/docs` — Documentação do projeto (PRD, SDD, User Stories, Checklist)
- `opencode.json` — Configuração do OpenCode (MCP Neon)
- `.envrc` — Configuração de ambiente

## Conexão com Banco de Dados
- PostgreSQL na Neon.tech — configurado via `DATABASE_URL` em `/backend/.env`
- Conexão testada e funcionando (Jun/2026)
- Neon MCP server configurado no `opencode.json`

## Ambiente
- Node v24.13.0
- npm gerenciado via nvm
