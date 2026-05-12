<template>
  <ul class="fr-btns-group fr-btns-group--right fr-btns-group--inline">
    <li>
      <button
        type="button"
        class="fr-btn fr-btn--secondary"
        :disabled="disablePrevious"
        @click="emit('previous')"
      >
        {{ previousLabel }}
      </button>
    </li>
    <li>
      <button
        type="button"
        class="fr-btn"
        :disabled="disableNext"
        @click="emit('next')"
      >
        {{ nextLabel }}
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
  withDefaults(
    defineProps<{
      previousLabel?: string
      disablePrevious?: boolean
      nextLabel?: string
      disableNext?: boolean
    }>(),
    {
      previousLabel: 'Étape précédente',
      disablePrevious: false,
      nextLabel: 'Étape suivante',
      disableNext: false
    }
  )

  const emit = defineEmits<{
    next: []
    previous: []
  }>()
</script>
