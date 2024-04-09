<template>
  <div class="actions-bar bg-color-white">
    <BudgetActions
      :is-submitting="isSubmitting"
      :cancel-label="cancelLabel"
      :confirm-label="confirmLabel"
      :has-secondary-action="hasSecondaryAction"
      :confirm-secondary-label="confirmSecondaryLabel"
      @cancel="$emit('cancel')"
    />
  </div>
</template>

<script setup lang="ts">
  withDefaults(
    defineProps<{
      isSubmitting: boolean
      cancelLabel?: string
      confirmLabel: string
      hasSecondaryAction?: boolean
      confirmSecondaryLabel?: string
    }>(),
    {
      cancelLabel: 'Annuler',
      confirmLabel: 'Enregistrer et quitter',
      hasSecondaryAction: false,
      confirmSecondaryLabel: undefined
    }
  )

  defineEmits<{
    cancel: []
  }>()
</script>

<style scoped lang="scss">
  .actions-bar {
    border-top: 1px solid var(--background-default-grey);
    padding: 1.5rem 2rem;
  }

  // .fr-btns-group .fr-btn {
  //   margin-bottom: 0;
  // }
</style>
