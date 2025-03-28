# Hackwknd Project Guidelines

## Commands
- **Frontend**: `npm run dev` (development), `npm run build` (production), `npm run start` (serve), `npm run lint`
- **Backend**: `npm run dev` (development), `npm run build` (production), `npm run start` (serve), `npm run strapi` (CLI)

## Code Style
- **TypeScript**: Use strict typing in frontend, CommonJS modules in backend
- **Naming**: camelCase for variables/functions, PascalCase for types/interfaces/components
- **Imports**: Group by type (React/Next.js, Strapi, npm packages, local imports)
- **Formatting**: Follow ESLint rules, one component per file
- **Components**: Use functional components with explicit type annotations
- **Error Handling**: Use try/catch for async operations, provide user-friendly error states
- **API Calls**: Include fallback mechanisms, proper error logging, status code checks
- **State Management**: Use React hooks for local state, implement loading/error states