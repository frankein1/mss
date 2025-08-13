import type { ShallowRef, Ref } from 'vue'

export interface Item {
  id: string
  value: unknown
  disabled?: boolean
  elementRef: Readonly<ShallowRef<HTMLLIElement | null>>
}

export const comboBoxInjectionKey: InjectionKey<{
  handleSelect: (value: unknown) => void
  registerItem: (item: Item) => void
  unregisterItem: (item: Item) => void
  focusedItem: Ref<Item | null>
}> = Symbol('comboBox')
