<template>
  <div>
    <!-- DSFR -->
    <div
      id="header-search"
      class="fr-search-bar"
      role="search"
    >
      <label
        class="fr-label"
        :for="inputId"
      >
        Recherche
      </label>
      <input
        :id="inputId"
        ref="input"
        v-model="inputValue"
        class="fr-input"
        :class="{ empty: modelValue === '' }"
        :placeholder="placeholder"
        type="search"
        :name="name"
        autocomplete="off"
        :aria-labelledby="ariaLabelledby"
        :aria-label="ariaLabel"
        @keydown.prevent.down="handleKeyDown"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      modelValue?: string | number
      name?: string
      placeholder?: string
      ariaLabelledby?: string
      ariaLabel?: string
    }>(),
    {
      modelValue: undefined,
      name: 'search',
      placeholder: 'Rechercher',
      ariaLabelledby: undefined,
      ariaLabel: undefined
    }
  )

  // Emits
  const emit = defineEmits<{
    'update:modelValue': [modelValue: any]
    'handleKeyDown': []
  }>()

  const inputId = useId()

  const inputValue = computed({
    get() {
      return props.modelValue
    },
    set(newValue) {
      emit('update:modelValue', newValue)
    }
  })

  const handleKeyDown = () => {
    emit('handleKeyDown')
  }
</script>

<style lang="scss" scoped>
  .fr-input {
    border-radius: 0.25rem 0.25rem 0 0;
    box-shadow: inset 0 -2px 0 0 var(--border-plain-grey);
  }

  .fr-input.empty {
    background-image: url('@/assets/icons/search.svg');
    background-position: right 1rem top 50%;
    background-repeat: no-repeat;
  }
</style>
