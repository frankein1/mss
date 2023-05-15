<template>
  <div
    class="autocomplete fr-input-group"
    :class="{ 'fr-input-group--error': error }"
  >
    <label
      class="fr-label"
      :for="id"
    >
      {{ displayLabel }}
    </label>
    <input
      :id="id"
      ref="combobox"
      v-model="modelValue"
      class="fr-input"
      :class="{ 'fr-input--error': error }"
      :name="name"
      autocomplete="off"
      aria-autocomplete="list"
      aria-haspopup="listbox"
      aria-expanded="false"
      :aria-controls="listboxId"
      :aria-describedby="ariaDescribedby"
      :aria-activedescendant="activeOptionValue"
      role="combobox"
      @input="onSearch"
      @focus="isFocused = true"
      @keydown="onInputKeyDown"
    />
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

    <ul
      v-show="expanded"
      :id="listboxId"
      ref="listbox"
      class="menu"
      role="listbox"
    >
      <AtomLoader
        v-if="timeout"
        class="fr-mx-auto fr-my-5v"
      />
      <template v-if="!timeout && !fetchResultsError">
        <li
          v-for="([resultValue, resultLabel], index) in results"
          :ref="el => setOptionRef(el, resultValue)"
          :key="resultValue"
          class="menu-item"
          :class="{ 'active-menu-item': index === activeIndex }"
          role="option"
          :aria-selected="value === resultValue"
          @mousedown="onOptionMouseDown"
          @click="onSelectOption(resultValue, index)"
        >
          {{ resultLabel }}
        </li>
      </template>
      <AtomAlert
        v-if="fetchResultsError"
        :alert-type="AlertType.Error"
        :message="error || fetchResultsError"
      />
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { useField } from 'vee-validate'
  import { UNKNOWN_ERROR_MESSAGE } from '~/utils/constants'
  import { AlertType } from '~/utils/constants/alert'
  import { Options } from '~/utils/options'

  const props = withDefaults(
    defineProps<{
      name: string
      label: string
      searchFn: (search: string) => Promise<Options>
      required?: boolean
      value?: string
    }>(),
    {
      required: false,
      value: undefined
    }
  )
  const {
    errorMessage: error,
    value: modelValue,
    setValue
  } = useField<string | null>(props.name)

  const emit = defineEmits<{
    (e: 'resultSelected', value: string): void
  }>()

  const { id, errorId } = useFormFieldId(props.name)
  const listboxId = `autocomplete-${id}-listbox`

  const results = ref<Options>(new Map<string, string>())
  const timeout = ref<NodeJS.Timeout | null>(null)
  const fetchResultsError = ref('')
  const combobox = ref<HTMLInputElement | null>(null)

  const optionRefs: { [key: string]: Ref<HTMLElement | null> } = {}

  const resultValues = computed(() => [...results.value.keys()])

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
  } = useExpandMenu(combobox, resultValues, optionRefs)

  const expanded = computed(
    () => !!(isFocused.value && (results.value.size || timeout.value))
  )

  const displayLabel = computed(() =>
    props.required ? `${props.label} *` : props.label
  )

  const ariaDescribedby = computed(() => (error.value ? errorId : undefined))

  watch(
    () => props.value,
    value => {
      if (!value) {
        return
      }
      setValue(value)
      results.value = new Map()
    }
  )

  function onSearch(event: Event) {
    const input = event.target as HTMLInputElement
    const search = input.value.trim().toLocaleLowerCase()

    if (timeout.value) {
      clearTimeout(timeout.value)
      timeout.value = null
    }
    results.value = new Map()
    fetchResultsError.value = ''

    if (!search) {
      return
    }

    timeout.value = setTimeout(async () => {
      try {
        results.value = await props.searchFn(search)
      } catch {
        fetchResultsError.value = UNKNOWN_ERROR_MESSAGE
      } finally {
        timeout.value = null
      }
    }, 400)
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
      return
    }

    // Keyboard interactions on the expanded listbox
    if (e.key === 'Enter') {
      onSelectOption(activeOptionValue.value)
    }
  }

  /**
   * Set an option value as the selected value
   * @param value The option value to select
   * @param optionIndex Optional - The option index to set as active when selecting from mouse click
   */
  function onSelectOption(optionValue: string, optionIndex?: number) {
    if (optionIndex) {
      activeIndex.value = optionIndex
    }
    setValue(results.value.get(optionValue) || '')
    emit('resultSelected', optionValue)
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
