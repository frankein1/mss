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
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import {
    RoutePath,
    Route,
    RouteTitle,
    AppBeneficiaryEditRoute,
    AppBeneficiariesSaveRoute
  } from '~/utils/routing'

  const appBeneficiaryEditRoutes: AppBeneficiaryEditRoute[] = [
    Route.AppBeneficiaryEditInfo,
    Route.AppBeneficiaryEditTaxHousehold,
    Route.AppBeneficiaryEditEntourage,
    Route.AppBeneficiaryEditHealth,
    Route.AppBeneficiaryEditOccupation,
    Route.AppBeneficiaryEditExternalOrganisations
  ]

  const appBeneficiariesSaveRoutes: AppBeneficiariesSaveRoute[] = [
    Route.AppBeneficiariesSaveInfo,
    Route.AppBeneficiariesSaveTaxHousehold,
    Route.AppBeneficiariesSaveEntourage,
    Route.AppBeneficiariesSaveHealth,
    Route.AppBeneficiariesSaveOccupation,
    Route.AppBeneficiariesSaveExternalOrganisations
  ]

  const route = useRoute()
  const beneficiaryId = route.params.id as string | undefined
  const draftId = route.params.draftId as string | undefined
  const originTab = route.query.originTab
    ? (route.query.originTab as BeneficiaryTab)
    : undefined

  const props = defineProps<{
    current: AppBeneficiaryEditRoute | AppBeneficiariesSaveRoute
  }>()

  const emit = defineEmits<{
    save: [target: string]
  }>()

  const menus = computed(() => {
    const routes =
      beneficiaryId && !draftId
        ? appBeneficiaryEditRoutes
        : appBeneficiariesSaveRoutes

    return routes.map(route => {
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

  const currentHash = computed(() => {
    if (
      props.current !== Route.AppBeneficiaryEditInfo &&
      props.current !== Route.AppBeneficiariesSaveInfo
    ) {
      return undefined
    }

    return route.hash ? route.hash.replace('#', '') : undefined
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
