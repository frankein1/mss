<template>
  <ul
    class="fr-btns-group fr-btns-group--inline-sm fr-btns-group--lg fr-btns-group--right"
  >
    <li>
      <button
        class="fr-btn fr-btn--secondary"
        type="button"
        :submitting="isSubmitting"
        :disabled="isSubmitting"
        @click="emit('cancel')"
      >
        Annuler
      </button>
    </li>
    <li>
      <button
        class="fr-btn"
        type="submit"
        :submitting="isSubmitting"
        :disabled="isSubmitting"
      >
        Enregistrer
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
  defineProps<{
    isSubmitting: boolean
    pending: boolean
  }>()

  const emit = defineEmits<{
    cancel: []
  }>()
</script>
