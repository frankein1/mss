<template>
  <div class="multiselect">
    <!-- input sectionnable -->
    <input
      ref="input"
      class="fr-select"
      :name="name"
      :placeholder="legend || ''"
      type="text"
      :value="selectedOptionInputValue"
      readonly
      :aria-describedby="ariaDescribedby"
      :aria-labelledby="ariaLabelledBy"
      @click="isOpen = !isOpen"
      @keydown.esc="isOpen = false"
    />
    <!-- dropdown -->
    <Transition name="fade-in">
      <div
        v-if="isOpen"
        ref="target"
        :class="['multiselect-content', optionsClass]"
        @keydown.esc="isOpen = false"
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
          />

          <!-- List des items -->
          <div
            ref="scrollContainer"
            class="scroll-container show-scrollbar"
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
                  {{ legend }}
                </legend>

                <!-- Boucle -->
                <div
                  v-for="option in displayedOptions"
                  :key="option.value"
                  class="option-item"
                >
                  <input
                    :id="option.value"
                    type="checkbox"
                    :name="option.value"
                    :label="option.label"
                    :checked="
                      multiselectValue.find(
                        selected => selected == option.value
                      ) != null
                    "
                    @change="handleOptionToggle(option)"
                  />
                  <label :for="option.value">{{ option.label }}</label>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import type { Options } from '~/utils/options'
  import { onClickOutside } from '@vueuse/core'
  import { useField, useForm } from 'vee-validate'

  const props = withDefaults(
    defineProps<{
      name: string
      options: Options
      legend?: string | null
      optionsClass?: string
      ariaDescribedby?: string
      ariaLabelledBy?: string
      optionValueResolver?: any
      isSearchable?: boolean
    }>(),
    {
      optionsClass: '',
      legend: '',
      optionValueResolver: null,
      ariaDescribedby: '',
      ariaLabelledBy: '',
      isSearchable: false
    }
  )

  // Ref
  const isOpen = ref<boolean>(false)
  const optionsHits = ref<any>(null)
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
  const { value: multiselectValue, handleChange } = useField<string[]>(
    name,
    undefined
  )

  const convertToOptions = (initialValues: string[]): Options => {
    return existingOptions.value.filter(option =>
      initialValues.includes(option.value)
    )
  }

  const convertToFormValue = (options: Options): string[] => {
    return options.map(option => option.value)
  }

  const selectedOptions = ref<Options>(convertToOptions(multiselectValue.value))

  // Computed
  const selectedOptionInputValue = computed(() => {
    if (selectedOptions.value.length === 0) {
      return null
    }
    return selectedOptions.value.map(option => option.label).join(', ')
  })

  const displayedOptions: globalThis.ComputedRef<Options> = computed(() => {
    const selectedValues = selectedOptions.value.map(option => option.value)
    const availableOptions = filteredOptions.value.filter(
      option => !selectedValues.includes(option.value)
    )
    return [...selectedOptions.value, ...availableOptions]
  })

  // Functions
  const handleOptionToggle = (option: any) => {
    // TODO: do we need emit?
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
    handleChange(convertToFormValue(selectedOptions.value))
  }

  const handleChangeSearchValues = (optionQuery: string) => {
    if (!optionQuery || optionQuery === '') {
      optionsHits.value = null
    }

    const filteredOptionsArray = [...existingOptions.value].filter(
      ({ label }) =>
        label.toLocaleLowerCase().includes(optionQuery.toLocaleLowerCase())
    )
    filteredOptions.value = filteredOptionsArray
  }

  onClickOutside(target, _event => {
    isOpen.value = false
  })

  onMounted(() => {
    //
  })
  onBeforeMount(() => {
    //
  })
</script>

<style lang="scss" scoped>
  .multiselect {
    position: relative;
    .multiselect-content {
      min-height: 1.5rem;
      box-shadow: 0px 4px 12px 0px #00001229;
      border-width: 1px;
      padding: 1em;
      list-style-type: none;
      margin: 0;
      z-index: 600;
      position: absolute;
      width: 100%;
      background: #fff;
      width: 100%;
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
        }
        .option-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
      }
    }
  }

  // Transition
  // TODO
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

<style lang="scss">
  .option-item {
    input[type='checkbox'] + label {
      margin-left: 1rem;
    }
    input[type='checkbox'] + label:before {
      top: 0.3rem;
      width: 1rem;
      height: 1rem;
      left: -1.5rem;
    }
  }
</style>
