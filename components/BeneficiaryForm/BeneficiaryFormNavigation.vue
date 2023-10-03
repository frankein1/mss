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
          <!-- <li class="fr-sidemenu__item">
            <button
              class="fr-sidemenu__btn"
              type="button"
              aria-expanded="true"
              aria-controls="fr-sidemenu-item-0"
              @click="onSave(RoutePath.AppBeneficiaryEditInfo)"
            >
              Informations générales
            </button>
            <div
              id="fr-sidemenu-item-0"
              class="fr-collapse"
            >
              <ul class="fr-sidemenu__list">
                <li class="fr-sidemenu__item">
                  <a
                    class="fr-sidemenu__link"
                    href="#"
                    target="_self"
                    >Accès direct niveau 2</a
                  >
                </li>
                <li class="fr-sidemenu__item">
                  <a
                    class="fr-sidemenu__link"
                    href="#"
                    target="_self"
                    >Accès direct niveau 2</a
                  >
                </li>
                <li class="fr-sidemenu__item">
                  <a
                    class="fr-sidemenu__link"
                    href="#"
                    target="_self"
                    >Accès direct niveau 2</a
                  >
                </li>
                <li class="fr-sidemenu__item">
                  <a
                    class="fr-sidemenu__link"
                    href="#"
                    target="_self"
                    >Accès direct niveau 2</a
                  >
                </li>
                <li class="fr-sidemenu__item">
                  <a
                    class="fr-sidemenu__link"
                    href="#"
                    target="_self"
                    >Accès direct niveau 2</a
                  >
                </li>
                <li class="fr-sidemenu__item">
                  <a
                    class="fr-sidemenu__link"
                    href="#"
                    target="_self"
                    >Accès direct niveau 2</a
                  >
                </li>
              </ul>
            </div>
          </li> -->
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
              @click="onSave(RoutePath[menu.route])"
            >
              {{ RouteTitle[menu.route]() }}
            </button>
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

  defineProps<{
    current: AppBeneficiaryEditRoute | AppBeneficiariesSaveRoute
  }>()

  const emit = defineEmits<{
    save: [target: string]
  }>()

  // TODO: Add Info route children
  const menus = computed(() => {
    const routes =
      beneficiaryId && !draftId
        ? appBeneficiaryEditRoutes
        : appBeneficiariesSaveRoutes
    return routes.map(route => ({
      route: route as AppBeneficiaryEditRoute
    }))
  })

  type AppBeneficiaryEditRoutePath = (typeof RoutePath)[AppBeneficiaryEditRoute]
  type AppBeneficiariesSaveRoutePath =
    (typeof RoutePath)[AppBeneficiariesSaveRoute]
  type BeneficiaryFormRoutePath =
    | AppBeneficiaryEditRoutePath
    | AppBeneficiariesSaveRoutePath

  function onSave(path: BeneficiaryFormRoutePath) {
    if (beneficiaryId) {
      emit(
        'save',
        (path as AppBeneficiaryEditRoutePath)(beneficiaryId, {
          saved: true,
          originTab
        })
      )
    }
    if (draftId) {
      emit('save', (path as AppBeneficiariesSaveRoutePath)(draftId))
    }
  }
</script>

<style scoped lang="scss">
  .fr-sidemenu {
    padding-right: 0;
  }

  .fr-sidemenu__inner {
    box-shadow: none;
    padding: 1.5rem 1rem;
  }
</style>
