<template>
  <ul
    class="fr-btns-group fr-btns-group--lg fr-btns-group--inline-md fr-btns-group--right"
  >
    <li>
      <button
        class="fr-btn fr-btn--secondary"
        type="button"
        @click="$emit('cancel')"
      >
        {{ cancelLabel }}
      </button>
    </li>

    <li v-if="hasSecondaryAction">
      <button
        class="fr-btn submit-btn"
        type="submit"
        :submitting="isSubmitting"
        :disabled="isSubmitting"
      >
        {{ confirmSecondaryLabel }}
      </button>
    </li>

    <li>
      <button
        class="fr-btn submit-btn"
        type="submit"
        :submitting="isSubmitting"
        :disabled="isSubmitting"
      >
        {{ confirmLabel }}
      </button>
    </li>
  </ul>
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

<style scoped lang="scss">
  .fr-btns-group .fr-btn {
    margin-bottom: 0;
  }
</style>
