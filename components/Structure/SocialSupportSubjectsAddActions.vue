<template>
  <ul
    class="fr-btns-group fr-btns-group--inline-md fr-btns-group--right beneficiaryformactions__btns-group"
  >
    <li>
      <button
        class="fr-btn fr-btn--secondary"
        type="button"
        @click="emit('cancel')"
      >
        Annuler
      </button>
    </li>
    <li>
      <button
        class="fr-btn submit-btn"
        type="submit"
        :submitting="isSubmitting"
        :disabled="isSubmitting"
      >
        Valider
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
  defineProps<{
    isSubmitting: boolean
  }>()

  const emit = defineEmits<{
    // save: []
    cancel: []
  }>()
</script>
