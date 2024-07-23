type CGURouteOptions = {
  readonly: boolean
}

const getCGURoute = (route: string, options?: CGURouteOptions) => {
  if (options?.readonly) {
    const params = new URLSearchParams()
    params.append('readonly', 'true')

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
