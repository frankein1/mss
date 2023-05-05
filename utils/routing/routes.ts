const AppRoute = '/app'
const ApiKeycloak = '/api/keycloak'

const BeneficiariesRoute = `${AppRoute}/beneficiaries`

export const Routes = {
  Index: '/',
  Register: '/register',
  DeclarationAccessibilite: `/declaration-accessibilite`,
  MentionsLegales: `/mentions-legales`,

  Login: '/login',
  Logout: `${ApiKeycloak}/logout`,
  SsoCallback: `${ApiKeycloak}/callback`,

  App: `${AppRoute}`,
  Overview: `${AppRoute}/overview`,
  LogoutSuccess: `${AppRoute}/logout-success`,

  Users: `${AppRoute}/users`,

  Stats: `${AppRoute}/stats`,

  Account: `${AppRoute}/account`,

  StructureEdit: `${AppRoute}/structure/edit`,

  // beneficiaries
  Beneficiaries: BeneficiariesRoute,
  BeneficiariesAdd: `${BeneficiariesRoute}/add`
}
