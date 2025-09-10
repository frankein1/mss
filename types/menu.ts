export type Menu = {
  label: string
  to?: string
  href?: string
  icon?: string
  callback?: () => void
  disabled?: boolean
  title?: string
}
