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
  import { FamilyFilePermissions } from '~/server/security'
  import { routes, AppBeneficiaryEditRoute } from '~/utils/routes'

  const props = defineProps<{
    currentRoute: AppBeneficiaryEditRoute
    originTab: BeneficiaryTab | undefined
    beneficiaryId: string
    permissions: FamilyFilePermissions | undefined
    beneficiaryFormLayoutMainContainer: HTMLElement | null
  }>()

  const emit = defineEmits<{
    save: [target: string]
  }>()

  const r = routes.beneficiary

  const navigationRoutes = computed<AppBeneficiaryEditRoute[]>(() => {
    const editRoutes: AppBeneficiaryEditRoute[] = [
      r.AppBeneficiaryEditInfo.name
    ]

    if (props.permissions?.edit.relatives) {
      editRoutes.push(
        r.AppBeneficiaryEditTaxHousehold.name,
        r.AppBeneficiaryEditEntourage.name
      )
    }

    if (props.permissions?.edit.health) {
      editRoutes.push(r.AppBeneficiaryEditHealth.name)
    }

    if (props.permissions?.edit.occupationIncome) {
      editRoutes.push(r.AppBeneficiaryEditOccupation.name)
    }

    if (props.permissions?.edit.externalOrganisations) {
      editRoutes.push(r.AppBeneficiaryEditExternalOrganisations.name)
    }

    return editRoutes
  })

  const menus = computed(() => {
    return navigationRoutes.value.map(route => {
      const path = r[route].path(props.beneficiaryId, {
        saved: route !== props.currentRoute,
        originTab: props.originTab
      })

      const menu = {
        route: route as AppBeneficiaryEditRoute,
        path
      }

      if (route === r.AppBeneficiaryEditInfo.name) {
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
