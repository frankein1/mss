<template>
  <BeneficiaryDocumentAddButton
    class="fr-mb-3w"
    :family-file-id="familyFileId"
    :family-file-identification="familyFileIdentification"
    label="Ajouter un nouveau document"
    @new-document="onNewDocument"
  />
  <VeeSearchableSelect
    v-if="!pending && !error"
    ref="selectDocInput"
    class="beneficiary-documents-search"
    :name="name"
    label="Sélectionner un ou plusieurs fichiers depuis l'espace bénéficiaire"
    :options="documentOptions"
    multiple
  />
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import VeeSearchableSelect from '../VeeForm/VeeSearchableSelect.vue'
  import { BeneficiaryFileIdentification } from '~/types/beneficiary'

  const selectDocInput = ref<typeof VeeSearchableSelect | null>(null)

  const snackbar = useSnackbar()

  const props = withDefaults(
    defineProps<{
      familyFileId: string
      familyFileIdentification: BeneficiaryFileIdentification[]
      name: string
      snackbarSuccessMessage?: string
    }>(),
    {
      snackbarSuccessMessage:
        'Le document a été ajouté à la fiche bénéficiaire.'
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
    refresh().then(() => {
      selectDocInput.value?.selectValue(key)
      snackbar.success(props.snackbarSuccessMessage)
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
