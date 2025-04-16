<script lang="ts" setup>
  import { computed, ref, useAttrs } from 'vue'
  import type { Ref } from 'vue'
  import { useRandomId, type DsfrInputProps } from '@gouvminint/vue-dsfr'

  defineOptions({
    inheritAttrs: false
  })

  const props = withDefaults(defineProps<DsfrInputProps>(), {
    id: () => useRandomId('basic', 'input'),
    descriptionId: undefined,
    hint: '',
    label: '',
    labelClass: '',
    modelValue: '',
    wrapperClass: ''
  })

  defineEmits<{ (e: 'update:modelValue', payload: string): void }>()

  const attrs = useAttrs()

  const __input: Ref<HTMLElement | null> = ref(null)
  const items = useTemplateRef('items')

  const suggestions: Ref<string[]> = ref([])

  async function searchFn() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return ['Hello', 'I am what I write', 'Echoes', 'Part II', 'Music']
  }
  const focus = () => __input.value?.focus()

  const wrapper = computed(
    () => props.isWithWrapper || attrs.type === 'date' || !!props.wrapperClass
  )

  const finalLabelClass = computed(() => [
    'fr-label',
    { invisible: !props.labelVisible },
    props.labelClass
  ])

  const expanded = ref(false)
  const model = defineModel<(string | number)[]>({ required: true })
  const hostWidth = ref(0)

  const message = computed(() => {
    return props.errorMessage || props.successMessage
  })
  const messageType = computed(() => {
    return props.errorMessage ? 'error' : 'valid'
  })

  const observations: (() => void)[] = []

  const { collapse, collapsing, cssExpanded, doExpand, onTransitionEnd } =
    useCollapsable()

  const isVisible = ref(false)

  function handleKeyDownEscape(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      close()
    }
  }

  function onArrowDown(event: KeyboardEvent) {
    if (items.value === null || items.value.length === 0) {
      return
    }
    const eventTarget = event.target
    if (eventTarget === null || !(eventTarget instanceof Element)) {
      return
    }
    const currentFocusedElement = eventTarget?.parentElement
    const currentFocusedIndex = items.value.findIndex(
      el => el === currentFocusedElement
    )
    const nextFocusedIndex = (currentFocusedIndex + 1) % items.value.length
    const nextFocusedElement = items.value[nextFocusedIndex].children[0]
    if (!nextFocusedElement || !(nextFocusedElement instanceof HTMLElement)) {
      return
    }
    nextFocusedElement.focus()
  }

  function onArrowUp(event: KeyboardEvent) {
    if (items.value === null || items.value.length === 0) {
      return
    }
    const eventTarget = event.target
    if (eventTarget === null || !(eventTarget instanceof Element)) {
      return
    }
    const currentFocusedElement = eventTarget?.parentElement
    const currentFocusedIndex = items.value.findIndex(
      el => el === currentFocusedElement
    )
    const nextFocusedIndex =
      (currentFocusedIndex - 1 + items.value.length) % items.value.length
    const nextFocusedElement = items.value[nextFocusedIndex].children[0]
    if (!nextFocusedElement || !(nextFocusedElement instanceof HTMLElement)) {
      return
    }
    nextFocusedElement.focus()
  }

  function handleClickOutside(event: MouseEvent) {
    const element = event.target as HTMLElement
    if (
      !__input.value?.contains(element) &&
      !collapse.value?.contains(element)
    ) {
      close()
    }
  }

  function observeElementSize(
    element: HTMLElement,
    callback: (element: HTMLElement, entry: ResizeObserverEntry) => void
  ) {
    if (window.ResizeObserver) {
      const resizeObserver = new window.ResizeObserver(entries => {
        for (const entry of entries) {
          callback(element, entry)
        }
      })

      resizeObserver.observe(element)

      return () => {
        resizeObserver.unobserve(element)
        resizeObserver.disconnect()
      }
    }
    return () => {}
  }

  function updateSize(element: HTMLElement) {
    const rect = element.getBoundingClientRect()
    if (rect.width !== hostWidth.value) {
      hostWidth.value = rect.width
    }
  }

  function open() {
    expanded.value = true
    isVisible.value = true
    if (__input.value) {
      observations.push(observeElementSize(__input.value, updateSize))
    }
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleKeyDownEscape)
    setTimeout(() => {
      doExpand(true)
    }, 100)
  }

  function close() {
    expanded.value = false
    doExpand(false)
    setTimeout(() => {
      isVisible.value = false
    }, 300)
    clean()
  }

  const handleClick = async () => {
    if (isVisible.value) {
      close()
    } else {
      open()
    }
  }

  function clean() {
    while (observations.length) {
      const observation = observations.pop()
      if (observation) {
        observation()
      }
    }
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleKeyDownEscape)
  }

  async function onInput(event) {
    await searchFn().then(result => {
      suggestions.value = result
    })
    open()
  }

  defineExpose({
    focus
  })
