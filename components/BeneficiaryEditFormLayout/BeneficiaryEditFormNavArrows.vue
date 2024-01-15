<template>
  <BeneficiaryFormNavArrows
    :previous-page="previousPage"
    :next-page="nextPage"
    @save="emit('save', $event)"
  />
</template>

<script setup lang="ts">
  import { BeneficiaryPermissions } from '~/server/security'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import {
    AppBeneficiaryEditRoute,
    Route,
    RoutePath,
    RouteTitle
  } from '~/utils/routing'

  const props = defineProps<{
    currentRoute: AppBeneficiaryEditRoute
    permissions: BeneficiaryPermissions | undefined
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
    [Route.AppBeneficiaryEditInfo]: props.permissions?.edit.general,
    [Route.AppBeneficiaryEditTaxHousehold]: props.permissions?.edit.relatives,
    [Route.AppBeneficiaryEditEntourage]: props.permissions?.edit.relatives,
    [Route.AppBeneficiaryEditHealth]: props.permissions?.edit.health,
    [Route.AppBeneficiaryEditOccupation]:
      props.permissions?.edit.occupationIncome,
    [Route.AppBeneficiaryEditExternalOrganisations]:
      props.permissions?.edit.externalOrganisations
  }

  const beneficiaryEditRouteTree: {
    [k in AppBeneficiaryEditRoute]: {
      previous?: AppBeneficiaryEditRoute
      next?: AppBeneficiaryEditRoute
    }
  } = {
    [Route.AppBeneficiaryEditInfo]: {
      previous: undefined,
      next: Route.AppBeneficiaryEditTaxHousehold
    },
    [Route.AppBeneficiaryEditTaxHousehold]: {
      previous: Route.AppBeneficiaryEditInfo,
      next: Route.AppBeneficiaryEditEntourage
    },
    [Route.AppBeneficiaryEditEntourage]: {
      previous: Route.AppBeneficiaryEditTaxHousehold,
      next: Route.AppBeneficiaryEditHealth
    },
    [Route.AppBeneficiaryEditHealth]: {
      previous: Route.AppBeneficiaryEditEntourage,
      next: Route.AppBeneficiaryEditOccupation
    },
    [Route.AppBeneficiaryEditOccupation]: {
      previous: Route.AppBeneficiaryEditHealth,
      next: Route.AppBeneficiaryEditExternalOrganisations
    },
    [Route.AppBeneficiaryEditExternalOrganisations]: {
      previous: Route.AppBeneficiaryEditOccupation,
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
