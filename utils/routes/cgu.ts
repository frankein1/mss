type CGURouteOptions = {
  /** Display CGU without accepting form */
  readonly?: boolean
  /** If the user has previously accepted a version of the CGU,
   * show a summary with the changes with respect to the previous version */
  showSummary?: boolean
}

const getCGURoute = (route: string, options?: CGURouteOptions) => {
  const hasParams = Object.keys(options || {}).length > 0
  if (hasParams) {
    const params = new URLSearchParams()
    if (options?.readonly) {
      params.append('readonly', 'true')
    }
    if (options?.showSummary) {
      params.append('showSummary', 'true')
    }

    return `${route}?${params}`
  }

  return route
}

export const routes = {
  CGUManager: {
    name: 'CGUManager',
    title: "Conditions générales d'utilisation",
    path: (options?: CGURouteOptions) => getCGURoute(`/cgu/manager`, options)
  },
  CGUUser: {
    name: 'CGUUser',
    title: "Conditions générales d'utilisation",
    path: (options?: CGURouteOptions) => getCGURoute(`/cgu/user`, options)
  }
} as const
