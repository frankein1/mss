import { inject, provide, ref } from 'vue'
import type { InjectionKey, Ref } from 'vue'
import type { StructureOption } from '~/components/VeeForm/types'
import type { UserRole } from '@prisma/client'

export interface AdminTransferUserState {
  selectedStructure: Ref<StructureOption | null>
  newRole: Ref<UserRole | ''>
}

const adminTransferUserStateKey: InjectionKey<AdminTransferUserState> = Symbol(
  'adminTransferUserState'
)

export function useProvideTransferUserState(): AdminTransferUserState {
  const state: AdminTransferUserState = {
    selectedStructure: ref<StructureOption | null>(null),
    newRole: ref<UserRole | ''>('')
  }
  provide(adminTransferUserStateKey, state)
  return state
}

export function useTransferUserState(): AdminTransferUserState {
  const state = inject(adminTransferUserStateKey)
  if (!state) {
    throw new Error(
      'useTransferUserState must be used within an AdminTransferUser provider'
    )
  }
  return state
}
