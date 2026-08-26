<template>
  <div
    class="multiselect fr-select-group"
    :class="{
      'fr-select-group--error': error,
      'fr-select-group--disabled': disabled
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
      <template v-if="tooltip">
        <button
          :aria-describedby="tooltipId"
          type="button"
          class="fr-btn--tooltip fr-btn"
        >
          infobulle
        </button>
        <span
          :id="tooltipId"
          class="fr-tooltip fr-placement"
          role="tooltip"
          >{{ tooltip }}</span
        >
        <span class="fr-sr-only">{{ tooltip }}</span>
      </template>

      <span
        v-if="hint"
        class="fr-hint-text"
      >
        {{ hint }}
      </span>
    </label>
    <!-- input sectionnable -->
    <input
      :id="displayInputId"
      ref="input"
      class="fr-select"
      :name="name"
      :placeholder
      type="text"
      :value="selectedOptionInputValue"
      readonly
      :aria-describedby="ariaDescribedby"
      :aria-labelledby="ariaLabelledBy"
      :disabled="disabled"
      @click="isOpen = !isOpen"
      @keydown.prevent.space="isOpen = !isOpen"
      @keydown.prevent.esc="isOpen = false"
    />
    <!-- dropdown -->
    <Transition name="fade-in">
      <div
        v-if="isOpen"
        ref="target"
        :class="[
          'multiselect-content',
          optionsClass,
          { 'dropdown-relative': !dropdownOver }
        ]"
        @keydown.prevent.esc="isOpen = false"
      >
        <!-- bloc principal -->
        <div class="px-4 pt-4">
          <!-- Champ de recherche -->
          <MultiSelectSearch
            v-if="isSearchable"
            ref="multiselectSearch"
            v-model="optionQuery"
            placeholder="Rechercher"
            :aria-labelledby="`label-search-${labelSearchId}`"
            class="fr-mt-3"
            @update:model-value="handleChangeSearchValues"
            @handle-key-down="handleSearchInputKeyDown"
          />

          <!-- List des items -->
          <div
            ref="scrollContainer"
            class="scroll-container show-scrollbar custom-scrollbar-gray"
          >
            <div class="content">
              <div
                v-if="options.length == 0"
                class=""
              >
                Aucun résultat avec les filtres actuels.
              </div>

              <fieldset
                class="fieldset"
                style="min-inline-size: auto"
              >
                <legend class="fr-sr-only">
                  {{ label }}
                </legend>

                <!-- Boucle -->
                <div
                  v-for="option in displayedOptions"
                  :key="option.value"
                  class="option-item"
                >
                  <MultiSelectCheckbox
                    :id="option.value"
                    :option="option"
                    :checked="isOptionChecked(multiselectValue, option)"
                    :disabled="
                      disabled ? true : isDisabled(disabledOptions, option)
                    "
                    @change-value="handleOptionToggle(option)"
                    @handle-key-down="handleFocusNextCheckbox"
                    @handle-key-up="handleFocusPreviousCheckbox"
                  >
                    <template #checkbox-label>
                      <slot
                        name="checkbox-label"
                        :option
                      >
                        {{ option.label }}
                      </slot>
                    </template>
                    <template #checkbox-after-label>
                      <slot
                        name="checkbox-after-label"
                        :option
                      ></slot>
                    </template>
                  </MultiSelectCheckbox>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
    </Transition>
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

