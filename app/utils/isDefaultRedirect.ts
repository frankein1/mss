/** Utils to empty redirectUrl when it matches the default redirection path after login*/
import { routes } from '~/utils/routes'

const defaultRedirects = new Set([
  '/',
  routes.user.AppOverview.path(),
  routes.admin.AdminOverview.path()
])

export function isDefaultRedirect(url: string): boolean {
  return defaultRedirects.has(url)
}
