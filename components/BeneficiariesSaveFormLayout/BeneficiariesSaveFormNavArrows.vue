<template>
  <BeneficiaryFormNavArrows
    :previous-page="previousPage"
    :next-page="nextPage"
    @save="emit('save', $event)"
  />
</template>

<script setup lang="ts">
  import { BeneficiaryPermissions } from '~/server/security'
  import {
    AppBeneficiariesSaveRoute,
    Route,
    RoutePath,
    RouteTitle
  } from '~/utils/routing'

  const props = defineProps<{
    currentRoute: AppBeneficiariesSaveRoute
    permissions?: BeneficiaryPermissions
    draftId: string
  }>()

  const emit = defineEmits<{
    save: [target: string]
  }>()

  const navArrows = computed(() =>
    getBeneficiariesSaveRouteNavArrows(props.currentRoute)
  )

  const previousPage = computed(() => getPage(navArrows.value.previous))

  const nextPage = computed(() => getPage(navArrows.value.next))

  function getPage(route: AppBeneficiariesSaveRoute | undefined) {
    if (!route) {
      return undefined
    }

    return {
      title: RouteTitle[route](),
      path: RoutePath[route](props.draftId)
    }
  }

  const beneficiariesSaveRouteAccessPermissions = {
    [Route.AppBeneficiariesSaveInfo]: props.permissions?.edit.general,
    [Route.AppBeneficiariesSaveTaxHousehold]: props.permissions?.edit.relatives,
    [Route.AppBeneficiariesSaveEntourage]: props.permissions?.edit.relatives,
    [Route.AppBeneficiariesSaveHealth]: props.permissions?.edit.health,
    [Route.AppBeneficiariesSaveOccupation]:
      props.permissions?.edit.occupationIncome,
    [Route.AppBeneficiariesSaveExternalOrganisations]:
      props.permissions?.edit.externalOrganisations
  }

  const beneficiarySaveRouteTree: {
    [k in AppBeneficiariesSaveRoute]: {
      previous?: AppBeneficiariesSaveRoute
      next?: AppBeneficiariesSaveRoute
    }
  } = {
    [Route.AppBeneficiariesSaveInfo]: {
      previous: undefined,
      next: Route.AppBeneficiariesSaveTaxHousehold
    },
    [Route.AppBeneficiariesSaveTaxHousehold]: {
      previous: Route.AppBeneficiariesSaveInfo,
      next: Route.AppBeneficiariesSaveEntourage
    },
    [Route.AppBeneficiariesSaveEntourage]: {
      previous: Route.AppBeneficiariesSaveTaxHousehold,
      next: Route.AppBeneficiariesSaveHealth
    },
    [Route.AppBeneficiariesSaveHealth]: {
      previous: Route.AppBeneficiariesSaveEntourage,
      next: Route.AppBeneficiariesSaveOccupation
    },
    [Route.AppBeneficiariesSaveOccupation]: {
      previous: Route.AppBeneficiariesSaveHealth,
      next: Route.AppBeneficiariesSaveExternalOrganisations
    },
    [Route.AppBeneficiariesSaveExternalOrganisations]: {
      previous: Route.AppBeneficiariesSaveOccupation,
      next: undefined
    }
  }

  function getBeneficiariesSaveRoutePrevious(
    route: AppBeneficiariesSaveRoute
  ): undefined | AppBeneficiariesSaveRoute {
    const { previous } = beneficiarySaveRouteTree[route]

    if (!previous) {
      return undefined
    }

    const accessRule = beneficiariesSaveRouteAccessPermissions[previous]

    if (accessRule) {
      return previous
    }

    return getBeneficiariesSaveRoutePrevious(previous)
  }

  function getBeneficiariesSaveRouteNext(
    route: AppBeneficiariesSaveRoute
  ): undefined | AppBeneficiariesSaveRoute {
    const { next } = beneficiarySaveRouteTree[route]

    if (!next) {
      return undefined
    }

    const accessRule = beneficiariesSaveRouteAccessPermissions[next]

    if (accessRule) {
      return next
    }

    return getBeneficiariesSaveRouteNext(next)
  }

  function getBeneficiariesSaveRouteNavArrows(
    route: AppBeneficiariesSaveRoute
  ): {
    previous: AppBeneficiariesSaveRoute | undefined
    next: AppBeneficiariesSaveRoute | undefined
  } {
    return {
      previous: getBeneficiariesSaveRoutePrevious(route),
      next: getBeneficiariesSaveRouteNext(route)
    }
  }
</script>
