<template>
  <form
    novalidate
    @submit.prevent="onSubmit"
  >
    <div class="fr-input-group fr-mb-3w">
      <label
        class="fr-label"
        for="rename-template-name"
      >
        Nom du document
      </label>
      <input
        id="rename-template-name"
        v-model="name"
        class="fr-input"
        type="text"
        required
        maxlength="200"
      />
    </div>

    <ul
      class="fr-btns-group fr-btns-group--inline-md fr-btns-group--right fr-mt-2w"
    >
      <li>
        <button
          class="fr-btn fr-btn--secondary fr-mb-0"
          type="button"
          @click="modal.close()"
        >
          Annuler
        </button>
      </li>
      <li>
        <button
          class="fr-btn fr-mb-0"
          type="submit"
          :disabled="isSubmitting"
        >
          Enregistrer
        </button>
      </li>
    </ul>
  </form>
</template>

<script setup lang="ts">
  const props = defineProps<{
    templateId: string
    initialName: string
    onSuccess: () => void
  }>()

  const modal = useModal()
  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()
  const name = ref(props.initialName)
  const isSubmitting = ref(false)

  async function onSubmit() {
    if (!name.value.trim()) {return}
    isSubmitting.value = true
    try {
      await trpcClient.letterTemplate.rename.mutate({
        id: props.templateId,
        name: name.value.trim()
      })
      modal.close()
      props.onSuccess()
      snackbar.success('Le nom du modèle a été mis à jour.')
    } catch {
      snackbar.error('La modification a échoué.')
    } finally {
      isSubmitting.value = false
    }
  }
</script>
