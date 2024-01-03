<template>
  <div
    class="fr-select-group searchable-select"
    :class="{
      'fr-select-group--error': error,
      'multiple': multiple
    }"
  >
    <label
      :id="labelId"
      class="fr-label"
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
        <slot name="hint"></slot>
      </span>
    </label>
    <input
      :id="displayInputId"
      ref="combobox"
      v-model="displayedValue"
      class="fr-select"
      :class="{ 'fr-select--error': error }"
      autocomplete="off"
      aria-autocomplete="list"
      aria-haspopup="listbox"
      aria-expanded="false"
      :aria-controls="listboxId"
      :aria-activedescendant="activeOptionValue"
      :aria-describedby="ariaDescribedby"
      role="combobox"
      @input="onSearch"
      @focus="onInputFocus"
      @keydown="onInputKeyDown"
      @blur="onInputBlur"
    />
    <input
      :id="id"
      ref="hiddenInput"
      :name="name"
      :value="currentValue"
      class="fr-sr-only"
      tabindex="-1"
    />

    <ul
      v-show="expanded"
      :id="listboxId"
      ref="listbox"
      class="menu"
      :class="{ 'fr-tags-group': multiple }"
      role="listbox"
      :aria-multiselectable="multiple"
      :aria-labelledby="labelId"
    >
      <li
        v-for="([optionValue, optionLabel], index) in orderedFilteredOptions"
        :ref="el => setOptionRef(el, optionValue)"
        :key="optionValue"
        :class="{
          'menu-item': !multiple,
          'active-menu-item': !multiple && index === activeIndex
        }"
        role="option"
        :aria-selected="selectedValues.includes(optionValue)"
        @mousedown="onOptionMouseDown"
        @click="onToggleOption(optionValue, index)"
      >
        <template v-if="!multiple">
          {{ optionLabel }}
        </template>
        <template v-else>
          <button
            :id="optionValue"
            type="button"
            class="fr-tag"
            :class="{ 'active-menu-item': index === activeIndex }"
            :name="optionValue"
            :aria-pressed="selectedValues.includes(optionValue)"
            tabindex="-1"
          >
            {{ optionLabel }}
          </button>
        </template>
      </li>
      <li
        v-if="createTagIsDisplayed"
        :ref="optionRefs[NEW_OPTION_ID]"
        :class="{
          'menu-item': !multiple,
          'active-menu-item': !multiple && createTagIsActive,
          'fr-icon-add-circle-line': !multiple
        }"
        role="option"
        @mousedown="onOptionMouseDown"
        @click="onCreateOption"
      >
        <template v-if="!multiple">
          {{ search }}
        </template>
        <template v-else>
          <button
            type="button"
            class="fr-tag fr-icon-add-circle-line fr-tag--icon-left"
            :class="{ 'active-menu-item': createTagIsActive }"
            tabindex="-1"
          >
            {{ search }}
          </button>
        </template>
      </li>
    </ul>
    <div
      v-if="error"
      :id="errorId"
      class="fr-messages-group"
      aria-live="polite"
    >
      <p class="fr-message fr-message--error">
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { NEW_OPTION_PREFIX, NEW_OPTION_ID, Options } from '~/utils/options'

  const props = withDefaults(
    defineProps<{
      label: string
      name: string
      options: Options
      required?: boolean
      hint?: boolean
      multiple?: boolean
      canCreateNewOption?: boolean
    }>(),
    {
      required: false,
      hint: false,
      multiple: false,
      canCreateNewOption: false
    }
  )

  // use `toRef` to create reactive references to `name` prop which is passed to `useField`
  // this is important because vee-validte needs to know if the field name changes
  // https://vee-validate.logaretm.com/v4/guide/composition-api/caveats
  const name = toRef(() => props.name)

  const emit = defineEmits<{
    changeValue: [value: string[] | string]
  }>()

  // we don't provide any rules here because we are using form-level validation
  // https://vee-validate.logaretm.com/v4/guide/validation#form-level-validation
  const {
    value,
    handleChange,
    errorMessage: error
  } = useField<string[] | string>(name, undefined)

  const { id, errorId } = useFormFieldId(name)

  const listboxId = computed(() => `searchable-select-${id.value}-listbox`)
  const displayInputId = computed(
    () => `searchable-select-${id.value}-display-input`
  )
  const labelId = computed(() => `searchable-select-${id.value}-label`)

  const existingOptions = ref<Map<string, string>>(props.options)
  const filteredOptions = ref<Map<string, string>>(existingOptions.value)
  const displayedValue = ref<string>('')
  const combobox = ref<HTMLInputElement | null>(null)
  const selectedValues = ref<string[]>(
    (((props.multiple ? value.value : [value.value]) || []) as string[]).filter(
      v => props.options.has(v)
    )
  )
  const hiddenInput = ref<HTMLInputElement | null>(null)

  const valueIsOption = ref<boolean>(false)
  const preventMenuReopen = ref<boolean>(false)

  const optionRefs = initOptionRefs()

  const expanded = computed<boolean>(
    () =>
      isFocused.value &&
      (!!filteredOptions.value.size || props.canCreateNewOption)
  )

  const ariaDescribedby = computed<string | undefined>(() =>
    error.value ? errorId.value : undefined
  )

  /**
   * The value stored in the hidden input
   */
  const currentValue = computed<string>(() => selectedValues.value.join(','))

  const selectValue = (value: string) => {
    selectedValues.value.push(value)
    changedValues()
  }

  defineExpose({
    selectValue
  })

  const selectedValuesLabels = computed<string>(() =>
    selectedValues.value
      .map(value => existingOptions.value.get(value))
      .join(', ')
  )

  const orderedFilteredOptions = computed<Map<string, string>>(() => {
    if (!props.multiple) {
      return filteredOptions.value
    }
    const optionsAsArray = [...filteredOptions.value.entries()]
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

  const search = computed<string>(() =>
    displayedValue.value.replace(selectedValuesLabels.value + ', ', '').trim()
  )

  const searchAlreadyExists = computed<boolean>(() => {
    return [...orderedFilteredOptions.value.values()].includes(search.value)
  })

  const createTagIsDisplayed = computed(
    () => props.canCreateNewOption && search.value && !searchAlreadyExists.value
  )

  const optionValues = computed<string[]>(() => {
    const _optionValues = [...orderedFilteredOptions.value.keys()]
    if (createTagIsDisplayed.value) {
      _optionValues.push(NEW_OPTION_ID)
    }
    return _optionValues
  })

  const {
    /**
     * For dropdown mode, indicates whether the listbox is expanded or not
     */
    expanded: isFocused,

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
  } = useExpandMenu(combobox, optionValues, optionRefs)

  // FIXME: Somehow, the watcher is not reacting to options changes
  useWatchSelectOptions(() => props.options, selectedValues, changedValues)

  const createTagIsActive = computed(
    () =>
      props.canCreateNewOption &&
      search.value &&
      activeIndex.value === orderedFilteredOptions.value.size
  )

  /**
   * Update the hidden input value
   */
  watch(currentValue, _currentValue => {
    if (!hiddenInput.value) {
      return
    }
    hiddenInput.value.value = _currentValue
    hiddenInput.value.dispatchEvent(new Event('change'))
    hiddenInput.value.closest('form')?.dispatchEvent(new Event('change'))
    setDisplayedValueToSelected()
  })

  watch(expanded, _expanded => {
    // As Vue2 removes attribute when set to a falsy value, it can not directly binded in the template
    combobox.value?.setAttribute('aria-expanded', _expanded.toString())
  })

  onMounted(() => {
    listenFormReset()
    setDisplayedValueToSelected()
  })

  onUnmounted(() => {
    unlistenFormReset()
  })

  function changedValues() {
    handleChange(
      props.multiple ? selectedValues.value : selectedValues.value[0]
    )
    emit(
      'changeValue',
      props.multiple ? selectedValues.value : selectedValues.value[0]
    )
  }

  function listenFormReset() {
    // FIXME: Still useful with vee-validate ?
    hiddenInput.value?.closest('form')?.addEventListener('reset', reset)
  }

  function unlistenFormReset() {
    hiddenInput.value?.closest('form')?.removeEventListener('reset', reset)
  }

  function onSearch(event: Event) {
    valueIsOption.value = false
    const input = event.target as HTMLInputElement

    // When the input is empty, selected values are deselected
    if (!input.value) {
      reset()
    }

    if (!search.value) {
      filteredOptions.value = existingOptions.value
      return
    }

    const filteredOptionsArray = [...existingOptions.value.entries()].filter(
      ([_, label]) =>
        label.toLocaleLowerCase().includes(search.value.toLocaleLowerCase())
    )
    filteredOptions.value = new Map(filteredOptionsArray)
  }

  function onOptionMouseDown() {
    ignoreBlur.value = true
    callFocus.value = true
  }

  function onInputKeyDown(e: KeyboardEvent) {
    if (!expanded.value) {
      if (e.key !== 'Escape') {
        isFocused.value = true
      }
      if (props.multiple && e.key === ' ') {
        e.preventDefault()
        isFocused.value = true
      }
      return
    }

    // Keyboard interactions on the expanded listbox
    if (e.key === 'Enter') {
      if (props.multiple) {
        onToggleOption(activeOptionValue.value)
      } else {
        onSelectActiveOption()
      }
    }
  }

  function onSelectActiveOption() {
    if (!activeOptionValue.value) {
      return
    }

    if (activeOptionValue.value === NEW_OPTION_ID) {
      return onCreateOption()
    }

    if (!props.multiple) {
      selectedValues.value = [activeOptionValue.value]
    } else {
      if (selectedValues.value.includes(activeOptionValue.value)) {
        return
      }
      selectedValues.value.push(activeOptionValue.value)
    }
  }

  /**
   * If the searchable select is not in multiple selection mode, set an option value as the selected value
   * Else add a value to the selected values if it is not present, otherwise remove it from
   * @param value The option value to select or toggle
   * @param optionIndex Optional - The option index to set as active when selecting from mouse click
   */
  function onToggleOption(value: string, optionIndex?: number) {
    if (optionIndex) {
      activeIndex.value = optionIndex
    }

    if (!props.multiple) {
      selectedValues.value = [value]

      /**
       * When toggling an option in a single-option searchable select by clicking on it,
       * we want the menu to close. As the mouse down event on an option has been triggered,
       * the searchable select will force open state using ignoreBlur and callFocus
       * variables. At this stage in the code, ignoreBlur has already been consumed
       * by the callback of the blur event. The focus back to the input has to prevent
       * openning the menu again.
       */
      forceMenuClose()
    } else if (selectedValues.value.includes(value)) {
      selectedValues.value = selectedValues.value.filter(o => o !== value)
    } else {
      selectedValues.value.push(value)
    }
    changedValues()
  }

  function setDisplayedValueToSelected() {
    displayedValue.value = selectedValuesLabels.value

    // Add trailing comma and space for a better user experience
    if (props.multiple && displayedValue.value.length) {
      displayedValue.value += ', '
    }

    valueIsOption.value = true
    filteredOptions.value = existingOptions.value
  }

  function onInputBlur() {
    /**
     * Reinitialize the displayed value when the input is blurred, only if it is
     * not blurred while clicking an option to select it
     */
    if (!ignoreBlur.value && !valueIsOption.value) {
      setDisplayedValueToSelected()
    }
  }

  function onInputFocus() {
    if (!props.multiple) {
      if (preventMenuReopen.value) {
        preventMenuReopen.value = false
      } else {
        isFocused.value = true
      }
    }
  }

  function forceMenuClose() {
    isFocused.value = false
    preventMenuReopen.value = true
  }

  function reset() {
    selectedValues.value = []
  }

  function onCreateOption() {
    const newOptionValue = `${NEW_OPTION_PREFIX}${search.value}`.replace(
      ' ',
      '_'
    )
    existingOptions.value.set(newOptionValue, search.value)
    optionRefs[newOptionValue] = ref(null)
    if (props.multiple) {
      selectedValues.value.push(newOptionValue)
    } else {
      selectedValues.value = [newOptionValue]
    }
    changedValues()
  }

  function initOptionRefs(): { [key: string]: Ref<HTMLElement | null> } {
    const optionValues = [...existingOptions.value.keys()]
    const existingOptionsRefs = optionValues.reduce(
      (optionRefs, optionValue) => ({
        ...optionRefs,
        [optionValue]: ref(null)
      }),
      {}
    )
    if (!props.canCreateNewOption) {
      return existingOptionsRefs
    }
    return { ...existingOptionsRefs, [NEW_OPTION_ID]: ref(null) }
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

<style>
  .searchable-select.multiple .menu {
    padding: 1rem;
  }
</style>
