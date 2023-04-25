const AppRoute = '/app'
const ApiKeycloak = '/api/keycloak'

export const Routes = {
  Index: '/',
  Register: '/register',
  DeclarationAccessibilite: `/declaration-accessibilite`,
  MentionsLegales: `/mentions-legales`,

  Login: '/login',
  Logout: `${ApiKeycloak}/logout`,
  SsoCallback: `${ApiKeycloak}/callback`,

  App: `${AppRoute}`,
  LoginSuccess: `${AppRoute}/success`,
  LogoutSuccess: `${AppRoute}/logout-success`,

  Stats: `${AppRoute}/stats`
}
