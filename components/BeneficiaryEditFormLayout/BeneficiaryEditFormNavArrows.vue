<template>
  <BeneficiaryFormNavArrows
    :previous-page="previousPage"
    :next-page="nextPage"
    @save="emit('save', $event)"
  />
</template>

<script setup lang="ts">
  import { FamilyFilePermissions } from '~/server/security'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { RoutePath, RouteTitle } from '~/utils/routing'
  import { routes, AppBeneficiaryEditRoute } from '~/routes'

  const props = defineProps<{
    currentRoute: AppBeneficiaryEditRoute
    permissions: FamilyFilePermissions | undefined
    beneficiaryId: string
    originTab: BeneficiaryTab | undefined
  }>()

  const emit = defineEmits<{
    save: [target: string]
  }>()

  const navArrows = computed(() =>
    getBeneficiaryEditRouteNavArrows(props.currentRoute)
  )

  const previousPage = computed(() => getPage(navArrows.value.previous))

  const nextPage = computed(() => getPage(navArrows.value.next))

  const r = routes.beneficiary

  function getPage(route: AppBeneficiaryEditRoute | undefined) {
    if (!route) {
      return undefined
    }

    return {
      title: RouteTitle[route](),
      path: RoutePath[route](props.beneficiaryId, {
        saved: true,
        originTab: props.originTab
      })
    }
  }

  const beneficiaryEditRouteAccessPermissions = {
    [r.AppBeneficiaryEditInfo.name]: props.permissions?.edit.general,
    [r.AppBeneficiaryEditTaxHousehold.name]: props.permissions?.edit.relatives,
    [r.AppBeneficiaryEditEntourage.name]: props.permissions?.edit.relatives,
    [r.AppBeneficiaryEditHealth.name]: props.permissions?.edit.health,
    [r.AppBeneficiaryEditOccupation.name]:
      props.permissions?.edit.occupationIncome,
    [r.AppBeneficiaryEditExternalOrganisations.name]:
      props.permissions?.edit.externalOrganisations
  }

  const beneficiaryEditRouteTree: {
    [k in AppBeneficiaryEditRoute]: {
      previous?: AppBeneficiaryEditRoute
      next?: AppBeneficiaryEditRoute
    }
  } = {
    [r.AppBeneficiaryEditInfo.name]: {
      previous: undefined,
      next: r.AppBeneficiaryEditTaxHousehold.name
    },
    [r.AppBeneficiaryEditTaxHousehold.name]: {
      previous: r.AppBeneficiaryEditInfo.name,
      next: r.AppBeneficiaryEditEntourage.name
    },
    [r.AppBeneficiaryEditEntourage.name]: {
      previous: r.AppBeneficiaryEditTaxHousehold.name,
      next: r.AppBeneficiaryEditHealth.name
    },
    [r.AppBeneficiaryEditHealth.name]: {
      previous: r.AppBeneficiaryEditEntourage.name,
      next: r.AppBeneficiaryEditOccupation.name
    },
    [r.AppBeneficiaryEditOccupation.name]: {
      previous: r.AppBeneficiaryEditHealth.name,
      next: r.AppBeneficiaryEditExternalOrganisations.name
    },
    [r.AppBeneficiaryEditExternalOrganisations.name]: {
      previous: r.AppBeneficiaryEditOccupation.name,
      next: undefined
    }
  }

  function getBeneficiaryEditRoutePrevious(
    route: AppBeneficiaryEditRoute
  ): undefined | AppBeneficiaryEditRoute {
    const { previous } = beneficiaryEditRouteTree[route]

    if (!previous) {
      return undefined
    }

    const accessRule = beneficiaryEditRouteAccessPermissions[previous]

    if (accessRule) {
      return previous
    }

    return getBeneficiaryEditRoutePrevious(previous)
  }

  function getBeneficiaryEditRouteNext(
    route: AppBeneficiaryEditRoute
  ): undefined | AppBeneficiaryEditRoute {
    const { next } = beneficiaryEditRouteTree[route]

    if (!next) {
      return undefined
    }

    const accessRule = beneficiaryEditRouteAccessPermissions[next]

    if (accessRule) {
      return next
    }

    return getBeneficiaryEditRouteNext(next)
  }

  function getBeneficiaryEditRouteNavArrows(route: AppBeneficiaryEditRoute): {
    previous: AppBeneficiaryEditRoute | undefined
    next: AppBeneficiaryEditRoute | undefined
  } {
    return {
      previous: getBeneficiaryEditRoutePrevious(route),
      next: getBeneficiaryEditRouteNext(route)
    }
  }
</script>
