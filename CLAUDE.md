# AGENTS.md for project Mon Suivi Social

**Mon Suivi Social** is a CRM for social work case management designed to help public sector organizations (CCAS, CIAS, communes, associations, ministries) manage beneficiary cases and social support workflows.

1. [Purpose, Features and Target Users](.claude/docs/1-purpose-features.md)
1. [Tech stack Summary](.claude/docs/2-tech-stack-summary.md)
1. [Authentication & Security](.claude/docs/3-authentication.md)
1. [Data Model](.claude/docs/4-data-model.md)
1. [Backend Architecture](.claude/docs/5-backend-architecture.md)
1. [Frontend Architecture](.claude/docs/6-frontend-architecture.md)
1. [External Integrations](.claude/docs/7-external-integrations.md)

---

## Project Structure Guide

### Directory Organization

```
├── /components/             Vue 3 components (354 files)
│   ├── Atom*               Base atomic UI components
│   ├── Beneficiary*        Beneficiary-related forms
│   ├── Admin*              Administrative interfaces
│   └── [Domain modules]    Feature-specific components
├── /composables/            Reusable Vue Composition API logic
├── /pages/                  Nuxt file-based routing
│   ├── /admin              Administrative pages
│   ├── /app                Core application pages
│   ├── /auth               Authentication pages
│   └── /cgu                Terms & conditions pages
├── /server/                 Backend code
│   ├── /api                REST endpoints (only for OAuth flows, document uploads, external integrations)
│   ├── /trpc               tRPC API infrastructure
│   ├── /database           Prisma ORM and repositories, constraints
│   ├── /lib                Utilities (jwt, oauth, s3 file management)
│   ├── /services           Domain business logic
│   ├── /integrations       External API integrations
│   ├── /email              Email templates
│   ├── /scheduler          Legacy Scheduled jobs
│   ├── /schema             Zod validation
│   ├── /plugins            Nuxt server plugins
│   └── /query              Specific queries for statistics
├── /utils/                  Client-side utilities
├── /types/                  Shared TypeScript types
├── /middleware/             Nuxt router SSR middleware (auth, cgu)
├── /plugins/                Nuxt client plugins
├── /layouts/                Nuxt layout components
├── /assets/                 Styles (SCSS), icons
├── /public/                 Static assets
├── /e2e/                    Playwright E2E tests
├── /test/                   Test utils, test trpc setup and fixtures for integration tests
├── /prisma/                 Database schema & migrations
├── nuxt.config.ts           Nuxt configuration
├── package.json             Dependencies
└── docker-compose.dev.yml   PostgreSQL, RustFS, Open Bao local setup
```

---

## Development Guidelines

### Testing

**Unit/integration Tests** (Vitest):

- Favor integration testing for API endpoints over mocking (setup by `test/server/test-utils.ts`)
- Co-locate with source files (.spec.ts)
- Aim for greater than 80% coverage on critical paths with a focus on roles and permissions

**End-to-End Tests** (Playwright):

- User flow testing in /e2e/
- Realistic interaction scenarios

**Common Commands**:

- Run all tests via `pnpm test`
- Run E2E tests via `pnpm test:e2e`
- Watch mode for development
- Generate coverage reports

### Development Workflow

**Local Setup and Development Commands**: [see README.md](./README.md)

**Code Review Focus**:

- Type safety: No any, proper generics
- Security: Access control at all layers, input validation
- Performance: Avoid large joins, large data fetches (rather paginate), make use of `relationLoadStrategy: "query"` if necessary
- Testing: Critical paths covered
- Accessibility: semantic HTML, DSFR components used correctly
