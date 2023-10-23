<template>
  <BeneficiaryFormNavigation
    :current-route="currentRoute"
    :menus="menus"
    :beneficiary-form-layout-main-container="beneficiaryFormLayoutMainContainer"
    @save="emit('save', $event)"
  />
</template>

<script setup lang="ts">
  import { useAuthStore } from '~/store/auth'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { RoutePath, Route, AppBeneficiaryEditRoute } from '~/utils/routing'
  import {
    BeneficiaryRules,
    SecurityTargetWithReferents,
    SecurityTargetWithStructure
  } from '~/server/security'

  const authStore = useAuthStore()

  const props = defineProps<{
    currentRoute: AppBeneficiaryEditRoute
    beneficiaryId: string
    originTab: BeneficiaryTab | undefined
    securityTarget: SecurityTargetWithReferents & SecurityTargetWithStructure
    beneficiaryFormLayoutMainContainer: HTMLElement | null
  }>()

  const emit = defineEmits<{
    save: [target: string]
  }>()

  const user = computed(() => authStore.getAuthUser)

  const canEditBeneficiaryRelatives = computed(() => {
    return BeneficiaryRules.update.relatives(user.value, props.securityTarget)
  })

  const canEditBeneficiaryHealthInfo = computed(() => {
    return BeneficiaryRules.update.healthInfo(user.value, props.securityTarget)
  })

  const canEditBeneficiaryOccupationIncome = computed(() => {
    return BeneficiaryRules.update.occupationIncome(
      user.value,
      props.securityTarget
    )
  })

  const canEditBeneficiaryExternalOrganisations = computed(() => {
    return BeneficiaryRules.update.externalOrganisations(
      user.value,
      props.securityTarget
    )
  })

  const navigationRoutes = computed<AppBeneficiaryEditRoute[]>(() => {
    const editRoutes: AppBeneficiaryEditRoute[] = [Route.AppBeneficiaryEditInfo]

    if (canEditBeneficiaryRelatives.value) {
      editRoutes.push(
        Route.AppBeneficiaryEditTaxHousehold,
        Route.AppBeneficiaryEditEntourage
      )
    }

    if (canEditBeneficiaryHealthInfo.value) {
      editRoutes.push(Route.AppBeneficiaryEditHealth)
    }

    if (canEditBeneficiaryOccupationIncome.value) {
      editRoutes.push(Route.AppBeneficiaryEditOccupation)
    }

    if (canEditBeneficiaryExternalOrganisations.value) {
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
