# Walkthrough - Engenharia de Requisitos do BookStore Library

Este documento apresenta o resultado final da modelagem de negócio e estruturação de requisitos para o projeto de biblioteca universitária **BookStore Library**.

---

## 1. Documentos Criados

- **[prd.md](file:///home/diogo/.gemini/antigravity/brain/553d52fa-d697-41db-a92c-16d6b504e4ff/prd.md)**: Documento de Requisitos de Produto que estabelece a visão geral do sistema, papéis de usuário (RBAC), regras de negócio críticas (como o limite de 4 empréstimos ativos simultâneos por usuário), e diagramas de sequência do sistema (SSD) desenhados em Mermaid.
- **[user_stories.md](file:///home/diogo/.gemini/antigravity/brain/553d52fa-d697-41db-a92c-16d6b504e4ff/user_stories.md)**: Backlog contendo as Histórias de Usuário escritas em formato ágil (User Stories + Cenários Gherkin). Cada história possui critérios de aceitação técnicos que explicitam os requisitos arquiteturais e de qualidade acadêmicos.

---

## 2. Matriz de Cobertura de Requisitos Técnicos

Para garantir que a implementação do projeto passe obrigatoriamente por todos os 12 requisitos técnicos universitários, foi realizada uma validação cruzada mapeada abaixo:

| Requisito Universitário | Descrição Curta | Cobertura nas Histórias de Usuário |
| :--- | :--- | :--- |
| **ID1** | Estrutura clara do PRD e SSD em Mermaid | Coberto pelo [prd.md](file:///home/diogo/.gemini/antigravity/brain/553d52fa-d697-41db-a92c-16d6b504e4ff/prd.md) contendo os diagramas de autenticação, empréstimo e cadastro. |
| **ID2** | Estruturação Monorepo (Front + Back) | Coberto pela **US004** que define a infraestrutura física `/backend` e `/frontend`. |
| **ID3** | Mapeamento no GitHub Projects (Issues) | Coberto pela **US004** que descreve como as histórias geram Issues vinculadas ao Kanban do projeto. |
| **ID4** | Prática de GitFlow e Pull Requests | Coberto pela **US004** que proíbe commit direto em branch principal e exige PRs. |
| **ID5** | Separação de camadas no NestJS | Coberto por **US001**, **US002** e **US003** (uso estrito de controllers, services e modules isolados). |
| **ID6** | DTOs e ValidationPipes com whitelist | Coberto por **US001** (cadastro/login) e **US002** (cadastro de acervo) com decorators e pipes ativos. |
| **ID7** | CRUD relacional com Prisma ORM | Coberto por **US002** (Relação Livro-Autor 1-N) e **US003** (Relação Empréstimo com transações Prisma). |
| **ID8** | Autenticação JWT e Guards (Roles) | Coberto por **US001** (login gerando JWT) e **US002/US003** (bloqueio de endpoints administrativos usando RolesGuard). |
| **ID9** | Interceptors e Exception Filters globais | Coberto por **US001**, **US002** e **US003** (formato padrão de resposta e tratamento de falhas relacionais/erros 400). |
| **ID10** | TDD: testes automatizados Jest antes da lógica | Coberto em **US001**, **US002** e **US003** (redação de testes mockados no Jest antes de implementar controllers/services). |
| **ID11** | Testes cobrindo sucesso/erro rodando com sucesso | Coberto em **US001**, **US002**, **US003** (testes de limites de empréstimo e permissões) e **US004** (pipeline de CI local). |
| **ID12** | Documentação Swagger viva | Coberto em **US001** e **US002** com tags e respostas documentadas. |

---

## 3. Próximos Passos de Desenvolvimento

1. **Configuração do Repositório**:
   - Inicializar a raiz do Git no diretório `/home/diogo/Desktop/projects/book-store`.
   - Criar as subpastas `/backend` (inicializado com `nest new backend`) e `/frontend` (inicializado com `npm create vite@latest frontend`).
2. **Setup do GitHub Projects**:
   - Criar as 4 Issues no repositório GitHub com base nas histórias de usuário descritas no arquivo `user_stories.md`.
   - Adicioná-las ao Kanban do GitHub Projects.
3. **Desenvolvimento (GitFlow + TDD)**:
   - Criar ramificação `feature/auth` para a **US001**.
   - Criar os testes Jest para cadastro/login.
   - Implementar os DTOs, Pipes, AuthController, AuthService e JWT Guard no NestJS até que os testes passem.
   - Abrir Pull Request para a branch principal.
   - Repetir o ciclo para as demais features.
