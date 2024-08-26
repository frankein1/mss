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
        :class="confirmSecondaryClass"
        :type="confirmSecondaryType"
        :submitting="isSubmitting"
        :disabled="isSubmitting"
        data-fr-opened="false"
        aria-controls="global-modal"
        @click="$emit('secondaryAction')"
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
    secondaryAction: []
  }>()
</script>

<style scoped lang="scss">
  .fr-btns-group .fr-btn {
    margin-bottom: 0;
  }
</style>
