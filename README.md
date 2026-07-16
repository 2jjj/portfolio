# Pedro Sakamoto - Portfolio

![CI](https://img.shields.io/github/actions/workflow/status/2jjj/portfolio/ci.yml?branch=main&label=CI)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=node.js)
![License](https://img.shields.io/badge/License-Private-red)

Portfolio pessoal com painel administrativo para gerenciamento dinamico de projetos, skills e conteudo.

## Demo

**Producao:** [pedrosakamoto.dev](https://pedrosakamoto.dev)

## Arquitetura

```
portfolio/
├── src/                    # Frontend React
│   ├── components/         # Componentes reutilizaveis
│   ├── pages/              # Paginas e rotas
│   │   ├── Admin/          # Painel administrativo
│   │   └── Index.tsx       # Pagina publica
│   ├── lib/                # Utilitarios e API client
│   ├── types/              # Definicoes TypeScript
│   └── test/               # Testes
├── server/                 # Backend Express
│   ├── routes/             # Endpoints da API
│   ├── middleware/          # Auth, validacao
│   └── db.js               # Schema e pool PostgreSQL
├── api/                    # Entry point para Vercel Functions
└── public/                 # Assets estaticos
```

## Stack

**Frontend:**
- React 18 + TypeScript + Vite
- React Router v6 (SPA com rotas)
- Tailwind CSS + CSS customizado
- React Query (data fetching)
- Lucide React (icones)

**Backend:**
- Express 5 + Node.js
- PostgreSQL (Supabase)
- JWT (autenticacao)
- Helmet (seguranca HTTP)
- Rate Limiting (protecao contra brute force)

**Deploy:**
- Vercel (frontend + serverless functions)
- Supabase (PostgreSQL gerenciado)

## Setup

### Pre-requisitos

- Node.js 18+
- npm ou yarn
- PostgreSQL (ou Supabase)

### Instalacao

```bash
# Clone o repositorio
git clone https://github.com/2jjj/portfolio.git
cd portfolio

# Instale as dependencias
npm install

# Configure as variaveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais

# Rode o banco de dados (schema + seed)
npm run dev:server

# Em outro terminal, inicie o frontend
npm run dev
```

### Variaveis de Ambiente

| Variavel | Descricao | Obrigatoria |
|----------|-----------|-------------|
| `DATABASE_URL` | URL de conexao com PostgreSQL | Sim |
| `JWT_SECRET` | Seguro para geracao de tokens JWT | Sim |
| `ADMIN_PASSWORD` | Senha de acesso ao painel admin | Sim |
| `GITHUB_USERNAME` | Usuario do GitHub para importacao | Nao |
| `VITE_API_URL` | URL da API (vazia = mesma origem) | Nao |
| `VITE_FORMSPREE_URL` | URL do Formspree para contato | Nao |

## Comandos

```bash
npm run dev          # Frontend em desenvolvimento (port 8080)
npm run dev:server   # Backend em desenvolvimento (port 3001)
npm run build        # Build de producao
npm run start        # Servidor em producao
npm run test         # Executar testes
npm run test:watch   # Testes em watch mode
npm run typecheck    # Verificar tipos TypeScript
npm run lint         # Lint com ESLint
```

## Funcionalidades

### Publico
- Hero com efeito de typing dinamico
- Secao Sobre com contadores animados
- Skills com barras de progresso
- Projetos com filtro por categoria
- Formulario de contato (Formspree)
- Totalmente responsivo

### Administrativo (`/admin`)
- Dashboard com metricas
- CRUD de projetos
- Gerenciamento de skills
- Edicao de conteudo (Hero, Sobre)
- Gerador de curriculo com export para PDF
- Importacao de repositorios do GitHub

## Seguranca

- Variaveis de ambiente nunca commitadas (`.gitignore`)
- CORS configurado com origens permitidas
- Rate limiting em todas as rotas (100 req/15min)
- Rate limiting especifico para login (5 tentativas/15min)
- JWT com expiracao de 24h
- Helmet para headers de seguranca HTTP
- Validacao de input em todas as rotas
- Erros genericos em producao (sem vazar stack traces)

## Testes

```bash
npm run test              # Executa todos os testes
npm run test:coverage     # Gera relatorio de cobertura
```

Testes incluem:
- Validacao de tipos e estruturas de dados
- Componentes React com React Testing Library
- Testes de integracao da API

## Deploy

### Vercel

1. Conecte o repositorio ao Vercel
2. Configure as variaveis de ambiente no painel do Vercel
3. O deploy e automatico a cada push na branch `main`

### CI/CD

O workflow GitHub Actions executa:
- Lint (ESLint)
- Type checking (TypeScript)
- Testes (Vitest)
- Build de producao

## Licenca

Este e um projeto pessoal. O codigo nao esta disponivel para uso sem autorizacao.
