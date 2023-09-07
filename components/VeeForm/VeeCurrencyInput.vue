<template>
  <div
    class="fr-input-group"
    :class="{
      'fr-input-group--error': error,
      'fr-input-group--disabled': readonly
    }"
  >
    <label
      v-if="!noLabel"
      class="fr-label"
      :for="name"
    >
      {{ label }}
    </label>
    <div class="fr-input-wrap">
      <input
        :id="name"
        ref="input"
        :value="value"
        class="fr-input"
        :class="{ 'fr-input--error': error }"
        :name="name"
        placeholder="0.00"
        type="text"
        pattern="[0-9]\d*(\.\d+)?"
        :aria-describedby="ariaDescribedby"
        :aria-labelledby="labelledBy"
        :readonly="readonly"
        @keypress="onKeypress"
        @input="handleChange"
      />
    </div>
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

<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      label: string
      noLabel?: boolean
      labelledBy?: string
      name: string
      readonly?: boolean
    }>(),
    { noLabel: false, labelledBy: undefined, readonly: false }
  )

  const {
    errorMessage: error,
    value,
    handleChange
  } = useField<number>(props.name)

  const errorId = computed(() => `${props.name}-error-desc-error`)
  const ariaDescribedby = computed(() =>
    error.value ? errorId.value : undefined
  )

  function onKeypress(e: Event) {
    const ALLOWED_KEYS = [
      'Backspace',
      'Tab',
      'Enter',
      'Escape',
      'PageUp',
      'PageDown',
      'End',
      'Home',
      'ArrowLeft',
      'ArrowUp',
      'ArrowRight',
      'ArrowDown',
      '.',
      'Delete',
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9'
    ]
    if (!ALLOWED_KEYS.includes((e as KeyboardEvent).key)) {
      e.preventDefault()
    }
  }
</script>

<style lang="scss" scoped>
  .fr-input-wrap::before {
    bottom: 0.75rem;
    margin: auto;
    pointer-events: none;
    position: absolute;
    right: 0.75rem;
    top: 0.75rem;
    content: '€';
    line-height: 1rem;
  }

  .fr-input {
    text-align: right;
    padding-right: 25px;
  }

  .fr-input-group--disabled .fr-input-wrap::before {
    color: var(--text-disabled-grey);
  }
</style>
