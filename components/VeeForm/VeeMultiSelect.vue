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
      {{ label }}
      <span
        v-if="required"
        class="color-red"
        >*</span
      >
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
    <input
      :id="id"
      ref="hiddenInput"
      class="fr-sr-only"
      :name="name"
      :value="currentValue"
      :disabled="disabled"
      :readonly="readonly"
      tabindex="-1"
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
        @click="
          !disabledOptions.includes(optionValue) &&
            onToggleOption(optionValue, index)
        "
        @mousedown="onOptionMouseDown"
      >
        <button
          :id="optionValue"
          type="button"
          class="fr-tag"
          :class="[
            index === activeIndex ? 'active-menu-item' : '',
            icons && optionValue in icons
              ? `fr-tag--icon-left ${icons[optionValue]}`
              : ''
          ]"
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
  </div>
</template>

<script setup lang="ts">
  import { useField } from 'vee-validate'
  import { toRef } from 'vue'
  import { Options } from '~/utils/options'

  const props = withDefaults(
    defineProps<{
      label: string
      options: Options
      labelClass?: string
      required?: boolean
      name: string
      dropdown?: boolean
      placeholder?: string
      disabled?: boolean
      readonly?: boolean
      disabledOptions?: string[]
      hint?: string
      icons?: { [key: string]: string }
    }>(),
    {
      labelClass: '',
      required: false,
      dropdown: false,
      placeholder: '',
      disabled: false,
      readonly: false,
      disabledOptions: () => [],
      hint: '',
      icons: undefined
    }
  )

  // use `toRef` to create reactive references to `name` prop which is passed to `useField`
  // this is important because vee-validte needs to know if the field name changes
  // https://vee-validate.logaretm.com/v4/guide/composition-api/caveats
  const name = toRef(() => props.name)

  const emit = defineEmits<{
    changeValue: [value: string[]]
  }>()

  // we don't provide any rules here because we are using form-level validation
  // https://vee-validate.logaretm.com/v4/guide/validation#form-level-validation
  const {
    value,
    handleChange,
    errorMessage: error
  } = useField<string[]>(name, undefined)

  const { id, errorId } = useFormFieldId(name)

  const listboxId = computed(() => `multi-select-${id.value}-listbox`)
  const displayInputId = computed(() => `multi-select-${id.value}-fake-select`)
  const labelId = computed(() => `multi-select-${id.value}-label`)

  const selectedValues = ref<string[]>(
    (value.value || []).filter(v => props.options.has(v))
  )

  const hiddenInput = ref<HTMLInputElement | null>(null)
  const combobox = ref<HTMLDivElement | null>(null)
  const optionRefs = initOptionRefs()

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
      if (aSelected === bSelected) {
        return 0
      }
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

  useWatchSelectOptions(() => props.options, selectedValues, changedValues)

  /**
   * Update the hidden input value
   */
  watch(currentValue, _currentValue => {
    if (!hiddenInput.value) {
      return
    }
    hiddenInput.value.value = _currentValue
    hiddenInput.value.closest('form')?.dispatchEvent(new Event('change'))
  })

  onMounted(() => {
    /**
     * Reset selected value on parent form reset
     */
    listenFormReset()
  })

  onUnmounted(() => {
    unlistenFormReset()
  })

  function changedValues() {
    handleChange(selectedValues.value)
    emit('changeValue', selectedValues.value)
  }

  function listenFormReset() {
    // FIXME: Still useful with vee-validate ?
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
        computed(() => props.disabled || props.readonly),
        toRef(() => props.disabledOptions)
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
    if (optionIndex) {
      activeIndex.value = optionIndex
    }
    if (selectedValues.value.includes(value)) {
      selectedValues.value = selectedValues.value.filter(o => o !== value)
    } else {
      selectedValues.value.push(value)
    }

    changedValues()
  }

  function onInputKeyDown(e: KeyboardEvent) {
    if (!props.dropdown) {
      return
    }

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
    if (
      !activeOptionValue.value ||
      selectedValues.value.includes(activeOptionValue.value) ||
      props.disabledOptions.includes(activeOptionValue.value)
    ) {
      return
    }
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
    } else {
      optionRefs[optionValue] = ref(el as HTMLElement)
    }
  }
</script>

<style lang="scss" scoped>
  .fr-fieldset__element {
    margin-bottom: 0;
  }

  .fr-fieldset__legend {
    margin-bottom: 0.5rem;
  }

  .fr-select:not(:disabled) {
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
