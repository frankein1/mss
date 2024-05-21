<template>
  <AtomActionsBar>
    <p
      v-if="saved"
      class="fr-icon-success-fill saved"
    >
      Enregistré
    </p>
    <ul
      class="fr-btns-group fr-btns-group--lg fr-btns-group--inline-md fr-btns-group--right"
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
          @click="emit('save')"
        >
          Enregistrer et quitter
        </button>
      </li>
    </ul>
  </AtomActionsBar>
</template>

<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      saved?: boolean
      isSubmitting: boolean
    }>(),
    { saved: false }
  )

  const emit = defineEmits<{
    save: []
    cancel: []
  }>()

  const saved = ref(props.saved)

  onMounted(() => {
    setTimeout(() => {
      if (saved.value) {
        saved.value = false
      }
    }, 5000)
  })
</script>

<style lang="scss" scoped>
  .saved {
    position: absolute;
    margin-top: 0.5rem;

    --text-spacing: 0;

    color: var(--text-default-success);
  }
</style>