</script>

<template>
  <div class="fr--select-group fr-select-group">
    <label
      :class="finalLabelClass"
      :for="id"
    >
      <!-- @slot Slot pour personnaliser tout le contenu de la balise <label> -->
      <slot name="label">
        {{ label }}
        <!-- @slot Slot pour indiquer que le champ est obligatoire. Par défaut, met une astérisque si `required` est à true (dans un `<span class="required">`) -->
        <slot name="required-tip">
          <span
            v-if="'required' in $attrs && $attrs.required !== false"
            class="required"
            >*</span
          >
        </slot>
      </slot>

      <span
        v-if="hint"
        class="fr-hint-text"
        >{{ hint }}</span
      >
    </label>

    <input
      v-if="!wrapper"
      :id="id"
      v-bind="$attrs"
      ref="__input"
      class="fr-input"
      :class="{
        'fr-input--error': isInvalid,
        'fr-input--valid': isValid
      }"
      :aria-describedby="descriptionId || undefined"
      @input="onInput"
      @keydown.down.prevent="onArrowDown"
    />
    <!-- collapse -->
    <div
      v-if="isVisible"
      :id="`${props.id}-collapse`"
      ref="collapse"
      :style="{
        '--width-host': `${hostWidth}px`
      }"
      class="fr-multiselect__collapse fr-collapse mss-collapse"
      :class="{
        'fr-collapse--expanded': cssExpanded,
        'fr-collapsing': collapsing
      }"
      @transitionend="onTransitionEnd(expanded)"
    >
      <p
        :id="`${id}-text-hint`"
        class="fr-sr-only"
      >
        Utilisez la tabulation (ou les touches flèches) pour naviguer dans la
        liste des suggestions
      </p>
      <ul class="fr-btns-group">
        <li
          v-for="suggestion in suggestions"
          ref="items"
        >
          <button
            class="autocomplete-suggestion"
            @keydown.down.prevent="onArrowDown"
            @keydown.up.prevent="onArrowUp"
          >
            {{ suggestion }}
          </button>
        </li>
      </ul>
      <!-- <DsfrFieldset
        :id="`${props.id}-checkboxes`"
        class="fr-multiselect__collapse__fieldset"
        aria-live="polite"
        :style="{ '--maxOverflowHeight': `${props.maxOverflowHeight}` }"
        :legend="props.legend"
        :legend-id="`${props.id}-checkboxes-legend`"
      >
        <slot name="legend" />
        <div
          v-for="option in filteredOptions"
          :key="`${generateId(option as T, id, props.idKey)}-checkbox`"
          class="fr-fieldset__element"
        >
          <div class="fr-checkbox-group fr-checkbox-group--sm">
            <DsfrCheckbox
              :id="`${generateId(option as T, id, props.idKey)}-checkbox`"
              v-model="model"
              :value="getValueOrId(option as T, props.idKey)"
              :name="`${generateId(option as T, id, props.idKey)}-checkbox`"
              small
              @keydown.down="handleFocusNextCheckbox"
              @keydown.right="handleFocusNextCheckbox"
              @keydown.up="handleFocusPreviousCheckbox"
              @keydown.left="handleFocusPreviousCheckbox"
              @keydown.tab="handleFocusNextElementUsingTab"
            >
              <template #label>
                <slot
                  name="checkbox-label"
                  :option="option as T"
                >
                  {{ getValueOrId(option as T, props.labelKey) }}
                </slot>
              </template>
            </DsfrCheckbox>
          </div>
        </div>
      </DsfrFieldset> -->
      <div v-if="suggestions.length === 0">
        <slot name="no-results"> Pas de résultat </slot>
      </div>
      <!-- end collapse -->
    </div>

    <!-- <div
    v-else
    :class="[
      { 'fr-input-wrap': isWithWrapper || $attrs.type === 'date' },
      wrapperClass
    ]"
  >
    <input
      :id="id"
      v-bind="$attrs"
      ref="__input"
      class="fr-input"
      :class="{
        'fr-input--error': isInvalid,
        'fr-input--valid': isValid
      }"
      :value="modelValue"
      :aria-describedby="descriptionId || undefined"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div> -->
  </div>
</template>

<style scoped>
  .invisible {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .mss-collapse {
    z-index: 1;
    transform-origin: 0 0;
    width: var(--width-host);
    background-color: var(--background-overlap-grey);
    filter: drop-shadow(var(--overlap-shadow));
    margin-top: 0.25rem;
    padding: 1rem;
    position: absolute;
  }

  .fr-btns-group > li > button {
    width: 100%;
    text-align: left;
  }

  .fr-btns-group > li > button:focus {
    background-color: var(--hover-tint);
  }
</style>
