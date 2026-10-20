---
paths:
  - app/**/*.spec.ts
  - test/components/**
---

# Testing: Frontend

## Mocking Nuxt imports (`mockNuxtImport`, `vi.mock`)

Vitest runs with `isolate: false`: nothing is reset between spec files. They
share one module cache and one mock registry, and the Nuxt test app (with its
non-stripped plugins) boots in whichever file runs first.

- A mock only reaches a module that is evaluated _after_ the mock is registered.
  Any module already evaluated by an earlier spec file keeps the imports it got
  then, and a test passes alone but fails in the full suite.
- Mocks are not reset between files either: a `vi.mock` registered by an earlier
  file can still apply to modules first loaded by a later file.
- Before mocking, look for boot-time importers of the module that calls the
  mocked composable. Grep only finds direct imports: follow each importer up
  until you reach a plugin or nothing, and rely on the repro below as the real check.

  ```sh
  grep -rln "header-allowlist" app/plugins app/composables app/utils
  # → app/plugins/trpcClient.ts: loaded at app boot, not stripped → unsafe to mock per file
  ```

### Mocking a composable used at app boot

Applies when a plugin imports it, directly or not (e.g. `trpcClient.ts` → `header-allowlist` → `useRequestHeaders`). Plugins listed in `strip-plugins.module.ts` don't count.

- Mock it once in `test/components/setup.ts`. A state module drives it (see `fake-request.ts`).
- In the spec, reset the state in `beforeEach` and override it per test.
- Never mock it in the spec file.

```ts
beforeEach(() => resetFakeRequest())

it('forwards x-real-ip during SSR', async () => {
  fakeRequest.headers = { 'x-real-ip': '192.0.2.1' }
})
```

## Global Nuxt state

The Nuxt app is shared too: `useState` values written by a spec leak into every
later spec file. Reset them in `afterEach`. Known writers:

- `useAuthState()`: reset with `useAuthState().user.value = undefined`
- `usePermissions()`: reset with `usePermissions().reset()`
- `setPermissions()` from `test/components/fake-permissions.ts`: reset with `resetPermissions()`

```ts
// app/composables/useAuth.spec.ts — getSession() stores the user and permissions
afterEach(() => {
  // A leftover user without an active status makes app/middleware/auth.ts
  // throw "deactivated user" in later page specs
  useAuthState().user.value = undefined
  usePermissions().reset()
})
```
