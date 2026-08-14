<template>
  <div
    class="combobox-wrapper fr-input-group"
    :class="{
      'fr-select-group--error': error,
      'fr-input-group--disabled': disabled
    }"
  >
    <label
      :id="LABEL_ID"
      :for="INPUT_ID"
      class="fr-label fr-mb-1w"
      :class="{ 'fr-sr-only': !labelVisible }"
    >
      {{ label }}
      <span
        v-if="required"
        class="color-red"
        >*</span
      >
      <span
        v-if="hint"
        class="fr-hint-text"
        >{{ hint }}</span
      >
    </label>
    <div>
      <input
        :id="INPUT_ID"
        ref="input"
        v-model="displayedValue"
        :placeholder="placeholder"
        :disabled="disabled"
        autocomplete="off"
        class="fr-select"
        :class="{
          'fr-select--error': error,
          'fr-select--highlight': highlight
        }"
        type="search"
        role="combobox"
        tabindex="0"
        :aria-labelledby="LABEL_ID"
        :aria-describedby="ariaDescribedby"
        aria-autocomplete="list"
        :aria-expanded="options.length > 0"
        :aria-controls="LISTBOX_ID"
        :aria-activedescendant="activeDescendant"
        @keydown="handleKeydown"
        @focus="onFocus"
        @blur="onBlur"
        @input="handleInput"
      />
      <ul
        v-if="options.length || loading"
        v-show="openList || loading"
        :id="LISTBOX_ID"
        class="listbox"
        role="listbox"
        :aria-labelledby="LABEL_ID"
      >
        <div
          v-if="$slots.header"
          class="listbox-header"
          tabindex="-1"
          @focus.prevent
          @focusin.prevent
          @mousedown.prevent
        >
          <slot
            name="header"
            :input="displayedValue"
            :options="options"
            @focus="onFocus"
          ></slot>
        </div>
        <AtomLoader
          v-if="loading"
          class="fr-mx-auto fr-my-5v"
        />
        <li
          v-for="(option, rowIndex) in options"
          :id="`${LISTBOX_ID}-option-${rowIndex}`"
          :key="rowIndex"
          class="option"
          role="option"
          :aria-selected="isSelected(option)"
          :class="{
            focused: rowIndex === activeRow,
            disabled: option.disabled
          }"
          v-on="!option.disabled ? { click: () => handleSelect(option) } : {}"
        >
          <slot
            :option="option"
            :input="displayedValue"
          ></slot>
        </li>
      </ul>
    </div>
  </div>
  <div
    :id="errorId"
    class="fr-messages-group"
    aria-live="polite"
  >
    <p
      v-if="error"
      class="fr-message fr-message--error"
    >
      {{ error }}
    </p>
  </div>
</template>

