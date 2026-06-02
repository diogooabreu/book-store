# Backlog de Histórias de Usuário (User Stories) - BookStore Library

Este documento contém o backlog de Histórias de Usuário do **BookStore Library**. Cada história foi detalhada para que o desenvolvedor, ao implementá-la, seja obrigado a seguir as práticas de engenharia de software e os critérios técnicos exigidos pelos 12 Indicadores de Desempenho (IDs).

---

## US001: Autenticação de Usuário e Gestão de Perfis (RBAC)

### **Descrição da História**
> **Como** leitor, bibliotecário ou administrador da biblioteca,  
> **Eu quero** me registrar no sistema e realizar login,  
> **Para** que eu possa acessar as funcionalidades da aplicação de acordo com o meu nível de permissão (Leitor, Bibliotecário, Admin).

---

### **Critérios de Aceitação Funcionais (Gherkin)**

#### **Cenário 1: Cadastro de Leitor com Sucesso**
- **Dado** que eu sou um usuário não autenticado e estou na página de cadastro,
- **Quando** eu enviar dados válidos de e-mail (único) e senha,
- **Então** o sistema deve salvar minha senha criptografada e criar minha conta com o papel (`role`) padrão de `READER`.
- **E** me redirecionar para a tela de login.

#### **Cenário 2: Login com Sucesso**
- **Dado** que eu possuo uma conta cadastrada no sistema com papel de `LIBRARIAN`,
- **Quando** eu enviar meu e-mail e senha corretos na rota de login,
- **Então** o sistema deve retornar um token JWT válido contendo meu `id` e minha `role`.

#### **Cenário 3: Login falha por senha incorreta**
- **Dado** que eu possuo uma conta cadastrada,
- **Quando** eu tentar logar fornecendo uma senha incorreta,
- **Então** o sistema deve recusar o login e retornar um erro `401 Unauthorized` estruturado de forma legível.

---

### **Critérios de Aceitação Técnicos (IDs Vinculados)**

1. **[ID5] Arquitetura em Camadas (NestJS)**:
   - A lógica de autenticação deve ser isolada em `auth.controller.ts`, `auth.service.ts` e declarada em `auth.module.ts`. O controller não deve ter lógica de negócio direta.
2. **[ID6] Blindagem de Entrada com DTOs e ValidationPipes**:
   - Criar `RegisterUserDto` e `LoginDto` utilizando decorators do `class-validator` (ex: `@IsEmail()`, `@IsString()`, `@MinLength(6)`).
   - O `ValidationPipe` do NestJS deve estar ativo globalmente com `{ whitelist: true, forbidNonWhitelisted: true }` para barrar parâmetros extras não documentados.
3. **[ID8] Geração de Tokens JWT**:
   - Configurar o `@nestjs/jwt` e assinar o token contendo o payload `{ sub: userId, role: userRole }`.
4. **[ID9] Padronização de Tráfego (Interceptors e Exception Filters)**:
   - O retorno de sucesso deve ser envelopado por um interceptor global (ex: `{ success: true, data: { accessToken: "..." } }`).
   - O erro de login incorreto deve ser formatado por um exception filter global (ex: `{ success: false, error: "Unauthorized", message: "Credenciais inválidas", timestamp: "..." }`).
5. **[ID10 & ID11] TDD e Qualidade de Testes**:
   - Antes de programar a lógica da controller ou service, o desenvolvedor **deve escrever os testes automatizados com Jest** na pasta de testes do NestJS.
   - Os testes devem cobrir:
     - Caso de sucesso (cadastro e login gerando JWT).
     - Casos de erro (e-mail duplicado gerando `400 Bad Request`, e-mail inválido, login recusado).
6. **[ID12] Swagger**:
   - Decorar as rotas de Auth com `@ApiTags('Authentication')`, `@ApiOperation()`, `@ApiResponse()` para expor payloads e respostas no painel interativo.

---
---

## US002: Gestão do Acervo (CRUD de Livros e Autores Relacionados)

### **Descrição da História**
> **Como** um Bibliotecário ou Administrador da biblioteca,  
> **Eu quero** gerenciar os autores e livros do acervo (cadastrar, listar com paginação, atualizar e excluir),  
> **Para** manter a biblioteca atualizada com as obras físicas existentes.

---

### **Critérios de Aceitação Funcionais (Gherkin)**

#### **Cenário 1: Cadastro de Autor e Livro Relacionado**
- **Dado** que eu sou um Bibliotecário autenticado,
- **Quando** eu cadastrar um Autor e em seguida cadastrar um Livro fornecendo o `authorId` correspondente,
- **Então** o sistema deve salvar ambos os registros relacionando-os no banco de dados.

