<!-- Inspired from W3C Listbox pattern (https://www.w3.org/WAI/ARIA/apg/patterns/listbox/) and Sonder UI multiselect (https://github.com/microsoft/sonder-ui/tree/6f38c553babbc28d50b0e75a8bc2ab584b9d2a8b/src/components/multiselect)  -->

<template>
  <div
    :class="{
      'fr-fieldset': !dropdown,
      'fr-select-group multi-select': dropdown,
      'fr-fieldset--error': !dropdown && error,
      'fr-select-group--error': dropdown && error,
      'fr-select-group--disabled': dropdown && (disabled || readonly)
    }"
    :aria-labelledby="dropdown ? undefined : ariaDescribedby || labelId"
  >
    <label
      :id="labelId"
      :class="[dropdown ? 'fr-label' : 'fr-fieldset__legend', labelClass]"
      :for="displayInputId"
    >
      {{ displayLabel }}
      <span
        v-if="hint"
        class="fr-hint-text"
      >
        {{ hint }}
      </span>
    </label>
    <input
      v-if="dropdown"
      :id="displayInputId"
      ref="combobox"
      :value="displayedValue"
      class="fr-select"
      :class="{ 'fr-select--error': error }"
      autocomplete="off"
      aria-autocomplete="list"
      aria-expanded="false"
      :aria-controls="listboxId"
      :aria-activedescendant="activeOptionValue"
      aria-haspopup="listbox"
      :aria-describedby="ariaDescribedby"
      readonly
      :disabled="disabled"
      :placeholder="placeholder"
      @keydown="onInputKeyDown"
    />
    <!-- FIXME: As input is hidden, it can not be focused on submission failure -->
    <input
      :id="name"
      ref="hiddenInput"
      :name="name"
      hidden
      :required="required"
      :value="currentValue"
      :disabled="disabled"
      :readonly="readonly"
      @change="onChange"
      @invalid="onValidate"
    />
    <ul
      v-show="!dropdown || expanded"
      :id="listboxId"
      ref="listbox"
      :class="{
        'fr-fieldset__element': !dropdown,
        'menu': dropdown
      }"
      class="fr-tags-group"
      role="listbox"
      aria-multiselectable="true"
      :aria-activedescendant="activeOptionValue"
      :aria-labelledby="labelId"
    >
      <li
        v-for="([optionValue, optionLabel], index) in orderedOptions"
        :ref="el => setOptionRef(el, optionValue)"
        :key="optionValue"
        role="option"
        :aria-selected="selectedValues.includes(optionValue)"
        @click="onToggleOption(optionValue, index)"
        @mousedown="onOptionMouseDown"
      >
        <button
          :id="optionValue"
          type="button"
          class="fr-tag"
          :class="{ 'active-menu-item': index === activeIndex }"
          :name="optionValue"
          :aria-pressed="selectedValues.includes(optionValue)"
          :tabindex="optionTabindex"
          :disabled="disabledOptions.includes(optionValue)"
        >
          {{ optionLabel }}
        </button>
      </li>
    </ul>
    <div
      v-if="error"
      :id="errorId"
      class="fr-messages-group"
      aria-live="assertive"
    >
      <p class="fr-message fr-message--error">
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ComponentPublicInstance, ComputedRef, Ref } from 'vue'

  const props = withDefaults(
    defineProps<{
      label: string
      options: Map<string, string>
      modelValue?: string[]
      labelClass?: string
      required?: boolean
      name: string
      dropdown?: boolean
      placeholder?: string
      disabled?: boolean
      readonly?: boolean
      disabledOptions?: string[]
      hint?: string
    }>(),
    {
      modelValue: () => [],
      labelClass: '',
      required: false,
      dropdown: false,
      placeholder: '',
      disabled: false,
      readonly: false,
      disabledOptions: () => [],
      hint: ''
    }
  )

  const emit = defineEmits<{
    (e: 'update:modelValue', values: string[]): void
    (e: 'changeValue', value: string): void
  }>()

  const selectedValues = ref<string[]>(
    (props.modelValue || []).filter(v => props.options.has(v))
  )
  const error = ref<string>('')

  const hiddenInput = ref<HTMLInputElement | null>(null)
  const combobox = ref<HTMLDivElement | null>(null)
  const optionRefs = initOptionRefs()

  const displayLabel = computed(() =>
    props.required ? `${props.label} *` : props.label
  )
  const errorId = computed(() => `${props.name}-error-desc-error`)

  const ariaDescribedby = computed(() =>
    error.value ? errorId.value : undefined
  )

  /**
   * The value stored in the hidden input
   */
  const currentValue = computed(() => selectedValues.value.join(','))

  /**
   * The value displayed in the fake select box
   */
  const displayedValue = computed(() =>
    selectedValues.value.map(value => props.options.get(value)).join(', ')
  )

  const listboxId = computed(() => `multi-select-${props.name}-listbox`)
  const displayInputId = computed(
    () => `multi-select-${props.name}-fake-select`
  )
  const labelId = computed(() => `multi-select-${props.name}-label`)

  /**
   * In dropdown mode, options can not be accessed through tab hits
   * In tag list mode, the navigation is done thanks to tab hits
   */
  const optionTabindex = computed(() => (props.dropdown ? '-1' : undefined))

  const orderedOptions = computed(() => {
    const optionsAsArray = [...props.options.entries()]
    const sortedOptionsAsArray = optionsAsArray.sort(([aKey], [bKey]) => {
      const aSelected = selectedValues.value.includes(aKey)
      const bSelected = selectedValues.value.includes(bKey)
      if (aSelected === bSelected) return 0
      return aSelected ? -1 : 1
    })
    return new Map(sortedOptionsAsArray)
  })

  const optionValues = computed(() => [...orderedOptions.value.keys()])

  const {
    /**
     * For dropdown mode, indicates whether the listbox is expanded or not
     */
    expanded,

    /**
     * Prevent from closing the listbox on blur
     * It is used when an option is clicked
     */
    ignoreBlur,

    /**
     * The active option index in the options list
     */
    activeIndex,
    activeOptionValue,
    listbox,

    /**
     * Flag to set focus on next render completion, when menu was blurred on click on option
     */
    callFocus
  } = _useExpandMenu()

  useWatchSelectOptions(() => props.options, selectedValues)

  /**
   * Update the hidden input value
   */
  watch(currentValue, _currentValue => {
    if (!hiddenInput.value) return
    hiddenInput.value.value = _currentValue
    hiddenInput.value.dispatchEvent(new Event('change'))
    hiddenInput.value.closest('form')?.dispatchEvent(new Event('change'))
    emit('changeValue', _currentValue)
  })

  onMounted(() => {
    /**
     * Reset selected value on parent form reset
     */
    listenFormReset()
  })

  onBeforeUnmount(() => {
    unlistenFormReset()
  })

  function listenFormReset() {
    hiddenInput.value?.closest('form')?.addEventListener('reset', reset)
  }

  function unlistenFormReset() {
    hiddenInput.value?.closest('form')?.removeEventListener('reset', reset)
  }

  function _useExpandMenu(): {
    expanded: Ref<boolean | undefined>
    ignoreBlur: Ref<boolean | undefined>
    activeIndex: Ref<number | undefined>
    activeOption: Ref<HTMLElement | null | undefined>
    activeOptionValue: ComputedRef<string>
    listbox: Ref<HTMLElement | null>
    callFocus: Ref<boolean | undefined>
  } {
    if (props.dropdown) {
      return useExpandMenu(
        combobox,
        optionValues,
        optionRefs,
        computed(() => props.disabled || props.readonly)
      )
    }
    return {
      expanded: ref<undefined>(),
      ignoreBlur: ref<undefined>(),
      activeIndex: ref<undefined>(),
      activeOption: ref<undefined>(),
      activeOptionValue: computed(() => ''),
      listbox: ref<HTMLUListElement | null>(null),
      callFocus: ref<undefined>()
    }
  }

  /**
   * Add a value to the selected values if it is not present, otherwise remove it from
   * @param value The option value to add or remove from selected values
   * @param optionIndex Optional - The option index to set as active when toggling from mouse click
   */
  function onToggleOption(value: string, optionIndex?: number) {
    if (optionIndex) activeIndex.value = optionIndex
    if (selectedValues.value.includes(value)) {
      selectedValues.value = selectedValues.value.filter(o => o !== value)
    } else selectedValues.value.push(value)
  }

  function onChange(event: Event) {
    if (!event.target) return
    const target = event.target as HTMLInputElement
    emit('update:modelValue', target.value.split(','))
    onValidate(event)
  }

  function onValidate(event: Event) {
    if (!event.target) return
    const target = event.target as HTMLInputElement
    error.value = target.validationMessage
  }

  function onInputKeyDown(e: KeyboardEvent) {
    if (!props.dropdown) return

    if (!expanded.value) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        expanded.value = true
      }
      return
    }

    // Keyboard interactions on the expanded listbox
    switch (e.key) {
      case 'Enter':
        onSelectActiveOption()
        expanded.value = false
        return
      case ' ':
        e.preventDefault()
        return onToggleOption(activeOptionValue.value)
    }
  }

  function onSelectActiveOption() {
    if (!activeOptionValue.value) return
    if (selectedValues.value.includes(activeOptionValue.value)) return
    selectedValues.value.push(activeOptionValue.value)
  }

  function onOptionMouseDown() {
    ignoreBlur.value = true
    callFocus.value = true
  }

  function reset() {
    selectedValues.value = []
  }

  function initOptionRefs(): { [key: string]: Ref<HTMLElement | null> } {
    return [...props.options.keys()].reduce(
      (optionRefs, optionValue) => ({
        ...optionRefs,
        [optionValue]: ref(null)
      }),
      {}
    )
  }

  function setOptionRef(
    el: Element | ComponentPublicInstance | null,
    optionValue: string
  ) {
    if (optionRefs[optionValue]) {
      optionRefs[optionValue].value = el as HTMLElement
    } else optionRefs[optionValue] = ref(el as HTMLElement)
  }
</script>

<style lang="scss" scoped>
  .fr-fieldset__element {
    margin-bottom: 0;
  }

  .fr-fieldset__legend {
    margin-bottom: 0.5rem;
  }

  .fr-form-group {
    margin-bottom: 1.5rem;
  }

  .fr-select:not(:disabled, :read-only) {
    cursor: pointer;
  }

  .menu {
    padding: 1rem;
  }

  .fr-select-group--disabled .fr-select {
    --data-uri-svg: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23929292' d='m12 13.1 5-4.9 1.4 1.4-6.4 6.3-6.4-6.4L7 8.1l5 5z'/%3E%3C/svg%3E");

    background-image: var(--data-uri-svg);
    box-shadow: inset 0 -2px 0 0 var(--border-disabled-grey);
    color: var(--text-disabled-grey);
    cursor: not-allowed;
    opacity: 1;
  }
</style>