<script lang="ts" setup generic="Option extends { disabled?: boolean }">
  const {
    placeholder = '',
    required = false,
    labelVisible = true,
    disabled = false,
    loading = false,
    highlight = false,
    options,
    error = undefined,
    hint = undefined,
    formatDisplayValue = String,
    onFocusHeader = () => {}
  } = defineProps<{
    label: string
    required?: boolean
    placeholder?: string
    labelVisible?: boolean
    disabled?: boolean
    loading?: boolean
    highlight?: boolean
    hint?: string
    options: Option[]
    error?: string
    formatDisplayValue?: (option: Option) => string
    onFocusHeader?: () => void
  }>()

  const slots = defineSlots<{
    default(props: { option: Option; input: string }): unknown
    header?(props: { input: string; options: Option[] }): unknown
  }>()

  const emit = defineEmits<{
    select: [option: Option]
    input: [input: string]
    clear: []
  }>()
  const model = defineModel<Option | null>({ required: true })
  function reset() {
    model.value = null
    displayedValue.value = ''
    emit('clear')
  }

  const input = useTemplateRef('input')
  const errorId = computed(() => `${useId()}-error`)
  const ariaDescribedby = computed(() => (error ? errorId.value : undefined))

  const LABEL_ID = computed(() => `combobox-label-${useId()}`)
  const INPUT_ID = computed(() => `combobox-input-${useId()}`)
  const LISTBOX_ID = computed(() => `combobox-listbox-${useId()}`)

  const openList = ref(false)
  const displayedValue = ref(model.value ? formatDisplayValue(model.value) : '')
  const activeRow = ref(-1)
  const activeDescendant = computed(() => {
    if (activeRow.value >= 0) {
      return `${LISTBOX_ID.value}-option-${activeRow.value}`
    }
    return ''
  })

  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    emit('input', target.value)
  }

  const handleSelect = (option: Option) => {
    openList.value = false
    displayedValue.value = formatDisplayValue(option)
    model.value = option
    emit('select', option)
  }

  // Options are freshly fetched on every search, so they never share
  // object identity with the selected model: compare by display value instead.
  const isSelected = (option: Option) =>
    model.value != null &&
    formatDisplayValue(option) === formatDisplayValue(model.value)

  const onFocus = () => {
    if (displayedValue.value != null) {
      openList.value = true
    }
    activeRow.value = -1
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
      activeRow.value = -1
    }
  }

  const selectActiveRow = (e: KeyboardEvent): number => {
    if (activeRow.value === -1 && e.key === 'ArrowDown') {
      activeRow.value = 0
    }
    handleKeydown(e)
    return activeRow.value
  }

  function handleKeydown(e: KeyboardEvent) {
    openList.value = true
    const hasHeader = !!slots.header
    switch (e.key) {
      case 'ArrowDown':
        if (slots.header && activeRow.value === -1) {
          onFocusHeader()
          openList.value = true
        } else {
          e.preventDefault()
          if (activeRow.value < options.length - 1) {
            activeRow.value++
          } else {
            activeRow.value = hasHeader ? -1 : 0
          }
        }
        break
      case 'ArrowUp': {
        e.preventDefault()
        const limit = hasHeader ? -1 : 0
        activeRow.value =
          activeRow.value <= limit ? options.length - 1 : activeRow.value - 1
        break
      }
      case 'Enter': {
        e.preventDefault()
        const ar = activeRow.value
        if (ar >= 0 && options[ar] && !options[ar].disabled) {
          handleSelect(options[ar])
        }
        break
      }
      case ' ': {
        const ar = activeRow.value
        if (ar >= 0 && options[ar] !== undefined && !options[ar].disabled) {
          handleSelect(options[ar])
        }
        break
      }
      case 'Escape':
        activeRow.value = -1
        openList.value = false
        break
      case 'Tab':
        openList.value = false
        activeRow.value = -1
        break
    }
  }

  // Used when the user is is navigating in the dropdown
  // using the keyboard, to make sure the selected option
  // is visible.
  watch(activeRow, newIndex => {
    if (newIndex >= 0) {
      const el = document.getElementById(
        `${LISTBOX_ID.value}-option-${newIndex}`
      )
      el?.scrollIntoView({ block: 'nearest' })
    }
  })

  // Prevents the displayedValue watcher from calling reset() when the model is updated externally.
  let isModelUpdate = false
  watch(model, newVal => {
    isModelUpdate = true
    displayedValue.value = newVal ? formatDisplayValue(newVal) : ''
    nextTick(() => {
      isModelUpdate = false
    })
  })

  // Necessary because the input control that appears on ":hover" is managed
  // by the browser directly, so we can't listen to its click event.
  // This watcher is a substitute to track when this input control is used.
  watch(displayedValue, newVal => {
    if (isModelUpdate) {
      return
    }
    if (newVal === '' && model.value !== null) {
      reset()
    }
  })

  watch(
    () => error,
    newError => {
      if (newError) {
        nextTick(() => {
          input.value?.focus()
        })
      }
    }
  )

  defineExpose({ reset, selectActiveRow })
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
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='rgba(58,58,58,1)'%3E%3Cpath d='M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z'%3E%3C/path%3E%3C/svg%3E");
    background-position: 10px 12px;
    background-repeat: no-repeat;

    &.fr-select--highlight {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='rgba(69,80,229,1)'%3E%3Cpath d='M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z'%3E%3C/path%3E%3C/svg%3E");
    }

    &:disabled {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='rgba(146,146,146,1)'%3E%3Cpath d='M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z'%3E%3C/path%3E%3C/svg%3E");
    }

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

    &:focus-visible {
      outline: #0a76f6 solid 29px;
      outline-offset: 2px;
    }
  }

  .option {
    margin: 0;
    padding: 0.75rem 1rem;
    box-shadow: 0 17px 0 -16px var(--border-default-grey);

    &:not(.disabled) {
      color: var(--text-action-high-grey);
      cursor: pointer;

      &:hover {
        background-color: var(--background-default-grey-hover);
        font-weight: 500;
      }
    }

    &.disabled {
      color: var(--text-mention-grey);
    }

    &:last-child {
      box-shadow: none;
    }
  }

  .focused {
    outline: dashed 1px rgb(0 0 0 / 100%);
  }

  .fr-select {
    box-shadow: inset 0 -2px 0 0 var(--border-plain-grey);

    &.fr-select--highlight {
      box-shadow: inset 0 -2px 0 0 var(--primary);
    }

    &:disabled {
      box-shadow: inset 0 -2px 0 0 var(--text-disabled-grey);
    }
  }
</style>
