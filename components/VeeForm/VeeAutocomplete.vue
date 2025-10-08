<template>
  <div
    class="autocomplete fr-input-group"
    :class="{
      'fr-input-group--error': error,
      'fr-input-group--disabled': disabled
    }"
  >
    <label
      class="fr-label"
      :for="id"
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
      :id="id"
      ref="combobox"
      v-model="modelValue"
      class="fr-input"
      :class="{ 'fr-input--error': error }"
      :name
      :type
      :disabled
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

    <ul
      v-show="expanded"
      :id="listboxId"
      ref="listbox"
      class="menu"
      role="listbox"
    >
      <AtomLoader
        v-if="loading"
        class="fr-mx-auto fr-my-5v"
      />
      <template v-if="!loading && !fetchResultsError">
        <li
          v-for="(
            {
              value: resultValue,
              label: resultLabel,
              disabled: resultIsDisabled
            },
            index
          ) in results"
          :ref="el => setOptionRef(el, resultValue)"
          :key="resultValue"
          class="menu-item"
          :class="{ 'active-menu-item': index === activeIndex }"
          role="option"
          :aria-selected="value === resultValue"
          :aria-disabled="resultIsDisabled || false"
          @mousedown="onOptionMouseDown"
          @click="onSelectOption(resultValue, index)"
        >
          {{ resultLabel }}
          <template v-if="resultIsDisabled">
            <br />
            <span class="fr-text--sm">Elément déjà sélectionné</span>
          </template>
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
  import { useDebounceFn } from '@vueuse/core'
  import { SEARCH_DEFER_MS, UNKNOWN_ERROR_MESSAGE } from '~/utils/constants'
  import { AlertType } from '~/utils/constants/alert'
  import type { OptionsWithDisabled } from '~/utils/options'

  const props = withDefaults(
    defineProps<{
      name: string
      label: string
      type?: string
      searchFn: (search: string) => Promise<OptionsWithDisabled>
      required?: boolean
      disabled?: boolean
      value?: string
      hint?: string
    }>(),
    {
      type: 'search',
      required: false,
      disabled: false,
      value: undefined,
      hint: ''
    }
  )

  // use `toRef` to create reactive references to `name` prop which is passed to `useField`
  // this is important because vee-validte needs to know if the field name changes
  // https://vee-validate.logaretm.com/v4/guide/composition-api/caveats
  const name = toRef(() => props.name)

  const {
    errorMessage: error,
    value: modelValue,
    setValue
  } = useField<string | null>(name)

  const emit = defineEmits<{
    resultSelected: [value: string]
  }>()

  const { id, errorId } = useFormFieldId(name)
  const listboxId = computed(() => `autocomplete-${id.value}-listbox`)

  const results = ref<OptionsWithDisabled>([])
  const loading = ref<boolean>(false)
  const fetchResultsError = ref('')
  const combobox = ref<HTMLInputElement | null>(null)

  const optionRefs: { [key: string]: Ref<HTMLElement | null> } = {}

  const resultValues = computed(() => [...results.value.map(o => o.value)])

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
    () => !!(isFocused.value && (results.value.length || loading.value))
  )

  const ariaDescribedby = computed(() =>
    error.value ? errorId.value : undefined
  )

  watch(
    () => props.value,
    value => {
      if (!value) {
        return
      }
      setValue(value)
      results.value = []
    }
  )

  function onSearch(event: Event) {
    const input = event.target as HTMLInputElement
    const search = input.value.trim()

    results.value = []
    fetchResultsError.value = ''

    if (!search) {
      return
    }

    debouncedFn(search)
  }

  const debouncedFn = useDebounceFn(async (search: string) => {
    try {
      loading.value = true
      results.value = await props.searchFn(search)
    } catch {
      fetchResultsError.value = UNKNOWN_ERROR_MESSAGE
    } finally {
      loading.value = false
    }
  }, SEARCH_DEFER_MS)

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
    const av = activeOptionValue.value
    if (e.key === 'Enter' && av !== undefined) {
      onSelectOption(av)
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
    const o = getOption(results.value, optionValue)
    setValue(o?.label || '')
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
