## Frontend Architecture

**State Management**:

- Composable-based approach (no Vuex/Pinia)
- Nuxt auto-import of composables

**Component Organization**:

- **Atomic Design**: Base components with Atom\* prefix
- **Feature Modules**: Domain-specific component families
- **DSFR Components**: Government design system for UI consistency

**Type Safety**:

- End-to-end: Prisma schema → tRPC router → Frontend types
- Automatic type generation from tRPC endpoints
- Zod runtime validation at API boundaries

**Routing**:

- File-based routing via Nuxt pages directory
- Type-safe route helpers in utilities
- CGU acceptance enforcement via middleware
