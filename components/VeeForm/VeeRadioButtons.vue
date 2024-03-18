<template>
  <fieldset
    :id="id"
    class="fr-fieldset"
    :class="{ 'fr-fieldset--error': error }"
    role="group"
    :aria-labelledby="ariaLabelledBy"
  >
    <legend
      :id="legendId"
      class="fr-fieldset__legend--regular fr-fieldset__legend"
      :class="{ 'fr-sr-only': noLabel }"
    >
      {{ label }}
    </legend>
    <div
      v-for="{ value: optionValue, label: optionLabel } in options"
      :key="optionValue"
      class="fr-fieldset__element"
      :class="{
        'fr-fieldset__element--inline': inline
      }"
    >
      <div
        class="fr-radio-group"
        :class="{
          'fr-radio-rich': rich || pictos,
          'fr-radio-rich--only-pictos': !rich && pictos
        }"
      >
        <input
          :id="optionId(optionValue)"
          type="radio"
          :value="optionValue"
          :name="name"
          :checked="optionValue === value"
          :class="{ 'fr-sr-only': asTag }"
          @change="onChange"
        />
        <label
          v-if="!asTag"
          class="fr-label"
          :for="optionId(optionValue)"
        >
          {{ optionLabel }}
        </label>
        <button
          v-else
          class="fr-tag"
          type="button"
          :aria-pressed="optionValue === value"
          tabindex="-1"
        >
          <label :for="optionId(optionValue)">
            {{ optionLabel }}
          </label>
        </button>
        <div
          v-if="pictos && optionValue in pictos"
          class="fr-radio-rich__img"
        >
          <AtomPictogram :path="pictos[optionValue]" />
        </div>
      </div>
    </div>
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
  </fieldset>
</template>

<script setup lang="ts">
  import { useField } from 'vee-validate'
  import type { Options } from '~/utils/options'

  const props = withDefaults(
    defineProps<{
      name: string
      label: string
      options: Options
      pictos?: { [key: string]: string }
      inline?: boolean
      noLabel?: boolean
      asTag?: boolean
      rich?: boolean
    }>(),
    {
      pictos: undefined,
      inline: true,
      asTag: false,
      noLabel: false,
      rich: false
    }
  )

  const emit = defineEmits<{
    changeValue: [value: string]
  }>()

  // we are using toRefs to create reactive references to `name` and `value` props
  // this is important because vee-validate needs to know if any of these props change
  // https://vee-validate.logaretm.com/v4/guide/composition-api/caveats
  const name = toRef(() => props.name)

  const {
    handleChange,
    value,
    errorMessage: error
  } = useField(name, undefined, {
    type: 'radio'
  })

  const { id, errorId } = useFormFieldId(name)

  const legendId = computed(() => `${id.value}-legend`)

  const ariaLabelledBy = computed(() =>
    error.value ? `${legendId.value} ${errorId.value}` : legendId.value
  )

  function optionId(optionValue: string) {
    return `${id.value}-${optionValue}`
  }

  function onChange(event: Event) {
    const input = event.target as HTMLInputElement
    emit('changeValue', input.value)
    handleChange(input.value)
  }
</script>

<style scoped lang="scss">
  button.fr-tag {
    padding: 0;

    > label {
      padding: 0.25rem 0.75rem;
      cursor: pointer;
    }
  }

  // Allows to display the focus on the input on the button
  input.fr-sr-only:focus,
  input.fr-sr-only:focus-visible {
    + button.fr-tag {
      outline: #0a76f6 solid 2px;
      outline-offset: 2px;
    }
  }

  .fr-radio-rich--only-pictos.fr-radio-rich input[type='radio'] {
    left: 0;

    + label {
      background-image: radial-gradient(
        transparent 6px,
        var(--border-action-high-blue-france) 7px,
        transparent 8px
      );
      background-position:
        0 50%,
        0 50%;
      background-repeat: no-repeat, no-repeat;
      background-size:
        1.125rem 1.125rem,
        1.125rem 1.125rem;
      padding: 0.5rem 0.5rem 0.5rem 1.5rem;
      min-height: 3rem;
    }

    &:checked + label {
      background-image: radial-gradient(
          transparent 6px,
          var(--border-active-blue-france) 7px,
          transparent 8px
        ),
        radial-gradient(
          var(--background-active-blue-france) 3px,
          transparent 4px
        );
    }

    ~ .fr-radio-rich__img {
      background: none;
      width: 3rem;
      min-width: 3rem;

      svg {
        max-height: 2.5rem;
        max-width: 2.5rem;
      }
    }
  }
</style>
