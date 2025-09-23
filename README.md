# Simpósio Acadêmico – IF Sudeste MG

Plataforma full-stack (Node.js + MongoDB + React) para gestão do simpósio acadêmico da Diretoria de Pesquisa e Pós-Graduação (DPPG). O projeto segue arquitetura MVC, aplica o Design System do Governo Federal (DSGov), boas práticas de segurança (OWASP), LGPD e acessibilidade (WCAG 2.1).

## Visão Geral

- **Autenticação** com Argon2id, JWT com rotação de refresh tokens, cookies `HttpOnly` e 2FA TOTP opcional.
- **RBAC**: papéis `admin`, `sub-admin`, `user`, `avaliador-externo` com autorização granular.
- **LGPD**: exportação de dados, consentimentos por finalidade, retificação, solicitação de exclusão (soft delete) e auditoria completa.
- **Módulos principais**: catálogos (áreas, subáreas), programação (subeventos), inscrições com checagem de conflitos, submissões, avaliações com critérios configuráveis, emissão e validação de certificados em PDF com QR Code, acervo público e conteúdo institucional versionado.
- **Frontend** em React 18 + Vite com componentes oficiais `@govbr-ds/react-components`, React Query, React Hook Form + Zod, DOMPurify, i18n e máscaras.
- **Backend** em Node.js/Express com TypeScript, Mongoose, Helmet, rate limiting, sanitização, Pino para logs, Multer para uploads e geração de PDF com QR Code.

## Arquitetura do Repositório

```
/
├── backend/            # API Node.js/Express + Mongoose
│   ├── src/
│   │   ├── config/     # env, database, logger
│   │   ├── models/     # Schemas com soft delete e auditoria
│   │   ├── controllers/# Camada MVC fina
│   │   ├── services/   # Regra de negócio e integrações
│   │   ├── routes/     # Rotas Express com validação Zod
│   │   ├── middlewares/# Auth, RBAC, auditoria, erros
│   │   └── seeds/      # Seeds com admin/docente/avaliador
│   └── tests/          # Testes Jest/Supertest
├── frontend/           # SPA React + DSGov
│   ├── src/app/        # Providers (QueryClient, i18n, Auth)
│   ├── src/routes/     # Rotas públicas/privadas
│   ├── src/pages/      # Telas públicas e painel
│   ├── src/services/   # Axios + React Query hooks
│   ├── src/stores/     # AuthContext (JWT HttpOnly)
│   └── src/tests/      # Testes com React Testing Library
├── docker-compose.yml  # MongoDB + Mongo Express
├── package.json        # Scripts globais, Husky, lint-staged
└── README.md
```

## Pré-requisitos

- Node.js LTS (>=18)
- npm >=9
- Docker + Docker Compose

## Setup

```bash
cp .env.example .env
npm install
npm run prepare # instala hooks do Husky
```

### Subir infraestrutura

```bash
docker-compose up -d
```

### Executar em desenvolvimento

```bash
npm run dev         # inicia API em :4000 e frontend em :5173
```

A API expõe `http://localhost:4000/api` e o frontend `http://localhost:5173`.

## Seeds

Após subir o MongoDB, execute o script de seeds dentro do backend (exemplo de uso via `ts-node`):

```bash
npm --prefix backend run seed
```

Usuários gerados:

| Perfil | E-mail | Senha | Observações |
| ------ | ------ | ----- | ----------- |
| Admin  | `admin@test.com` | `ChangeMe123!` | role `admin` |
| Docente | `docente@test.com` | `ChangeMe123!` | aguardava aprovação (seed já aprova) |
| Avaliador externo | `avaliador@externo.com` | `ChangeMe123!` | role `avaliador-externo` |

Também são criados subeventos, áreas/subáreas, datas do evento, conteúdo de regulamento e submissões de exemplo (incluindo uma apresentação oral aprovada que gera subevento automaticamente).

## Scripts Principais

```json
npm run dev       // backend + frontend em modo desenvolvimento
npm run dev:be    // somente API
npm run dev:fe    // somente frontend
npm run test      // Jest (backend) + Vitest (frontend)
npm run lint      // ESLint + Prettier (backend e frontend)
```

### Testes

- **Backend**: Jest + Supertest (`backend/src/tests`).
- **Frontend**: Vitest + React Testing Library (`frontend/src/tests`).
- **E2E**: Playwright configurado via `npm --prefix frontend run e2e` (roteiros base prontos para expansão).

## Segurança, LGPD e Acessibilidade

- Helmet com CSP, Rate-limit, `express-mongo-sanitize`, HPP e sanitização de HTML no backend e frontend.
- Argon2id para senhas, JWT curto com refresh rotativo (revogação em caso de reutilização) e cookies `HttpOnly` (`SameSite=Lax`, `Secure` em produção).
- Auditoria (`AuditLog`) grava IP, user-agent, ação, diffs e sucesso/erro.
- Soft delete em todas as entidades (`isDeleted`, `deletedAt`, `deletedBy`) com filtros automáticos nos repositórios.
- LGPD: exportação (`/me/export`), atualização de consentimentos, solicitação de exclusão lógica, mascaramento de CPF e registro de finalidade.
- Certificados com PDF assinado (PDFKit) e QR Code para validação pública.
- Acessibilidade: foco visível, navegação por teclado, landmarks, ARIA e componentes oficiais DSGov.

## Padrões de Código

- ESLint + Prettier + Husky + lint-staged (pré-commit executa lint e testes relacionados).
- Conventional commits recomendados.

## Variáveis de Ambiente

Backend (`.env`):

```
PORT=4000
MONGO_URI=mongodb://localhost:27017/simposio
JWT_SECRET=...
JWT_REFRESH_SECRET=...
COOKIE_DOMAIN=localhost
CSRF_SECRET=...
STORAGE_DIR=./storage
```

Frontend (`.env`):

```
VITE_API_URL=http://localhost:4000/api
```

## Build de Produção

```bash
npm --prefix backend run build
npm --prefix backend run start
npm --prefix frontend run build
npm --prefix frontend run preview
```

## Observações

- Todos os uploads (acervo, certificados) são armazenados em `STORAGE_DIR` com hash SHA-256.
- Sanitização de conteúdo rico permite apenas tags seguras (`b`, `i`, `u`, `ul`, `ol`, `li`, `p`, `a` etc.).
- Auditoria e permissões foram desenhadas para extensão (filas, notificações, CI/CD) sem alteração estrutural.

## Contato

Este projeto foi desenvolvido como blueprint completo para modernização do simpósio acadêmico do IF Sudeste MG – DPPG. Ajustes adicionais (integrações, relatórios avançados, monitoramento) podem ser acoplados mantendo a arquitetura proposta.
