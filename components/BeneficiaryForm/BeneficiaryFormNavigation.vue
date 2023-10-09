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
            :class="{
              'fr-sidemenu__item--active': menu.route === currentRoute
            }"
          >
            <button
              class="fr-sidemenu__btn"
              :aria-current="menu.route === currentRoute ? true : undefined"
              :type="menu.route === currentRoute ? 'button' : 'submit'"
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
  import {
    Route,
    RouteTitle,
    AppBeneficiaryEditRoute,
    AppBeneficiariesSaveRoute
  } from '~/utils/routing'

  const route = useRoute()

  const props = defineProps<{
    menus: Array<{
      route: AppBeneficiaryEditRoute | AppBeneficiariesSaveRoute
      path: string
      targets?: { hash: string; title: string }[]
    }>
    currentRoute: AppBeneficiaryEditRoute | AppBeneficiariesSaveRoute
  }>()

  const emit = defineEmits<{
    save: [target: string]
  }>()

  const currentHash = computed(() => {
    if (
      props.currentRoute !== Route.AppBeneficiaryEditInfo &&
      props.currentRoute !== Route.AppBeneficiariesSaveInfo
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
