export interface Item {
  id: string
  value: unknown
  disabled?: boolean
}

export const comboBoxInjectionKey: InjectionKey<{
  handleSelect: (value: unknown) => void
  registerItem: (item: Item) => void
  unregisterItem: (item: Item) => void
  focusedItem: Item
}> = Symbol('comboBox')