#### **Cenário 2: Leitor tenta cadastrar livro (Acesso Negado)**
- **Dado** que eu estou logado como um usuário comum (`READER`),
- **Quando** eu tentar fazer uma requisição `POST /books`,
- **Então** o sistema deve negar o acesso imediatamente com erro `403 Forbidden`.

#### **Cenário 3: Exclusão de Livro (Soft Delete)**
- **Dado** que eu sou um Bibliotecário,
- **Quando** eu requisitar a exclusão de um livro pelo seu ID,
- **Então** o sistema deve marcar o registro como excluído logicamente (campo `deletedAt` preenchido) sem removê-lo fisicamente da base de dados, garantindo que o histórico relacional de empréstimos antigos permaneça intacto.

---

### **Critérios de Aceitação Técnicos (IDs Vinculados)**

1. **[ID7] CRUD Relacional com Prisma ORM e Soft Delete**:
   - Definir os schemas do Prisma (`schema.prisma`) modelando a relação `1-para-N` entre `Author` (Autor) e `Book` (Livro).
   - As tabelas de `Book` e `Author` devem possuir a coluna `deletedAt` para suportar Soft Delete.
   - As rotas de leitura/listagem (como `GET /books`) devem retornar apenas registros onde `deletedAt` seja nulo.
   - Utilizar queries relacionais do Prisma Client (ex: `prisma.book.create({ data: { ..., authorId } })` ou query com `include` para retornar o autor associado).
2. **[ID8] Guards de Acesso por Roles**:
   - Implementar um decorator customizado `@Roles('LIBRARIAN', 'ADMIN')` e um `RolesGuard` para proteger as rotas de modificação (`POST`, `PUT`, `DELETE` de `/books` e `/authors`).
3. **[ID5] Arquitetura Separada**:
   - Criar módulos estruturados e independentes para `books` e `authors`, mantendo a separação entre controladores e injeção de serviços de banco.
4. **[ID6] Validação de Cadastro**:
   - DTOs `CreateBookDto` e `CreateAuthorDto` com validações estritas de tipo e tamanho de campos.
5. **[ID10 & ID11] TDD nos Endpoints do Acervo**:
   - Escrever testes automatizados JUnit/Jest na controller de Books e Authors antes de implementar o código.
   - Cobrir nos testes:
     - Cadastro de livro associado a um autor válido.
     - Tentativa de cadastro associado a um autor inexistente (deve disparar erro `404 Not Found`).
     - Bloqueio de rota para perfis sem privilégios (`READER`).
6. **[ID12] Swagger**:
   - Expor esquemas de dados de `Book` e `Author` detalhados no Swagger, permitindo que a equipe de frontend saiba quais campos preencher na tela de cadastro.

---
---

## US003: Circulação de Livros - Empréstimos e Validação de Limite de 4 Obras

### **Descrição da História**
> **Como** Leitor da biblioteca,  
> **Eu quero** solicitar o empréstimo de um livro do acervo,  
> **Para** que eu possa lê-lo em casa.  
> **Como** Bibliotecário,  
> **Eu quero** registrar a devolução do livro,  
> **Para** liberar a vaga de empréstimo do usuário e retornar o livro para o estoque disponível.

---

### **Critérios de Aceitação Funcionais (Gherkin)**

#### **Cenário 1: Solicitação de Empréstimo bem-sucedida**
- **Dado** que eu sou um Leitor autenticado e possuo 2 empréstimos ativos,
- **Quando** eu tentar solicitar o empréstimo de um livro que possui estoque disponível (`stock > 0`),
- **Então** o sistema deve registrar o empréstimo (devolvido = false), decrementando o estoque do livro em 1 unidade.

#### **Cenário 2: Bloqueio de empréstimo por limite de 4 livros ou pendência de atraso**
- **Dado** que eu sou um Leitor autenticado e já possuo 4 empréstimos ativos (não devolvidos) OU possuo pelo menos 1 empréstimo ativo pendente com data prevista de devolução expirada,
- **Quando** eu tentar solicitar o empréstimo de mais um livro do acervo,
- **Então** o sistema deve negar a solicitação com um erro `400 Bad Request`, informando o motivo da recusa (limite máximo de 4 empréstimos atingido ou empréstimo pendente em atraso).

#### **Cenário 3: Bloqueio de empréstimo por falta de estoque**
- **Dado** que o livro selecionado possui 0 cópias disponíveis na biblioteca,
- **Quando** um leitor tentar realizar o empréstimo,
- **Então** o sistema deve negar e retornar `400 Bad Request` indicando "Livro indisponível no estoque".

#### **Cenário 4: Registro de Devolução com Sucesso**
- **Dado** que um usuário possui um empréstimo ativo,
- **Quando** o Bibliotecário enviar uma requisição informando a devolução do livro,
- **Então** o sistema deve marcar o empréstimo como devidamente devolvido (devolvido = true), incrementando o estoque do livro em 1 unidade.

