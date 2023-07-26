<template>
  <div class="beneficiary-documents-select">
    <VeeSearchableSelect
      v-if="!pending && !error"
      ref="selectDocInput"
      class="beneficiary-documents-search"
      :name="name"
      :label="label"
      :options="documentOptions"
      multiple
    />

    <BeneficiaryDocumentAddButton
      :beneficiary-id="beneficiaryId"
      @new-document="onNewDocument"
    />
  </div>
</template>

<script lang="ts" setup>
  import { Document } from '@prisma/client'
  import { ref } from 'vue'
  import VeeSearchableSelect from '../VeeForm/VeeSearchableSelect.vue'

  const selectDocInput = ref<typeof VeeSearchableSelect | null>(null)

  const snackbar = useSnackbar()

  const props = defineProps<{
    beneficiaryId: string
    label: string
    name: string
  }>()

  const {
    data: documents,
    pending,
    error,
    refresh
  } = await useTrpcClient().beneficiary.getBeneficiaryDocuments.useQuery<
    Document[]
  >({
    beneficiaryId: props.beneficiaryId
  })

  const documentOptions = computed(
    () => new Map(documents.value?.map(d => [d.key, d.name]))
  )

  function onNewDocument(key: string) {
    refresh().then(() => {
      selectDocInput.value?.selectValue(key)
      snackbar.success(
        "Le document a été ajouté à la fiche bénéficiaire. Enregistrez l'instruction de demande d'aide pour conserver le lien entre les deux."
      )
    })
  }
</script>

<style scoped>
  .beneficiary-documents-select {
    display: flex;
    align-items: flex-end;
    width: 100%;
  }

  .beneficiary-documents-search {
    margin-bottom: 0;
    margin-right: 2rem;
    flex: 1;
  }
</style>
