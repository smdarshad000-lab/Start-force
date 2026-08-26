# Start-force

Stat-force is an India-focused innovation intelligence and collaboration platform.

It is designed to help people discover ideas, understand their evidence and momentum, find collaborators/resources, communicate securely, and eventually connect promising opportunities with investors.

## Monorepo

- `apps/web` - React + TypeScript frontend (Vercel)
- `apps/api` - Node.js + Express + TypeScript + GraphQL API (AWS)
- `packages/shared` - shared types/constants
- `packages/database` - PostgreSQL database assets
- `docs` - architecture and product documentation

## Development

Prerequisites: Node.js 20+, pnpm 10+, PostgreSQL 16+.

```bash
pnpm install
pnpm dev
```
