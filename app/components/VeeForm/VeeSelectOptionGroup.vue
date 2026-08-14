<template>
  <div
    class="fr-select-group"
    :class="{
      'fr-select-group--error': error,
      'fr-select-group--disabled': disabled
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
    </label>
    <select
      :id="id"
      class="fr-select"
      :class="{ 'fr-select--error': error }"
      :name="name"
      :aria-describedby="ariaDescribedby"
      :disabled="disabled"
      @change="onChange"
    >
      <option
        value=""
        :selected="!value"
      />
      <optgroup
        v-for="group in groups"
        :key="group.label"
        :label="group.label"
      >
        <option
          v-for="option in group.options"
          :key="option.value"
          :value="option.value"
          :selected="option.value === value"
        >
          {{ option.label }}
        </option>
      </optgroup>
    </select>
    <input
      v-if="disabled"
      :name="name"
      :aria-describedby="ariaDescribedby"
      :value="value"
      hidden
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
  </div>
</template>

<script lang="ts" setup>
  import { useField } from 'vee-validate'
  import type { OptionGroups } from '~/utils/options'

  const props = withDefaults(
    defineProps<{
      label: string
      name: string
      groups: OptionGroups
      required?: boolean
      disabled?: boolean
    }>(),
    {
      required: false,
      disabled: false
    }
  )

  const name = toRef(() => props.name)

  const { errorMessage: error, value, handleChange } = useField<string>(name)

  const { id, errorId } = useFormFieldId(name)

  const ariaDescribedby = computed(() =>
    error.value ? errorId.value : undefined
  )

  function onChange(event: Event) {
    handleChange(event)
  }
</script>
