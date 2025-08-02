# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This project uses Turborepo with pnpm workspaces for monorepo management.

### Setup
```bash
pnpm install
```

### Development
```bash
pnpm dev           # Start all applications in development mode
pnpm notes         # Start only the documentation site (Docusaurus)
```

### Building and Testing
```bash
pnpm build         # Build all applications
pnpm test          # Run unit tests across all workspaces
pnpm test:e2e      # Run end-to-end tests
```

### Code Quality
```bash
pnpm lint          # Run Biome linter on all workspaces
pnpm lint:fix      # Auto-fix linting issues
pnpm lint:write    # Apply Biome formatter and auto-fixes
```

Note: Git hooks are configured with lefthook to automatically run `pnpm lint` before pushing.

### Individual App Commands
Run commands in specific workspaces:
```bash
# API (NestJS)
pnpm --filter api dev          # Start API in watch mode
pnpm --filter api test         # Run API tests
pnpm --filter api start:prod   # Start production build

# Documentation
pnpm --filter notes notes      # Start Docusaurus dev server
pnpm --filter notes notes:build  # Build static documentation
```

## Architecture

### Monorepo Structure
- **apps/api/**: NestJS backend application (port 5000)
- **apps/notes/**: Docusaurus documentation site
- **apps/web/**: Next.js frontend (referenced but not yet implemented)
- **packages/**: Shared libraries and configurations (directory exists but packages not yet created)

### Technology Stack
- **Package Manager**: pnpm with workspace support
- **Build System**: Turborepo for task orchestration and caching
- **Backend**: NestJS with TypeScript
- **Documentation**: Docusaurus v3 with React 19
- **Code Quality**: Biome for linting and formatting
- **Git Hooks**: lefthook for pre-push linting
- **Node Version**: >=24 (API), >=18 (Documentation)

### API Application Details
- Entry point: `apps/api/src/main.ts` (port 5000)
- Uses TypeScript with native preview for enhanced performance
- Includes Jest for testing with e2e configuration
- Development uses NestJS CLI with watch mode

### Documentation Structure
The notes app contains development roadmaps and knowledge base:
- **docs/roadmap/**: Development planning and environment setup guides
- **docs/knowledge/**: Setup guides for tools and troubleshooting
- **docs/tutorial-basics/**: Docusaurus default tutorial content

### Configuration Files
- **biome.jsonc**: Linting and formatting configuration (single quotes, space indentation)
- **turbo.json**: Build system task definitions and caching rules
- **lefthook.yml**: Git hook configuration for pre-push linting
- **pnpm-workspace.yaml**: Workspace configuration for apps/* and packages/*

## Important Notes

- All TypeScript configurations inherit from workspace-level tsconfig.json
- Biome is used instead of ESLint/Prettier for code quality
- Remote caching with Vercel is available but not configured
- The project appears to be in early development stage with some referenced components not yet implemented