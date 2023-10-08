<template>
  <nav
    class="fr-sidemenu"
    role="navigation"
  >
    <div class="fr-sidemenu__inner">
      <button
        class="fr-sidemenu__btn"
        aria-controls="fr-sidemenu-wrapper"
        aria-expanded="false"
      >
        Menu de navigation du formulaire
      </button>
      <div
        id="fr-sidemenu-wrapper"
        class="fr-collapse"
      >
        <ul class="fr-sidemenu__list">
          <li
            v-for="menu in menus"
            :key="menu.route"
            class="fr-sidemenu__item"
            :class="{ 'fr-sidemenu__item--active': menu.route === current }"
          >
            <button
              class="fr-sidemenu__btn"
              :aria-current="menu.route === current ? true : undefined"
              :type="menu.route === current ? 'button' : 'submit'"
              @click="emit('save', menu.path)"
            >
              {{ RouteTitle[menu.route]() }}
            </button>
            <div v-if="menu.targets">
              <ul class="fr-sidemenu__list">
                <li
                  v-for="target in menu.targets"
                  :key="target.hash"
                  class="fr-sidemenu__item"
                  :class="{
                    'fr-sidemenu__item--active': target.hash === currentHash
                  }"
                >
                  <a
                    class="fr-sidemenu__link"
                    :href="`${menu.path}#${target.hash}`"
                    target="_self"
                    :aria-current="
                      target.hash === currentHash ? true : undefined
                    "
                  >
                    {{ target.title }}
                  </a>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
  import { useAuthStore } from '~/store/auth'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import {
    RoutePath,
    Route,
    RouteTitle,
    AppBeneficiaryEditRoute,
    AppBeneficiariesSaveRoute
  } from '~/utils/routing'
  import {
    canEditBeneficiaryRelatives as canEditBeneficiaryRelativesRule,
    canEditBeneficiaryHealthInfo as canEditBeneficiaryHealthInfoRule,
    canEditBeneficiaryOccupationIncome as canEditBeneficiaryOccupationIncomeRule,
    canEditBeneficiaryExternalOrganisations as canEditBeneficiaryExternalOrganisationsRule,
    SecurityTargetWithReferents,
    SecurityTargetWithStructure
  } from '~/server/security/rules'

  const route = useRoute()
  const beneficiaryId = route.params.id as string | undefined
  const draftId = route.params.draftId as string | undefined
  const originTab = route.query.originTab
    ? (route.query.originTab as BeneficiaryTab)
    : undefined

  const authStore = useAuthStore()

  const props = defineProps<{
    current: AppBeneficiaryEditRoute | AppBeneficiariesSaveRoute
    beneficiary: SecurityTargetWithReferents & SecurityTargetWithStructure
  }>()

  const emit = defineEmits<{
    save: [target: string]
  }>()

  const currentHash = computed(() => {
    if (
      props.current !== Route.AppBeneficiaryEditInfo &&
      props.current !== Route.AppBeneficiariesSaveInfo
    ) {
      return undefined
    }

    return route.hash ? route.hash.replace('#', '') : undefined
  })

  const user = computed(() => authStore.getAuthUser)

  const canEditBeneficiaryRelatives = computed(() => {
    return canEditBeneficiaryRelativesRule(user.value, props.beneficiary)
  })

  const canEditBeneficiaryHealthInfo = computed(() => {
    return canEditBeneficiaryHealthInfoRule(user.value, props.beneficiary)
  })

  const canEditBeneficiaryOccupationIncome = computed(() => {
    return canEditBeneficiaryOccupationIncomeRule(user.value, props.beneficiary)
  })

  const canEditBeneficiaryExternalOrganisations = computed(() => {
    return canEditBeneficiaryExternalOrganisationsRule(
      user.value,
      props.beneficiary
    )
  })

  const appBeneficiaryEditRoutes = computed<AppBeneficiaryEditRoute[]>(() => {
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

  const appBeneficiariesSaveRoutes = computed<AppBeneficiariesSaveRoute[]>(
    () => {
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
    }
  )

  const routes = computed(() =>
    beneficiaryId && !draftId
      ? appBeneficiaryEditRoutes.value
      : appBeneficiariesSaveRoutes.value
  )

  const menus = computed(() => {
    return routes.value.map(route => {
      const path =
        beneficiaryId && !draftId
          ? RoutePath[route as AppBeneficiaryEditRoute](beneficiaryId, {
              saved: true,
              originTab
            })
          : RoutePath[route as AppBeneficiariesSaveRoute](draftId as string)

      const menu = {
        route: route as AppBeneficiaryEditRoute | AppBeneficiariesSaveRoute,
        path
      }

      if (
        route === Route.AppBeneficiaryEditInfo ||
        route === Route.AppBeneficiariesSaveInfo
      ) {
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

<style scoped lang="scss">
  @use '~/assets/style/variables' as *;

  .fr-sidemenu {
    padding-right: 0;
  }

  .fr-sidemenu__inner {
    box-shadow: none;
    padding: 1.5rem 1rem;
  }

  .fr-sidemenu__btn[aria-current],
  .fr-sidemenu__link[aria-current] {
    color: $primary;
  }

  .fr-sidemenu__btn[aria-current]::before,
  .fr-sidemenu__link[aria-current]::before {
    background-color: $primary;
  }
</style>
