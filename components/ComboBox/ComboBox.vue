<template>
  <div
    class="combobox-wrapper fr-input-group"
    :class="{ 'fr-select-group--error': error }"
  >
    <label
      :id="LABEL_ID"
      :for="INPUT_ID"
      class="fr-label fr-mb-1w"
      :class="{ 'fr-sr-only': !labelVisible }"
    >
      {{ label }}
    </label>
    <div>
      <input
        :id="INPUT_ID"
        ref="input"
        v-model="displayedValue"
        :placeholder="placeholder"
        autocomplete="off"
        class="fr-select"
        type="search"
        role="combobox"
        aria-autocomplete="list"
        :aria-expanded="items.length > 0"
        :aria-controls="LISTBOX_ID"
        :aria-activedescendant="activeDescendant"
        @keydown="handleKeydown"
        @focus="onFocus"
        @blur="onBlur"
        @input="handleInput"
      />
      <ul
        v-show="(openList && items.length > 0) || loading"
        :id="LISTBOX_ID"
        class="listbox"
        role="listbox"
        :aria-labelledby="LABEL_ID"
      >
        <AtomLoader
          v-if="loading"
          class="fr-mx-auto fr-my-5v"
        />
        <AtomAlert
          v-if="error"
          :alert-type="AlertType.Error"
          :message="error"
        />
        <slot :input="displayedValue"></slot>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup generic="SelectValue = unknown">
  import { AlertType } from '~/utils/constants/alert'
  import { comboBoxInjectionKey, Item } from './utils'

  const { placeholder = '', labelVisible = true } = defineProps<{
    label: string
    placeholder?: string
    labelVisible?: boolean
  }>()

  defineSlots<{ default(props: { input: string }): unknown }>()

  const emit = defineEmits<{
    select: [value: unknown]
    input: [input: string]
  }>()
  const model = defineModel<SelectValue | null>({ required: false })
  function reset() {
    focusedItemIndex.value = -1
    model.value = null
    displayedValue.value = ''
  }
  defineExpose({ reset })

  const items = ref<Item[]>([])
  const focusedItemIndex = ref<number>(-1)
  const focusableItems = computed(() =>
    items.value.filter(item => !item.disabled)
  )

  const focusedItemId = computed(
    () => focusableItems.value[focusedItemIndex.value]?.id ?? null
  )
  const loading = ref<boolean>(false)
  const error = ref<string>('')

  const LABEL_ID = computed(() => `combobox-label-${useId()}`)
  const INPUT_ID = computed(() => `combobox-input-${useId()}`)
  const LISTBOX_ID = computed(() => `combobox-listbox-${useId()}`)

  const openList = ref(false)
  const displayedValue = ref('')
  const activeDescendant = computed(
    () => focusableItems.value[focusedItemIndex.value]?.id
  )

  const registerItem = (item: Item) => {
    items.value.push(item)
  }

  const unregisterItem = (item: Item) => {
    const index = items.value.findIndex(
      registerdItem => registerdItem.id === item.id
    )
    if (index >= 0) {
      items.value.splice(index, 1)
    }
  }

  const handleInput = (event: Event) => {
    // TODO: Improve this, as the input might be managed by the user/developer
    // and thus, not be accessible from here
    focusedItemIndex.value = -1
    const target = event.target as HTMLInputElement
    emit('input', target.value)
  }

  const handleSelect = (value: unknown) => {
    openList.value = false
    displayedValue.value = String(value)
    model.value = value as SelectValue
    emit('select', value)
  }

  const onFocus = () => {
    if (displayedValue.value !== null) {
      openList.value = true
    }
    focusedItemIndex.value = -1
  }

  const onBlur = () => {
    // TODO: improve this.
    // If the mouse is not over the listbox, close the list
    let listboxIsActive = false
    const listelements = document.getElementsByClassName('option')
    Array.from(listelements).forEach((element: Element) => {
      if (element.matches(':hover')) {
        listboxIsActive = true
      }
    })
    if (!listboxIsActive) {
      openList.value = false
      focusedItemIndex.value = -1
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    openList.value = true
    const itemLength = focusableItems.value.length
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault()
        if (itemLength >= 0) {
          focusedItemIndex.value =
            (focusedItemIndex.value +
              itemLength +
              (event.key === 'ArrowDown' ? 1 : -1)) %
            itemLength
          focusableItems.value[
            focusedItemIndex.value
          ].elementRef?.scrollIntoView({ block: 'nearest' })
        }
        break
      case 'Enter':
      case ' ':
        if (focusedItemIndex.value !== -1) {
          event.preventDefault()
          handleSelect(focusableItems.value[focusedItemIndex.value])
        }
        break
      }
      case 'Escape':
      case 'Tab':
        focusedItemIndex.value = -1
        openList.value = false
        break
    }
  }

  // Necessary because the input control that appears on ":hover" is managed
  // by the browser directly, so we can't listen to its click event.
  // This watcher is a substitute to track when this input control is used.
  watch(displayedValue, newVal => {
    if (newVal === '' && model.value !== null) {
      reset()
    }
  })

  provide(comboBoxInjectionKey, {
    handleSelect,
    registerItem,
    unregisterItem,
    focusedItemId
  })
</script>

<style lang="scss" scoped>
  /* stylelint-disable no-descending-specificity */
  @use '~/assets/style/variables' as *;
  @use '@gouvfr/dsfr/src/module/media-query' as dsfr-media-query;

  @include dsfr-media-query.respond-from('md') {
    .fr-search-bar--lg .fr-input {
      padding-top: 1rem;
      padding-bottom: 1rem;
      margin-top: 0;
    }
  }

  input[type='search'] {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='rgba(69,80,229,1)'%3E%3Cpath d='M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z'%3E%3C/path%3E%3C/svg%3E");
    background-position: 10px 12px;
    background-repeat: no-repeat;
    padding-left: 2.5rem;
  }

  /* clears the ‘X’ from Chrome */
  input[type='search']::-webkit-search-decoration,
  input[type='search']::-webkit-search-results-button,
  input[type='search']::-webkit-search-results-decoration {
    display: none;
  }

  /* Custom ‘X’ icon */
  input[type='search']::-webkit-search-cancel-button {
    /* stylelint-disable property-no-vendor-prefix */
    -webkit-appearance: none;
    cursor: pointer;
    height: 1rem;
    width: 1rem;
    margin-right: -1rem;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 10.5858L9.17157 7.75736L7.75736 9.17157L10.5858 12L7.75736 14.8284L9.17157 16.2426L12 13.4142L14.8284 16.2426L16.2426 14.8284L13.4142 12L16.2426 9.17157L14.8284 7.75736L12 10.5858Z'%3E%3C/path%3E%3C/svg%3E");
  }

  ul.listbox {
    min-width: 230px;
    width: 100%;
    border: 1px solid #ccc;
    background: #fff;
    border-radius: 0 0 0.5rem 0.5rem;
    box-shadow: $shadow-dark;
    z-index: 600;
    position: absolute;
    animation: slide-down 0.15s ease 1;
    max-height: 18.75rem;
    overflow-y: scroll;
    min-height: 1.5rem;
    padding: 4px;
    margin: 0;
  }

  .fr-select {
    box-shadow: inset 0 -2px 0 0 var(--primary);
  }
</style>
