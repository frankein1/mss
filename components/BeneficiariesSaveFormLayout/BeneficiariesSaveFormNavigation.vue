<template>
  <BeneficiaryFormNavigation
    :current-route="currentRoute"
    :menus="menus"
    :beneficiary-form-layout-main-container="beneficiaryFormLayoutMainContainer"
    @save="emit('save', $event)"
  />
</template>

<script setup lang="ts">
  import { BeneficiaryPermissions } from '~/server/security'
  import { RoutePath, Route, AppBeneficiariesSaveRoute } from '~/utils/routing'

  const props = defineProps<{
    currentRoute: AppBeneficiariesSaveRoute
    draftId: string
    permissions?: BeneficiaryPermissions
    beneficiaryFormLayoutMainContainer: HTMLElement | null
  }>()

  const emit = defineEmits<{
    save: [target: string]
  }>()

  const navigationRoutes = computed<AppBeneficiariesSaveRoute[]>(() => {
    const { permissions } = props
    const saveRoutes: AppBeneficiariesSaveRoute[] = [
      Route.AppBeneficiariesSaveInfo
    ]

    if (permissions?.edit.relatives) {
      saveRoutes.push(
        Route.AppBeneficiariesSaveTaxHousehold,
        Route.AppBeneficiariesSaveEntourage
      )
    }

    if (permissions?.edit.health) {
      saveRoutes.push(Route.AppBeneficiariesSaveHealth)
    }

    if (permissions?.edit.occupationIncome) {
      saveRoutes.push(Route.AppBeneficiariesSaveOccupation)
    }

    if (permissions?.edit.externalOrganisations) {
      saveRoutes.push(Route.AppBeneficiariesSaveExternalOrganisations)
    }

    return saveRoutes
  })

  const menus = computed(() => {
    return navigationRoutes.value.map(route => {
      const path = RoutePath[route](props.draftId)

      const menu = {
        route: route as AppBeneficiariesSaveRoute,
        path
      }

      if (route === Route.AppBeneficiariesSaveInfo) {
        return {
          ...menu,
          targets: [
            { hash: 'identity', title: 'Identité du bénéficiaire' },
            { hash: 'contact-details', title: 'Coordonnées' },
            { hash: 'address', title: 'Adresse/Hébergement' },
            { hash: 'mobility', title: 'Mobilité' },
            {
              hash: 'additional-information',
              title: 'Informations complémentaires'
            }
          ]
        }
      }

      return { ...menu, targets: undefined }
    })
  })
</script>
