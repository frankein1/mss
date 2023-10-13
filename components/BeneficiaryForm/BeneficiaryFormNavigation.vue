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
              @click="menu.route !== currentRoute && emit('save', menu.path)"
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
                    'fr-sidemenu__item--active': target.hash === activeHash
                  }"
                >
                  <a
                    v-if="menu.route === currentRoute"
                    class="fr-sidemenu__link"
                    :href="`${menu.path}#${target.hash}`"
                    target="_self"
                    :aria-current="
                      target.hash === activeHash ? true : undefined
                    "
                  >
                    {{ target.title }}
                  </a>
                  <!-- FIXME: The button submit does not redirect to the anchor -->
                  <button
                    v-else
                    class="fr-sidemenu__link"
                    type="submit"
                    @click="emit('save', `${menu.path}#${target.hash}`)"
                  >
                    {{ target.title }}
                  </button>
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
    RouteTitle,
    AppBeneficiaryEditRoute,
    AppBeneficiariesSaveRoute
  } from '~/utils/routing'

  const route = useRoute()
  const SCROLL_DEFER_DURATION = 400

  const props = defineProps<{
    menus: Array<{
      route: AppBeneficiaryEditRoute | AppBeneficiariesSaveRoute
      path: string
      targets?: { hash: string; title: string }[]
    }>
    currentRoute: AppBeneficiaryEditRoute | AppBeneficiariesSaveRoute
    beneficiaryFormLayoutMainContainer: HTMLElement | null
  }>()

  const emit = defineEmits<{
    save: [target: string]
  }>()

  const activeHash = ref<string | undefined>(undefined)

  /**
   * Used to prevent native scroll from browser on hash focus to update the active hash right after the hash change event has triggered
   * See https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/issues/127#note_1600789293
   */
  const hashJustChanged = ref<boolean>(false)

  const currentRouteHasSubSections = computed(() => {
    const menu = props.menus.find(({ route }) => route === props.currentRoute)

    return !!menu?.targets?.length
  })

  const formSections = computed(() => {
    if (!props.beneficiaryFormLayoutMainContainer) {
      return []
    }

    return Array.from(
      props.beneficiaryFormLayoutMainContainer.querySelectorAll(
        '.feature-section'
      )
    ).filter(e => !!e.id)
  })

  // Use watch instead of onMounted as `beneficiaryFormLayoutMainContainer` is initially null
  watch(
    () => props.beneficiaryFormLayoutMainContainer,
    (mainContainer, previousMainContainer) => {
      if (!currentRouteHasSubSections.value) {
        return
      }

      if (!previousMainContainer && mainContainer) {
        mainContainer.addEventListener('scroll', onMainContainerScroll)
      }
    }
  )

  onMounted(() => {
    onHashChange()

    if (currentRouteHasSubSections.value) {
      window.addEventListener('hashchange', onHashChange)
    }
  })

  onUnmounted(() => {
    if (currentRouteHasSubSections.value) {
      window.removeEventListener('hashchange', onHashChange)

      if (props.beneficiaryFormLayoutMainContainer) {
        props.beneficiaryFormLayoutMainContainer.removeEventListener(
          'scroll',
          onMainContainerScroll
        )
      }
    }
  })

  function onHashChange() {
    if (route.hash) {
      activeHash.value = route.hash.slice(1)
      hashJustChanged.value = true
    }
  }

  const onMainContainerScroll = useDefer(SCROLL_DEFER_DURATION, () => {
    if (hashJustChanged.value) {
      hashJustChanged.value = false
      return
    }

    const mainContainer = props.beneficiaryFormLayoutMainContainer
    if (!mainContainer) {
      return
    }

    const visible = formSections.value.find(section =>
      formSectionIsVisible(section, mainContainer)
    )
    activeHash.value = visible?.id
  })

  function formSectionIsVisible(
    formSection: Element,
    mainContainer: HTMLElement
  ) {
    const mainContainerRect = mainContainer.getBoundingClientRect()
    const mainContainerRectVerticalMiddle =
      mainContainerRect.top +
      (mainContainerRect.bottom - mainContainerRect.top) / 2
    const sectionRect = formSection.getBoundingClientRect()

    return (
      sectionRect.top < mainContainerRectVerticalMiddle &&
      sectionRect.bottom > mainContainerRectVerticalMiddle
    )
  }
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
