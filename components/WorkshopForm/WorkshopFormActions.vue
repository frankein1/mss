<template>
  <ul
    class="fr-btns-group fr-btns-group--inline-sm fr-btns-group--lg fr-btns-group--right"
  >
    <li>
      <button
        class="fr-btn fr-btn--secondary"
        type="button"
        :disabled="isSubmitting"
        @click="emit('cancel')"
      >
        Annuler
      </button>
    </li>
    <li v-if="mode === 'update'">
      <button
        class="fr-btn fr-btn--secondary btn-delete-action"
        type="button"
        data-fr-opened="false"
        aria-controls="global-modal"
        @click="emit('delete')"
      >
        Supprimer
      </button>
    </li>
    <li>
      <button
        class="fr-btn"
        type="submit"
        :disabled="isSubmitting"
        :data-submitting="isSubmitting"
        @click="emit('submit')"
      >
        {{ mode === 'create' ? 'Enregistrer' : 'Confirmer' }}
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
  defineProps<{
    isSubmitting: boolean
    mode: 'create' | 'update' | 'duplicate'
  }>()

  const emit = defineEmits<{
    cancel: []
    submit: []
    delete: []
  }>()
</script>
