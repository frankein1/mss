<template>
  <BeneficiaryDocumentAddButton
    class="fr-mb-3w force-focus-visible"
    :family-file-id="familyFileId"
    :beneficiary-id="beneficiaryId"
    label="Ajouter un nouveau document"
    @new-document="onNewDocument"
  />
  <MultiSelect
    v-if="!pending && !error"
    ref="selectDocInput"
    :name="name"
    label="Sélectionner un ou plusieurs fichiers depuis l'espace bénéficiaire"
    :options="documentOptions"
  />
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import VeeSearchableSelect from '../VeeForm/VeeSearchableSelect.vue'

  const selectDocInput = ref<typeof VeeSearchableSelect | null>(null)

  const snackbar = useSnackbar()

  const props = withDefaults(
    defineProps<{
      familyFileId: string
      beneficiaryId: string
      name: string
      snackbarSuccessMessage?: string
      snackbarFailureMessage?: string
    }>(),
    {
      snackbarSuccessMessage:
        'Le document a été ajouté à la fiche bénéficiaire.',
      snackbarFailureMessage:
        "L'ajout du document à la fiche bénéficiaire a échoué."
    }
  )

  const { data, pending, error, refresh } =
    await useTrpcClient().file.getDocuments.useQuery({
      familyFileId: props.familyFileId
    })

  const documents = computed(() => data.value?.documents || [])

  const documentOptions = computed(() =>
    documents.value?.map(d => ({
      value: d.document.key,
      label: d.document.name
    }))
  )

  function onNewDocument(key: string) {
    refresh()
      .then(() => {
        selectDocInput.value?.triggerSelectValue(key)
        snackbar.success(props.snackbarSuccessMessage)
      })
      .catch(e => {
        snackbar.error(
          props.snackbarFailureMessage,
          snackbar.focus('form', '.force-focus-visible' as FocusHTMLTag)
        )
        throw e
      })
  }
</script>

<style scoped>
  .beneficiary-documents-search {
    margin-bottom: 0;
    margin-right: 2rem;
    flex: 1;
  }
</style>
