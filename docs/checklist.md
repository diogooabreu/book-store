# Checklist de Avaliacao | ID & RA

> **Projeto:** BookStore Library
> **Disciplina:** Topicos Especiais em Programacao
> **Docente:** Roni Fabio Banaszewski

---

## RA1 - Arquitetura, Engenharia de Requisitos com IA e Gestao Agil
* [ ] **ID1:** Estruturou o **PRD** e o **SDD** (Diagrama Mermaid) de forma clara, utilizando a IA para modelar o negocio.
* [ ] **ID2:** A aplicacao foi estruturada em formato de **Monorepo** (Front + Back) no GitHub.
* [ ] **ID3:** Mapeou o PRD em **Historias de Usuario** no GitHub Projects, criando um backlog rastreavel de Issues.
* [ ] **ID4:** Demonstrou dominio do **GitFlow**, isolando features e utilizando Pull Requests para integracao.

---

## RA2 - Desenvolvimento Backend Assistido por IA
* [x] **ID5:** O codigo NestJS mantem **separacao estrita de camadas** arquiteturais (Controllers, Services, Modules).
* [x] **ID6:** Aplicou **DTOs** e `ValidationPipes` (com `whitelist`) para blindar as entradas da API.
* [x] **ID7:** Implementou operacoes **CRUD relacionais** utilizando Prisma ORM.
* [x] **ID8:** Configurou **autenticacao JWT** e protegeu rotas atraves de controle de acesso (Roles/Guards).
* [ ] **ID9:** Padronizou o trafego com **Interceptors** para respostas e **Exception Filters** globais para erros.

---

## RA3 - Qualidade de Software e TDD Guiado por IA
* [x] **ID10:** Orquestrou a IA no fluxo **TDD**, gerando testes automatizados (Jest) baseados nas Issues antes da implementacao da logica.
* [x] **ID11:** Os **testes** locais ou no pipeline executam com sucesso, cobrindo caminhos de sucesso e erro.

---

## RA4 - Prototipagem e Integracao Frontend
* [x] **ID12:** A API do backend expoe documentacao **Swagger (OpenAPI)** atualizada e interativa.
* [ ] **ID13:** Materializou o PRD em **interfaces visuais** (React/Angular/Vue) utilizando prototipagem assistida por IA.
* [ ] **ID14:** A interface consome os dados reais da API NestJS de forma sincrona, lidando corretamente com os **tokens JWT**.

---

## RA5 - Pipeline CI/CD e Implantacao Continua
* [ ] **ID15:** As credenciais e **variaveis sensiveis** (como a `DATABASE_URL` da nuvem) estao seguras, ocultas do GitHub e injetadas via `ConfigModule`.
* [ ] **ID16:** Configurou esteira de **CI (Continuous Integration)** via GitHub Actions para validacao automatica de codigo (Jest/Linting) antes do merge.
* [ ] **ID17:** Realizou o **deploy** da aplicacao em dominio publico (nuvem), conectada a um banco de dados relacional em producao (Neon.tech).


