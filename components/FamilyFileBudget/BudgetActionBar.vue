<template>
  <AtomActionsBar>
    <BudgetActions
      :is-submitting="isSubmitting"
      :cancel-label="cancelLabel"
      :confirm-label="confirmLabel"
      :has-secondary-action="hasSecondaryAction"
      :confirm-secondary-label="confirmSecondaryLabel"
      :confirm-secondary-class="confirmSecondaryClass"
      :confirm-secondary-type="confirmSecondaryType"
      @cancel="$emit('cancel')"
      @secondary-action="$emit('delete')"
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
      confirmSecondaryClass?: string
      confirmSecondaryType?: 'button' | 'submit' | 'reset' | undefined
    }>(),
    {
      cancelLabel: 'Annuler',
      confirmLabel: 'Enregistrer et quitter',
      hasSecondaryAction: false,
      confirmSecondaryLabel: undefined,
      confirmSecondaryClass: 'fr-btn submit-btn',
      confirmSecondaryType: 'submit'
    }
  )

  defineEmits<{
    cancel: []
    delete: []
  }>()
</script>
