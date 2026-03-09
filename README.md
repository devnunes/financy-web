# Financy Web

Aplicação frontend do Financy, desenvolvida como parte do **trabalho final de pós-graduação na Faculdade de Tecnologia Rocketseat**.

## Objetivo

Entregar a interface web para autenticação e gerenciamento financeiro dos usuários, consumindo a API GraphQL do projeto.

## Stack

- React 19
- TypeScript
- Vite
- Apollo Client (GraphQL)
- React Hook Form + Zod
- Zustand (estado global de autenticação)
- Tailwind CSS
- Biome

## Funcionalidades atuais

### Autenticação

- Tela de login
- Tela de cadastro
- Validação de formulário com Zod
- Sincronização de sessão com `me`
- Controle de acesso com rotas protegidas e rotas públicas

### Navegação autenticada

- `/dashboard`
- `/transactions`
- `/categories`

> As páginas de dashboard, transações e categorias já existem, porém ainda estão em estágio inicial de interface e integração completa de CRUD.

## Estrutura resumida

- `src/pages/Auth`: páginas de autenticação e área privada
- `src/router`: definição e proteção de rotas
- `src/lib/graphql`: client Apollo, queries e mutations
- `src/stores`: estado global (auth)
- `src/components`: layout e componentes reutilizáveis

## Integração com backend

O Apollo Client está configurado para:

- URL GraphQL: `http://localhost:3333/graphql`
- `credentials: include` para sessão por cookie

## Como rodar

```bash
pnpm install
pnpm dev
```

Aplicação disponível em `http://localhost:5173`.

## Scripts úteis

```bash
pnpm dev
pnpm build
pnpm preview
pnpm format
pnpm lint
pnpm check:biome
```
