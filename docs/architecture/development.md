# Local Development

## Start PostgreSQL

```bash
docker compose up -d postgres
```

## Configure environment

Copy `.env.example` to `.env` at the repository root.

## Install dependencies

```bash
pnpm install
```

## Start both applications

```bash
pnpm dev
```

Frontend: http://localhost:5173  
API: http://localhost:4000  
GraphQL: http://localhost:4000/graphql
