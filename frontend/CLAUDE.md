# HackWknd Frontend Development Guidelines

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:check` - Type check and build
- `npm run start` - Run production server
- `npm run lint` - Run linting with auto-fix

## Code Style Guidelines
- **TypeScript**: Use strict typing. Define explicit interfaces for props and state.
- **Imports**: Use absolute imports with `@/` prefix (e.g., `import { cn } from "@/lib/utils"`)
- **Components**: Use functional components with React.forwardRef when needed
- **Naming**: PascalCase for components, camelCase for functions/variables
- **UI Components**: Use shadcn/ui pattern with class-variance-authority (cva) for variants
- **CSS**: Use Tailwind with the `cn` utility for className merging
- **Error Handling**: Use try/catch blocks for async operations
- **State Management**: Use React hooks and context (SupabaseAuthContext)
- **API Calls**: Implement in `/src/lib/supabase/api.ts` or app/api routes

## Structure
Follow Next.js App Router conventions with pages in `/src/app` and reusable components in `/src/components`