<template>
  <AtomActionsBar>
    <BudgetActions
      :is-submitting="isSubmitting"
      :cancel-label="cancelLabel"
      :confirm-label="confirmLabel"
      :has-secondary-action="hasSecondaryAction"
      :confirm-secondary-label="confirmSecondaryLabel"
      @cancel="$emit('cancel')"
    />
  </AtomActionsBar>
</template>

<script setup lang="ts">
  withDefaults(
    defineProps<{
      isSubmitting: boolean
      cancelLabel?: string
      confirmLabel?: string
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
