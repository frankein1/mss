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
              {{ routes.beneficiary[menu.route].title }}
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
                    :aria-current="
                      target.hash === activeHash ? true : undefined
                    "
                  >
                    {{ target.title }}
                  </a>
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
  import { routes, AppBeneficiaryEditRoute } from '~/utils/routes'

  const SCROLL_DEFER_DURATION = 400

  const props = defineProps<{
    menus: Array<{
      route: AppBeneficiaryEditRoute
      path: string
      targets?: { hash: string; title: string }[]
    }>
    currentRoute: AppBeneficiaryEditRoute
    beneficiaryFormLayoutMainContainer: HTMLElement | null
  }>()

  const emit = defineEmits<{
    save: [target: string]
  }>()

  const activeHash = ref<string | undefined>(undefined)

  /**
   * Used to prevent native scroll from browser on hash focus to update the
   * active hash right after the hash change event has triggered
   * It seems to only occur on Firefox browsers
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
    if (currentRouteHasSubSections.value) {
      onHashChange()
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
    /**
     * Use window.location.hash instead of route.hash as route.hash is weirdly
     * not up to date when the hashchange event is called, on Chrome browsers
     * only
     */
    const hash = window.location.hash
    if (hash) {
      activeHash.value = hash.slice(1)
      hashJustChanged.value = true

      const firstSubSectionField = document.querySelector<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >(`${hash} input, ${hash} select,  ${hash} textarea`)
      firstSubSectionField?.focus()
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
