# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Code Style Guidelines
- **Imports**: Prefer absolute imports using '@/*' paths
- **Components**: Use functional components with hooks
- **Types**: TypeScript is used but with loose typing (strictNullChecks: false)
- **Error Handling**: Implement proper error handling in async operations
- **Naming**: 
  - Components: PascalCase
  - Hooks: camelCase with 'use' prefix
  - Utils: camelCase
- **File Structure**:
  - Hooks in src/hooks/
  - Components in src/components/
  - Pages in src/pages/
  - Utils in src/utils/
- **State Management**: React Query for server state, Context API for app state
- **UI Components**: Use shadcn/ui components based on Radix UI
- **Form Handling**: React Hook Form with Zod for validation