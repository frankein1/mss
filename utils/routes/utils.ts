export const AppRoute = '/app'
export const FilesRoute = '/app/files'
export const BeneficiariesRoute = `${AppRoute}/beneficiaries`

export function getRouteOptions<T extends Record<string, any>>(options?: T) {
  const hasDefinedOptions = options && Object.values(options).every(o => !!o)

  if (!hasDefinedOptions) {
    return ''
  }

  const { tab, ...params } = options
  const tabHash = tab ? `#${tab}` : ''

  return Object.keys(params).length
    ? `?${new URLSearchParams(params)}${tabHash}`
    : tabHash
}
