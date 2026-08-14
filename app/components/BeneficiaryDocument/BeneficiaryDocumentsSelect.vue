<template>
  <BeneficiaryDocumentAddButton
    class="fr-mb-3w force-focus-visible"
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
  import MultiSelect from '../MultiSelect/MultiSelect.vue'

  const selectDocInput = ref<typeof MultiSelect | null>(null)
  const snackbar = useSnackbar()

  const props = withDefaults(
    defineProps<{
      familyFileId: string
      beneficiaryId: string
      name: string
      snackbarSuccessMessage?: string
    }>(),
    {
      snackbarSuccessMessage:
        'Le document a été ajouté à la fiche bénéficiaire.'
    }
  )

  const { data, pending, error } =
    await useTrpcClient().file.getDocuments.useQuery({
      familyFileId: props.familyFileId
    })

  const documentOptions = ref(
    (data.value?.documents || []).map(d => ({
      value: d.document.key,
      label: d.document.name
    }))
  )

  function onNewDocument(key: string, name: string) {
    documentOptions.value.push({ value: key, label: name })
    selectDocInput.value?.triggerSelectValue(key)
    snackbar.success(props.snackbarSuccessMessage, () =>
      document?.querySelector<HTMLElement>('#documentAddButton')?.focus()
    )
  }
</script>

<style scoped>
  .beneficiary-documents-search {
    margin-bottom: 0;
    margin-right: 2rem;
    flex: 1;
  }
</style>
