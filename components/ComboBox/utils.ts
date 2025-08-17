import type { Ref } from 'vue'

export interface Item {
  id: string
  value: unknown
  disabled?: boolean
  elementRef: HTMLLIElement | null
}

export const comboBoxInjectionKey: InjectionKey<{
  handleSelect: (value: unknown) => void
  registerItem: (item: Item) => void
  unregisterItem: (item: Item) => void
  focusedItemId: Ref<string | null>
}> = Symbol('comboBox')