<script lang="ts" setup>
  import type { Options, OptionType } from '~/utils/options'
  import { onClickOutside } from '@vueuse/core'
  import { useField } from 'vee-validate'
  import { formatSearchPattern } from '~/utils'

  const props = withDefaults(
    defineProps<{
      name: string
      options: Options
      disabledOptions?: string[] | null
      label?: string | null
      placeholder?: string
      optionsClass?: string
      ariaDescribedby?: string
      ariaLabelledBy?: string
      isSearchable?: boolean
      required?: boolean
      hint?: string
      dropdownOver?: boolean
      disabled?: boolean
      tooltip?: string
    }>(),
    {
      optionsClass: '',
      disabledOptions: null,
      label: '',
      placeholder: '',
      optionValueResolver: null,
      ariaDescribedby: '',
      ariaLabelledBy: '',
      isSearchable: true,
      required: false,
      hint: '',
      dropdownOver: true,
      disabled: false,
      tooltip: undefined
    }
  )

  // Ref
  const isOpen = ref<boolean>(false)
  const optionQuery = ref<any>(null)
  const existingOptions = ref<Options>(props.options)
  const filteredOptions = ref<Options>(existingOptions.value)
  const target = ref(null)
  const name = toRef(() => props.name)
  const labelSearchId = useId()

  // Emits
  const emit = defineEmits<{
    changeValue: [value: string[]]
  }>()

  // Form functions
  const {
    value: multiselectValue,
    handleChange,
    errorMessage: error
  } = useField<string[]>(name, undefined)

  const { id, errorId } = useFormFieldId(name)

  const displayInputId = computed(() => `multi-select-${id.value}-fake-select`)
  const labelId = computed(() => `multi-select-${id.value}-label`)
  const tooltipId = computed(() => `multi-select-${id.value}-tooltip`)

  const convertValuesToOptions = (initialValues: string[] | null): Options => {
    if (initialValues == null) {
      return []
    }
    return existingOptions.value.filter(option =>
      initialValues.includes(option.value)
    )
  }

  const convertOptionsToValues = (options: Options): string[] => {
    return options.map(option => option.value)
  }
  const convertValuesToLabels = (initialValues: string[] | null): string[] => {
    if (initialValues == null) {
      return []
    }
    const options = convertValuesToOptions(initialValues)
    return options.map(option => option.label)
  }

  // Computed
  const selectedOptions = computed(() =>
    convertValuesToOptions(multiselectValue.value)
  )

  const selectedOptionInputValue = computed(() => {
    const labels = convertValuesToLabels(multiselectValue.value)
    if (labels.length === 0) {
      return null
    }
    return labels.join(', ')
  })

  const displayedOptions: ComputedRef<Options> = computed(() => {
    const selectedValues = selectedOptions.value.map(option => option.value)
    const availableOptions = filteredOptions.value.filter(
      option => !selectedValues.includes(option.value)
    )
    return [...selectedOptions.value, ...availableOptions]
  })

  // Functions
  const handleOptionToggle = (option: any) => {
    const index = selectedOptions.value.findIndex(
      selectedOption => selectedOption.value === option.value
    )
    if (index === -1) {
      selectedOptions.value.push(option)
      emit(
        'changeValue',
        selectedOptions.value.map(option => option.value)
      )
    } else {
      selectedOptions.value.splice(index, 1)
      emit(
        'changeValue',
        selectedOptions.value.map(option => option.value)
      )
    }
    handleChange(convertOptionsToValues(selectedOptions.value))
  }

  const handleChangeSearchValues = (optionQuery: string) => {
    const filteredOptionsArray = [...existingOptions.value].filter(
      ({ label }) =>
        formatSearchPattern(label.toLocaleLowerCase()).includes(
          formatSearchPattern(optionQuery.toLocaleLowerCase())
        )
    )
    filteredOptions.value = filteredOptionsArray
  }

  const isOptionChecked = (
    selectedValues: string[] | null,
    option: OptionType
  ) => {
    if (selectedValues == null) {
      return false
    }
    return selectedValues.find(value => value == option.value) != null
  }

  const isDisabled = (
    disabledOptions: string[] | null,
    option: OptionType
  ): boolean => {
    if (disabledOptions == null) {
      return false
    }
    return disabledOptions.find(item => item === option.value) != null
  }

  // Keyboard interactions on the expanded listbox
  const handleSearchInputKeyDown = () => {
    document
      .querySelector<HTMLElement>(`#${displayedOptions.value[0]?.value}`)
      ?.focus()
  }

  const handleFocusNextCheckbox = () => {
    const checkboxes = getAllCheckbox()
    const activeElement = document.activeElement as HTMLElement
    const currentIndex = Array.from(checkboxes).indexOf(activeElement)

    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % checkboxes.length
      checkboxes[nextIndex]?.focus()
    }
  }

  const handleFocusPreviousCheckbox = () => {
    const checkboxes = getAllCheckbox()
    const activeElement = document.activeElement as HTMLElement
    const currentIndex = Array.from(checkboxes).indexOf(activeElement)

    if (currentIndex !== -1) {
      const previousIndex =
        (currentIndex - 1 + checkboxes.length) % checkboxes.length
      checkboxes[previousIndex]?.focus()
    }
  }

  const getAllCheckbox = (): NodeListOf<HTMLElement> =>
    document.querySelectorAll(`input.input-checkbox:not([disabled])`)

  /** Trigger the selection of an option through the parent component */
  const triggerSelectValue = (value: string) => {
    const label = existingOptions.value.find(o => o.value === value)?.label
    if (label) {
      handleOptionToggle({ label, value })
    }
  }

  defineExpose({ triggerSelectValue })

  onClickOutside(target, _event => {
    isOpen.value = false
  })
</script>

<style lang="scss" scoped>
  .multiselect {
    position: relative;

    label > .fr-btn--tooltip {
      position: absolute;
      top: -3px;
    }

    .multiselect-content {
      min-height: 1.5rem;
      box-shadow: 0 4px 12px 0 #00001229;
      border-width: 1px;
      padding: 1em;
      list-style-type: none;
      margin: 0;
      z-index: 600;
      position: absolute;
      width: 100%;
      background: #fff;

      &.dropdown-relative {
        position: relative;
      }
    }

    .scroll-container {
      overflow-y: auto;
      overscroll-behavior: contain;
      max-height: 254px;
      padding-bottom: 0.75rem;
      margin: 0;
      margin-top: 1rem;

      .content {
        fieldset {
          position: relative;
          min-inline-size: auto;
          border: none;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 0.5rem;
        }

        .option-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }
      }
    }
  }

  // scroll-bar
  $base-width: 8px;

  .custom-scrollbar-gray::-webkit-scrollbar {
    width: $base-width;
  }

  .custom-scrollbar-gray::-webkit-scrollbar-track {
    border-radius: $base-width;
    border-width: 0;
    background-color: var(--background-contrast-grey);
  }

  .custom-scrollbar-gray::-webkit-scrollbar-thumb {
    border-radius: $base-width;
    border-width: 0;
    background-color: var(--background-contrast-grey-active);
  }

  .fade-in-leave-active,
  .fade-in-enter-active {
    transition: all 0.15s ease;
  }

  .fade-in-enter-from,
  .fade-in-leave-to {
    transform: translateY(20px);
    opacity: 0;
  }
</style>