---

### **Critérios de Aceitação Técnicos (IDs Vinculados)**

1. **[ID5] Lógica Crítica na Camada Service**:
   - A validação de negócio (contagem de empréstimos ativos usando `prisma.loan.count({ where: { userId, returned: false } })` e verificação se há empréstimos atrasados ativos comparando a data atual com `returnDate`) deve ocorrer estritamente em `loans.service.ts`.
2. **[ID7] Transações com Prisma ORM**:
   - O empréstimo altera duas tabelas: insere em `Loan` e atualiza o estoque em `Book`. O desenvolvedor deve implementar isso de forma atômica (ex: utilizando `$transaction` do Prisma) para evitar inconsistências no estoque em caso de falhas.
3. **[ID8] Controle de Acesso**:
   - O Leitor pode solicitar empréstimo para si mesmo. A devolução (`PATCH /loans/:id/return`), contudo, deve ser acessível unicamente pelas roles `LIBRARIAN` e `ADMIN`.
4. **[ID9] Interceptores e Filtros**:
   - A resposta de "limite excedido", "atraso pendente" ou "estoque esgotado" deve disparar uma `BadRequestException` nativa do NestJS, a qual será formatada pelo Exception Filter global.
5. **[ID10 & ID11] TDD Extensivo para Regras de Negócio**:
   - **Fluxo TDD**: Escrever os testes unitários do `LoansService` antes do código. Os testes Jest devem mockar a resposta do Prisma e validar matematicamente os limites e datas de devolução.
   - Cenários obrigatórios de teste:
     - Usuário com 3 empréstimos e sem atrasos -> Solicita o 4º empréstimo -> Retorna sucesso.
     - Usuário com 4 empréstimos -> Solicita o 5º empréstimo -> Lança exceção de limite atingido.
     - Usuário com 2 empréstimos, sendo 1 atrasado -> Solicita empréstimo -> Lança exceção de atraso pendente.
     - Livro com estoque 0 -> Solicita empréstimo -> Lança exceção de falta de estoque.
     - Registro de devolução -> Incrementa estoque e marca como devolvido.

---
---

## US004: Arquitetura Monorepo, Gestão Ágil de Tarefas e GitFlow (DevOps)

### **Descrição da História**
> **Como** membro da equipe de desenvolvimento da universidade,  
> **Eu quero** ter o repositório estruturado, as tarefas visíveis no GitHub e o pipeline de integração configurado,  
> **Para** garantir a rastreabilidade do progresso e a integridade de todas as entregas do projeto universitário.

---

### **Critérios de Aceitação Funcionais**

#### **Cenário 1: Rastreabilidade de Progresso no GitHub**
- **Dado** que o projeto foi iniciado,
- **Quando** o professor ou time abrir o repositório,
- **Então** deve ser possível acessar a aba "Projects" do GitHub, visualizando o backlog de issues mapeadas diretamente a partir das US001, US002 e US003.

#### **Cenário 2: Isolamento de Features e Revisão (GitFlow)**
- **Dado** que eu vou iniciar o desenvolvimento de uma nova funcionalidade (ex: US003 - Empréstimos),
- **Quando** eu trabalhar no código,
- **Então** eu devo fazê-lo em uma ramificação isolada (ex: `feature/loans-limit`). A integração final para a branch principal (`main`/`develop`) deve obrigatoriamente passar por um Pull Request.

---

### **Critérios de Aceitação Técnicos (IDs Vinculados)**

1. **[ID2] Arquitetura de Monorepo**:
   - A estrutura física de arquivos no repositório deve separar claramente os projetos:
     - `/backend` (NestJS API)
     - `/frontend` (React + Vite SPA)
     - `/packages` ou arquivos compartilhados (opcional)
2. **[ID3] Rastreabilidade de Issues e GitHub Projects**:
   - Cada US (US001, US002, US003) deve ser cadastrada como uma issue no GitHub.
   - Vincular as issues a um Kanban no **GitHub Projects** com colunas bem definidas: *Todo*, *In Progress*, *Testing/Review*, *Done*.
3. **[ID4] GitFlow e Pull Requests**:
   - Proteger a branch `main`/`develop` no GitHub para impedir commits diretos.
   - Criar Pull Requests de integração que exigem a passagem do pipeline automatizado.
4. **[ID11] Validação no Pipeline / Execução com Sucesso**:
   - Configurar o script do package.json do monorepo para executar os testes em ambas as subpastas (`npm run test` no backend).
   - O pipeline (GitHub Actions) ou o build local de integração deve executar todos os testes gerados no fluxo TDD com sucesso antes de permitir a fusão do código.
