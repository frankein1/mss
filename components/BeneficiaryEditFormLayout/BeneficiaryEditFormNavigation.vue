<template>
  <BeneficiaryFormNavigation
    :current-route="currentRoute"
    :menus="menus"
    :beneficiary-form-layout-main-container="beneficiaryFormLayoutMainContainer"
    @save="emit('save', $event)"
  />
</template>

<script setup lang="ts">
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { RoutePath, Route, AppBeneficiaryEditRoute } from '~/utils/routing'
  import { BeneficiaryPermissions } from '~/server/security'

  const props = defineProps<{
    currentRoute: AppBeneficiaryEditRoute
    originTab: BeneficiaryTab | undefined
    beneficiaryId: string
    permissions: BeneficiaryPermissions | undefined
    beneficiaryFormLayoutMainContainer: HTMLElement | null
  }>()

  const emit = defineEmits<{
    save: [target: string]
  }>()

  const navigationRoutes = computed<AppBeneficiaryEditRoute[]>(() => {
    const editRoutes: AppBeneficiaryEditRoute[] = [Route.AppBeneficiaryEditInfo]

    if (props.permissions?.edit.relatives) {
      editRoutes.push(
        Route.AppBeneficiaryEditTaxHousehold,
        Route.AppBeneficiaryEditEntourage
      )
    }

    if (props.permissions?.edit.health) {
      editRoutes.push(Route.AppBeneficiaryEditHealth)
    }

    if (props.permissions?.edit.occupationIncome) {
      editRoutes.push(Route.AppBeneficiaryEditOccupation)
    }

    if (props.permissions?.edit.externalOrganisations) {
      editRoutes.push(Route.AppBeneficiaryEditExternalOrganisations)
    }

    return editRoutes
  })

  const menus = computed(() => {
    return navigationRoutes.value.map(route => {
      const path = RoutePath[route](props.beneficiaryId, {
        saved: route !== props.currentRoute,
        originTab: props.originTab
      })

      const menu = {
        route: route as AppBeneficiaryEditRoute,
        path
      }

      if (route === Route.AppBeneficiaryEditInfo) {
        return {
          ...menu,
          targets: [
            { hash: 'identity', title: 'Identité du bénéficiaire' },
            { hash: 'contact-details', title: 'Coordonées' },
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
