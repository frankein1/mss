<template>
  <BeneficiaryFormNavigation
    :current-route="currentRoute"
    :menus="menus"
    :beneficiary-form-layout-main-container="beneficiaryFormLayoutMainContainer"
    @save="emit('save', $event)"
  />
</template>

<script setup lang="ts">
  import { BeneficiaryRules } from '~/server/security'
  import { useAuthStore } from '~/store/auth'
  import { RoutePath, Route, AppBeneficiariesSaveRoute } from '~/utils/routing'

  const authStore = useAuthStore()

  const props = defineProps<{
    currentRoute: AppBeneficiariesSaveRoute
    draftId: string
    beneficiaryFormLayoutMainContainer: HTMLElement | null
  }>()

  const emit = defineEmits<{
    save: [target: string]
  }>()

  const user = computed(() => authStore.getAuthUser)

  const securityTarget = computed(() => ({
    referents: [user.value.id],
    structureId: user.value.structureId
  }))

  const canEditBeneficiaryRelatives = computed(() => {
    return BeneficiaryRules.update.relatives(user.value, securityTarget.value)
  })

  const canEditBeneficiaryHealthInfo = computed(() => {
    return BeneficiaryRules.update.healthInfo(user.value, securityTarget.value)
  })

  const canEditBeneficiaryOccupationIncome = computed(() => {
    return BeneficiaryRules.update.occupationIncome(
      user.value,
      securityTarget.value
    )
  })

  const canEditBeneficiaryExternalOrganisations = computed(() => {
    return BeneficiaryRules.update.externalOrganisations(
      user.value,
      securityTarget.value
    )
  })

  const navigationRoutes = computed<AppBeneficiariesSaveRoute[]>(() => {
    const saveRoutes: AppBeneficiariesSaveRoute[] = [
      Route.AppBeneficiariesSaveInfo
    ]

    if (canEditBeneficiaryRelatives.value) {
      saveRoutes.push(
        Route.AppBeneficiariesSaveTaxHousehold,
        Route.AppBeneficiariesSaveEntourage
      )
    }

    if (canEditBeneficiaryHealthInfo.value) {
      saveRoutes.push(Route.AppBeneficiariesSaveHealth)
    }

    if (canEditBeneficiaryOccupationIncome.value) {
      saveRoutes.push(Route.AppBeneficiariesSaveOccupation)
    }

    if (canEditBeneficiaryExternalOrganisations.value) {
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
