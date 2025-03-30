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

## Theming Guidelines
- **Theme Provider**: Use Next-Themes with `ThemeProvider` in `src/app/Providers.tsx` 
- **Color Variables**: Use Tailwind's semantic color variables:
  - `text-foreground` / `text-muted-foreground` for text
  - `bg-background` / `bg-card` for backgrounds
  - `border-input` / `border-border` for borders
  - `ring-ring` for focus states
- **Dark Mode Classes**: Use `dark:` variant classes for dark mode styling
- **Component Backgrounds**: Use these classes for proper theme support:
  - Card backgrounds: `bg-card`
  - Muted backgrounds: `bg-muted/30` 
  - Input backgrounds: `bg-background`
- **Forms & Inputs**: Always include these classes for theme compatibility:
  ```
  border-input bg-background focus:ring-2 focus:ring-ring focus:border-input
  ```
- **Image Containers**: Use `bg-muted/30 dark:bg-gray-800/30` to ensure proper contrast
- **Hydration**: Add `suppressHydrationWarning` to the HTML element to prevent theme flicker