import merge from 'lodash.merge'
import type { AppContextPermissions } from '~~/server/security'
import {
  defaultPermissions,
  usePermissions
} from '~/composables/usePermissions'

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

/** Writes the global usePermissions() state, shared by the Nuxt app across
 * spec files: call resetPermissions() in afterEach
 */
export function setPermissions(overrides: DeepPartial<AppContextPermissions>) {
  usePermissions().application.value = merge(defaultPermissions(), overrides)
}

export function resetPermissions() {
  usePermissions().reset()
}
