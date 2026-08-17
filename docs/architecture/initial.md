# Stat-force — Initial Architecture

## Deployment

- React web app: Vercel
- Node.js/Express/TypeScript API: AWS
- PostgreSQL: AWS RDS
- Private documents: AWS S3
- Redis: introduce when caching/rate limiting demands it

## Architecture choice

Start as a modular monolith. Keep domain boundaries explicit so high-load modules can later become services without forcing premature microservice complexity.

## Product principle

The primary object is an `Idea`, not a post. Ideas have evidence, metrics, stage, people, requirements, discussions and controlled visibility.

## Security principle

Sensitive data is never assumed to be public. Visibility and document permissions are explicit, and security-sensitive actions are auditable.
