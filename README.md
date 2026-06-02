# BookStore Library

Status do Sistema:
[![CI - Develop (Laboratório)](https://github.com/diogooabreu/book-store/actions/workflows/ci.yml/badge.svg)](https://github.com/diogooabreu/book-store/actions/workflows/ci.yml)
[![CI - Main (Produção)](https://github.com/diogooabreu/book-store/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/diogooabreu/book-store/actions/workflows/ci.yml)

Link em Produção: [Aguardando Deploy na Nuvem]

Autores: [Diogo Abreu]

## 1. Visão Geral

O BookStore Library é um sistema de gerenciamento de biblioteca universitária projetado para digitalizar e automatizar os processos de catalogação de livros, cadastro de usuários, controle de permissões e circulação do acervo (empréstimos e devoluções). O sistema possui regras de validação rígidas para empréstimos (limite de 4 empréstimos ativos simultâneos por usuário e bloqueio automático em caso de empréstimos em atraso) e controle de acesso baseado em perfis (READER, LIBRARIAN, ADMIN) via JWT.

## 2. Documentação Oficial (Docs as Code)

Toda a especificação do sistema está versionada na pasta /docs:

- [PRD (Product Requirements Document)](./docs/prd.md): Visão do produto, papéis de usuário (RBAC), requisitos funcionais e não-funcionais, fluxo de telas e diagramas de sequência do sistema (SSD) em Mermaid.
- [SDD (Software Design Document)](./docs/sdd.md): Dicionário de entidades do banco de dados, regras de integridade física e lógica (como soft delete e prisma seed) e contratos de API REST (payloads JSON).
- [User Stories](./docs/user_stories.md): Backlog de histórias de usuário descritas em formato ágil com critérios de aceitação Gherkin e mapeamento de IDs de requisitos técnicos.
- [Walkthrough](./docs/walkthrough.md): Resumo de modelagem de negócio e estruturação de requisitos para validação acadêmica.

## 3. Stack Tecnológica

- Arquitetura: Monorepo (backend e frontend no mesmo repositório).
- Backend (API): NestJS, TypeScript, JWT, Swagger.
- Banco de Dados: PostgreSQL gerenciado via Prisma ORM com suporte a Soft Delete e inicialização por script de Seed.
- Frontend (Web App): React, Vite, Zustand (para controle de estado global descentralizado).
- Qualidade: Testes automatizados unitários usando Jest (abordagem TDD).

## 4. Quick Start (Como Executar)

1. Clone o repositório:

    git clone https://github.com/diogooabreu/book-store.git
    cd book-store

2. Instale as dependências:
Como é um Monorepo, você precisa instalar os pacotes e iniciar em cada camada:

    # Terminal 1 - Iniciar a API NestJS (Backend)
    cd backend
    npm install
    npm run start:dev

    # Terminal 2 - Iniciar o Frontend React (Vite)
    cd frontend
    npm install
    npm run dev

3. Variáveis de Ambiente:
Não esqueça de copiar o arquivo .env.example para .env dentro da pasta backend e configurar a DATABASE_URL do seu banco de dados PostgreSQL.

4. Seed de Banco de Dados:
Para popular o banco com os usuários administrativos iniciais (ADMIN e LIBRARIAN padrão), execute:

    cd backend
    npx prisma db seed
