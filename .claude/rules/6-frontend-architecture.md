---
paths:
  - components/**
  - pages/**
  - composables/**
  - layouts/**
  - plugins/**
---

## Frontend Architecture

### State management

- State related data retrieved from DB (no store Vuex/Pinia)
- Nuxt auto-import of composables used for:
  - global state management (authentication, permission,...)
  - utils
  - singleton component interaction (snackbar, modal)
  - extensions (matomo,...)
  - wrapping of reused backend queries (only when necessary, useBeneficiaryDetails, useFamilyFileMinimalInfo)

### DSFR Components

Components are organized in folders related to domain e.g.:

- BeneficiaryAddForm
- FamilyFileBudget
- HelpRequestForm
- StatBeneficiaries
- Workshop

Prefer vue-dsfr rather than direct DSFR html when possible:

- Complete list of components : https://raw.githubusercontent.com/dnum-mi/vue-dsfr/refs/heads/main/src/components/index.ts
- Example of component docs: https://raw.githubusercontent.com/dnum-mi/vue-dsfr/refs/heads/main/src/components/DsfrButton/DsfrButtonGroup.md

#### Atomic Design

- Base components with Atom\* prefix
- Vee Validate Components with Vee\* prefix

### Type safety

- End-to-end: Prisma schema → tRPC router → Frontend types
- Automatic type generation from tRPC endpoints
- Zod runtime validation at API boundaries

### Routing

- File-based routing via Nuxt pages directory
- Type-safe route helpers in utilities
- CGU acceptance enforcement via middleware
