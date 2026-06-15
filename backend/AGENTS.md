# AGENTS.md — Backend (NestJS API)

## Stack
- NestJS + TypeScript
- Prisma ORM (PostgreSQL)
- Autenticação: JWT (passport-jwt)
- Validação: class-validator + class-transformer
- Documentação: @nestjs/swagger
- Testes: Jest

## Estrutura de Módulos
Cada módulo segue o padrão NestJS com separação estrita de camadas:
- `*.controller.ts` — endpoints, decorators de rota
- `*.service.ts` — lógica de negócio
- `*.module.ts` — encapsulamento de dependências
- `*.dto.ts` — payloads de entrada/saída validados
- `*.guard.ts` — guards de autenticação/autorização quando necessário

Módulos planejados:
```
src/
├── auth/          (register, login, JWT)
├── books/         (CRUD com soft delete)
├── authors/       (CRUD com soft delete)
├── loans/         (empréstimos, devolução, validação de limite)
├── prisma/        (serviço do PrismaClient)
├── common/        (guards globais, decorators, interceptors, filters)
└── main.ts
```

## Regras do Prisma
- Todos os IDs: `String` (UUID v4, gerado por `uuid()`)
- Nomes de campos em camelCase
- Soft Delete em Author e Book: campo `deletedAt` (nullable DateTime)
- Enum `Role`: READER, LIBRARIAN, ADMIN
- Índice composto em Loan: `(userId, returned)`
- Relacionamentos: Author 1:N Book, User 1:N Loan, Book 1:N Loan

## Convenções de Código
- Arquivos em kebab-case: `auth.controller.ts`
- Classes em PascalCase: `AuthController`
- DTOs com sufixo `Dto`: `CreateBookDto`
- Respostas padronizadas via Interceptor global: `{ success: true, data: ... }`
- Erros via Exception Filter global: `{ success: false, statusCode, message, timestamp, path }`

## Autenticação e RBAC
- Registro público → role padrão READER
- Seed para criar ADMIN e LIBRARIAN iniciais
- JWT com payload `{ sub: userId, role: userRole }`
- Guards por role: `@Roles('LIBRARIAN', 'ADMIN')` + RolesGuard
- ValidationPipe global com `{ whitelist: true, forbidNonWhitelisted: true }`

## Testes
- Unitários por módulo junto ao código (`auth.service.spec.ts`)
- E2E em `test/` separado
- Mock do Prisma nos unitários
