export type Menu = {
  label: string
  to?: string

  /**
   * For server API routes, use `href` instead of `to` to prevent the navigation to be handled by the Nuxt router
   */
  href?: string
  icon: string
  callback?: () => void
}
