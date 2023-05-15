<template>
  <div
    ref="$el"
    class="autocomplete fr-search-bar fr-search-bar--lg"
    role="search"
  >
    <label
      class="fr-label"
      :for="name"
    >
      {{ label }}
    </label>
    <input
      :id="name"
      ref="combobox"
      class="fr-input"
      :placeholder="label"
      type="search"
      :name="name"
      autocomplete="off"
      aria-autocomplete="list"
      aria-haspopup="listbox"
      aria-expanded="false"
      :aria-controls="listboxId"
      :aria-describedby="ariaDescribedby"
      role="combobox"
      @input="onSearch"
    />
    <button
      class="fr-btn search-btn"
      :title="label"
    ></button>

    <ul
      v-show="expanded"
      :id="listboxId"
      class="menu"
      role="listbox"
    >
      <AtomLoader
        v-if="timeout"
        class="fr-mx-auto fr-my-5v"
      />
      <li
        v-for="result in results"
        v-show="!timeout && !error"
        :key="result.id"
        class="menu-item"
        role="option"
      >
        <slot
          name="result"
          :result="result"
        >
        </slot>
      </li>
      <AtomAlert
        v-if="error"
        :alert-type="AlertType.Error"
        :message="error"
      />
    </ul>
  </div>
</template>

<script lang="ts" setup>
  import { BeneficiarySearchResult } from '~/utils'
  import { UNKNOWN_ERROR_MESSAGE } from '~/utils/constants'
  import { AlertType } from '~/utils/constants/alert'

  const props = defineProps<{
    label: string
    name: string
    searchFn: (search: string) => Promise<any[]>
  }>()

  const results = ref<BeneficiarySearchResult[]>([])
  const timeout = ref<NodeJS.Timeout | null>(null)
  const error = ref<string>('')

  const combobox = ref<HTMLInputElement | null>(null)
  const $el = ref<HTMLDivElement | null>(null)

  /**
   * Whether the searchbar is focused, to close the menu when blured
   */
  const { isFocused } = useBlurOut($el)

  const expanded = computed(
    () => !!(isFocused.value && (results.value.length || timeout.value))
  )

  const errorId = computed(() => `autocomplete-${props.name}-error-desc-error`)

  const ariaDescribedby = computed(() =>
    error.value ? errorId.value : undefined
  )

  const listboxId = computed(() => `autocomplete-${props.name}-listbox`)

  watch(expanded, _expanded => {
    // As Vue2 removes attribute when set to a falsy value, it can not directly binded in the template
    combobox.value?.setAttribute('aria-expanded', _expanded.toString())
  })

  function onSearch(event: Event) {
    const input = event.target as HTMLInputElement
    const search = input.value.trim()

    if (timeout.value) {
      clearTimeout(timeout.value)
      timeout.value = null
    }
    results.value = []
    error.value = ''

    if (!search) {
      return
    }

    timeout.value = setTimeout(async () => {
      try {
        results.value = await props.searchFn(search)
      } catch {
        error.value = UNKNOWN_ERROR_MESSAGE
      } finally {
        timeout.value = null
      }
    }, 400)
  }
</script>

<style lang="scss" scoped>
  @use '~/assets/style/variables' as *;
  @use '@gouvfr/dsfr/module/media-query' as dsfr-media-query;

  @include dsfr-media-query.respond-from('md') {
    .fr-search-bar--lg .fr-input {
      padding-top: 1rem;
      padding-bottom: 1rem;
      margin-top: 0;
    }

    .fr-search-bar--lg .search-btn {
      max-width: 2.5rem;
      padding: 0.5rem;
    }

    .fr-search-bar--lg .search-btn::before {
      margin-left: 0;
      margin-right: 0.5rem;
    }

    .fr-search-bar--lg :not(.search-btn)::before {
      content: none;
    }
  }

  .menu {
    top: 100%;
  }

  .menu-item > * {
    width: 100%;
    border-radius: 0;
  }

  .menu-item:last-child > * {
    border-radius: 0 0 0.5rem 0.5rem;
  }

  .active-menu-item {
    outline-style: solid;
  }
</style>
