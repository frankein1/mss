<template>
  <div
    class="combobox-wrapper fr-input-group"
    :class="{ 'fr-select-group--error': error }"
  >
    <label
      :id="displayLabelId"
      :for="displayInputId"
      class="combobox-label fr-label"
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
    <div>
      <input
        :id="displayInputId"
        v-model="displayedValue"
        :placeholder
        autocomplete="off"
        class="fr-mt-1w"
        :class="withCreation ? 'fr-input' : 'fr-select'"
        :type="withCreation ? 'text' : 'search'"
        role="combobox"
        aria-autocomplete="list"
        :aria-expanded="openList"
        :aria-controls="gridId"
        :aria-activedescendant="activeDescendant"
        :aria-describedby="ariaDescribedby"
        @keydown="handleKeydown"
        @focus="onFocus"
        @focusout="onFocusOut"
        @input="onInput"
      />
      <ul
        v-if="filteredItems.length"
        v-show="openList"
        :id="gridId"
        class="grid"
        role="grid"
        :aria-labelledby="displayLabelId"
      >
        <li
          v-for="(item, rowIndex) in filteredItems"
          :id="'result-row-' + rowIndex"
          :key="rowIndex"
          class="result-row"
          role="row"
          :class="{ focused: rowIndex === activeRow }"
          @click="selectItem(item)"
        >
          <div
            :id="'result-item-' + rowIndex"
            class="result-cell"
            role="gridcell"
            :class="{
              'focused-cell': rowIndex === activeRow
            }"
          >
            <AtomTextEmphasis
              :name="item.label"
              :input="displayedValue"
            />
          </div>
        </li>
      </ul>
      <!-- Hidden input -->
      <div>
        <label
          type="hidden"
          class="fr-sr-only"
          :for="id"
          >{{ name }}</label
        >
        <input
          :id="id"
          ref="hiddenInput"
          autocomplete="off"
          :name="name"
          type="hidden"
          :value="currentValue"
          class="fr-sr-only"
          tabindex="-1"
        />
      </div>
    </div>
    <!-- Error handler -->
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
  const displayLabelId = computed(() => `searchable-select-${id.value}-label`)
  const displayInputId = computed(
    () => `searchable-select-${id.value}-display-input`
  )
  const gridId = computed(() => `searchable-select-${id.value}-grid`)

  const activeRow = ref(-1)
  const activeCol = ref(0)
  const openList = ref(false)
  const listClicked = ref(false)
  const name = toRef(() => props.name)

  const props = withDefaults(
    defineProps<{
      label: string
      name: string
      placeholder?: string
      options: Options
      required?: boolean
      hint?: string
      withCreation?: boolean
    }>(),
    {
      required: false,
      hint: undefined,
      placeholder: undefined,
      withCreation: false
    }
  )

  const emit = defineEmits<{
    changeValue: [value: string]
  }>()

  const ariaDescribedby = computed<string | undefined>(() =>
    error.value ? errorId.value : undefined
  )

  // HIDDEN INPUT
  const {
    value: initialValueId,
    handleChange,
    errorMessage: error
  } = useField<string>(name, undefined)

  const hiddenInput = ref<HTMLInputElement | null>(null)
  const currentValue = ref(initialValueId) // get current from form
  const displayedValue = ref('')
  const { id, errorId } = useFormFieldId(name)

  onMounted(() => {
    displayedValue.value = getDislayValue(currentValue.value)
  })

  const onInput = (_event: Event) => {
    if (props.withCreation) {
      emit('changeValue', displayedValue.value)
      handleChange(displayedValue.value)
      return
    }
    if (props.required && displayedValue.value == '') {
      // Display an error if input is empty but required
      emit('changeValue', '')
      handleChange(null)
    }
    if (!props.required && displayedValue.value == '') {
      currentValue.value = ''
    }
  }

  const getDislayValue = (id: string) => {
    const option = props.options.find(obj => obj.value === id)
    return option ? option.label : ''
  }

  // VISIBLE INPUT
  const filteredItems = computed(() => {
    if (!displayedValue.value) {
      return props.options
    }
    return filterItems()
  })

  const filterItems = () => {
    return props.options.filter(obj => {
      return obj.label
        .toLowerCase()
        .includes(displayedValue.value.toLowerCase())
    })
  }

  const activeDescendant = computed(() => {
    if (activeRow.value >= 0) {
      return `result-item-${activeRow.value}x${activeCol.value}`
    }
    return ''
  })

  function updateResults() {
    activeRow.value = -1
    activeCol.value = 0
  }

  function selectItem(value: OptionType) {
    listClicked.value = true //listen click on list
    currentValue.value = value.value
    displayedValue.value = value.label
    activeRow.value = -1
    openList.value = false
    emit('changeValue', value.value)
    handleChange(value.value)
  }

  const onFocus = () => {
    openList.value = true
    updateResults()
  }

  const onFocusOut = (_e: FocusEvent) => {
    // wait for the event on listItems
    setTimeout(() => {
      let gridisActive = false
      const listelements = document.getElementsByClassName('result-row')
      Array.from(listelements).forEach((element: Element) => {
        if (element.matches(':hover')) {
          gridisActive = true
        }
      })
      if (!gridisActive) {
        openList.value = false
        activeRow.value = -1
      }
      if (
        (currentValue.value == '' || currentValue.value == null) &&
        !listClicked.value &&
        !props.withCreation
      ) {
        displayedValue.value = ''
      }
    }, 200)
    listClicked.value = false // reset click on list
  }

  function handleKeydown(e: KeyboardEvent) {
    openList.value = true
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        activeRow.value = (activeRow.value + 1) % filteredItems.value.length
        break
      case 'ArrowUp':
        e.preventDefault()
        activeRow.value =
          activeRow.value <= 0
            ? filteredItems.value.length - 1
            : activeRow.value - 1
        break
      case 'ArrowLeft':
        e.preventDefault()
        activeCol.value = activeCol.value <= 0 ? 1 : activeCol.value - 1
        break
      case 'ArrowRight':
        e.preventDefault()
        activeCol.value = (activeCol.value + 1) % 2
        break
      case 'Enter': {
        const ar = activeRow.value
        e.preventDefault()
        if (ar >= 0 && filteredItems.value[ar]) {
          selectItem(filteredItems.value[ar])
          openList.value = false
        }
        break
      }
      case ' ': {
        const ar = activeRow.value
        if (ar >= 0 && filteredItems.value[ar]) {
          selectItem(filteredItems.value[ar])
          openList.value = false
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

  watch(activeRow, newIndex => {
    if (newIndex >= 0) {
      const el = document.getElementById(`result-row-${newIndex}`)
      el?.scrollIntoView({ block: 'nearest' })
    }
  })
</script>

<style lang="scss" scoped>
  @use '~/assets/style/variables' as *;

  input[type='search'] {
    background-image:
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z'%3E%3C/path%3E%3C/svg%3E"),
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z'%3E%3C/path%3E%3C/svg%3E");
    background-position:
      10px 12px,
      calc(100% - 14px) 12px;
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

  .hidden-box {
    display: none;
  }

  ul.grid {
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

  .result-row {
    width: 100%;
    cursor: default;
    margin: 0;
    padding: 0;
  }

  .result-cell {
    display: inline-block;
    cursor: default;
    margin: 0;
    padding: 0.5rem 0.25rem;
  }

  .result-row:hover,
  .result-row.focused {
    background-color: var(--primary-light-hover);
  }

  .focused-cell {
    outline: dotted 1px rgb(0 0 0 / 32%);
  }
</style>
