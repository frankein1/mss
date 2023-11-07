import BeneficiaryLeaveForm from '~/components/BeneficiaryLeaveForm/BeneficiaryLeaveForm.vue'
import {
  AppBeneficiariesSaveRoute,
  AppBeneficiaryEditRoute,
  Route,
  RoutePath
} from '~/utils/routing/routes'

const beneficiaryFormRoutes: Array<
  AppBeneficiariesSaveRoute | AppBeneficiaryEditRoute
> = [
  Route.AppBeneficiariesSaveInfo,
  Route.AppBeneficiariesSaveTaxHousehold,
  Route.AppBeneficiariesSaveEntourage,
  Route.AppBeneficiariesSaveHealth,
  Route.AppBeneficiariesSaveOccupation,
  Route.AppBeneficiariesSaveExternalOrganisations,
  Route.AppBeneficiaryEditInfo,
  Route.AppBeneficiaryEditTaxHousehold,
  Route.AppBeneficiaryEditEntourage,
  Route.AppBeneficiaryEditHealth,
  Route.AppBeneficiaryEditOccupation,
  Route.AppBeneficiaryEditExternalOrganisations
]

export function useLeaveBeneficiaryFormConfirmation(
  draftOrBeneficiaryId: string
) {
  const beneficiaryFormRoutePaths = beneficiaryFormRoutes.map(r =>
    RoutePath[r](draftOrBeneficiaryId)
  )

  onBeforeRouteLeave((to, _, next) => {
    if (beneficiaryFormRoutePaths.includes(to.path)) {
      return next()
    }

    useModal().open({
      title: 'Attention les informations seront perdues',
      contentComponent: BeneficiaryLeaveForm,
      contentComponentEvents: {
        cancel: () => next(false),
        leave: () => next()
      },
      triggerOpen: true
    })
  })
}
