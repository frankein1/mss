<template>
  <div class="beneficiaryformactions__container">
    <p
      v-if="saved"
      class="fr-icon-success-fill beneficiaryformactions__saved"
    >
      Enregistré
    </p>
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
          @click="emit('save')"
        >
          Enregistrer et quitter
        </button>
      </li>
    </ul>
  </div>
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
  .beneficiaryformactions__container {
    border-top: 1px solid var(--border-default-grey);
    background-color: var(--background-default-grey);
    padding: 1.5rem 2.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .beneficiaryformactions__saved {
    --text-spacing: 0;

    color: var(--text-default-success);
  }

  .beneficiaryformactions__btns-group {
    margin-bottom: -1rem;
    flex: 1;
  }
</style>
