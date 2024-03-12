<template>
  <div
    class="fr-checkbox-group"
    :class="{ 'fr-checkbox-group--error': error, 'no-label': noLabel }"
  >
    <input
      :id="id"
      type="checkbox"
      :name="name"
      :checked="checked"
      :value="true"
      :aria-describedby="ariaDescribedby"
      :aria-labelledby="labelledBy"
      @input="handleChange"
    />
    <label
      class="fr-label"
      :for="id"
      :title="noLabel ? label : undefined"
    >
      <span :class="{ 'fr-sr-only': noLabel }">
        {{ label }}
        <span
          v-if="required"
          class="color-red"
          >*</span
        >
      </span>
    </label>
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

  const props = withDefaults(
    defineProps<{
      name: string
      label: string
      noLabel?: boolean
      labelledBy?: string
      required?: boolean
    }>(),
    {
      noLabel: false,
      labelledBy: undefined,
      required: false
    }
  )

  // we are using toRefs to create reactive references to `name` and `value` props
  // this is important because vee-validate needs to know if any of these props change
  // https://vee-validate.logaretm.com/v4/guide/composition-api/caveats
  const name = toRef(() => props.name)

  const {
    handleChange,
    checked,
    errorMessage: error
  } = useField(name, undefined, {
    type: 'checkbox',
    checkedValue: true,
    uncheckedValue: false
  })

  const { id, errorId } = useFormFieldId(name)

  const ariaDescribedby = computed(() =>
    error.value ? errorId.value : undefined
  )
</script>

<style lang="scss" scoped>
  .fr-checkbox-group.no-label {
    min-height: 1.5rem;

    .fr-label {
      margin-left: 1.5rem;

      &::before {
        margin-right: 0;
        left: -1.5rem;
      }
    }
  }
</style>
