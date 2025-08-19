import type { InputHTMLAttributes, Ref } from 'vue'

export interface Item {
  id: string
  label?: string
  value: unknown
  disabled?: boolean
  elementRef: HTMLLIElement | null
}

export const comboBoxItemInjectionKey: InjectionKey<{
  handleSelect: (item: Item) => void
  registerItem: (item: Item) => void
  unregisterItem: (item: Item) => void
  focusedItemId: Ref<string | null>
}> = Symbol('comboBoxItem')

export const comboBoxInputInjectionKey: InjectionKey<
  InputHTMLAttributes & { setRef: (element: HTMLInputElement | null) => void }
> = Symbol('comboBoxInputItem')
