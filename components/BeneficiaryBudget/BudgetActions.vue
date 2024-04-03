<template>
  <div class="actions-bar bg-color-white">
    <ul
      class="fr-btns-group fr-btns-group--lg fr-btns-group--inline-md fr-btns-group--right"
    >
      <li>
        <button
          class="fr-btn fr-btn--secondary"
          type="button"
          @click="$emit('cancel')"
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
          Enregistrer
        </button>
      </li>

      <li>
        <button
          class="fr-btn submit-btn"
          type="submit"
          :submitting="isSubmitting"
          :disabled="isSubmitting"
        >
          Enregistrer et quitter
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  defineProps<{ isSubmitting: boolean }>()

  defineEmits<{
    cancel: []
  }>()
</script>

<style scoped lang="scss">
  .actions-bar {
    border-top: 1px solid var(--background-default-grey);
    padding: 1.5rem 2rem;
  }

  .fr-btns-group .fr-btn {
    margin-bottom: 0;
  }
</style>
