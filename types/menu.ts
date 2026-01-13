export interface MenuItem<V = any> {
  label: string
  to?: string
  href?: string
  icon?: string
  onClick?: (item: this) => void
  disabled?: boolean
  title?: string
  value?: V
}
