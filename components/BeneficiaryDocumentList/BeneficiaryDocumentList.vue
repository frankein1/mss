<template>
  <div class="fr-container">
    <div class="beneficiary-section fr-p-3w">
      <BeneficiaryDocumentAddButton
        :beneficiary-id="beneficiary.id"
        @refresh-documents="refresh"
      />
      <BeneficiaryDocumentFilters @filter="filters = $event" />
    </div>
    <!-- <div
      v-if="documents?.length"
      class="documents_content"
    >
      <BeneficiaryDocumentType
        :document-type="DocumentType.Cerfa"
        :documents="cerfas"
        :beneficiary="beneficiary"
        @refresh-documents="refresh"
      />
      <BeneficiaryDocumentType
        :document-type="DocumentType.Rapports"
        :documents="rapports"
        :beneficiary="beneficiary"
        @refresh-documents="refresh"
      />
      <BeneficiaryDocumentType
        :document-type="DocumentType.Justificatifs"
        :documents="justificatifs"
        :beneficiary="beneficiary"
        @refresh-documents="refresh"
      />
      <BeneficiaryDocumentType
        :document-type="DocumentType.HistoriqueCourrier"
        :documents="courriers"
        :beneficiary="beneficiary"
        @refresh-documents="refresh"
      />
    </div> -->
  </div>
</template>
<script setup lang="ts">
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { focusAndScrollTo } from '~/utils/focusAnScrollTo'
  import { GetBeneficiaryOutput } from '~/server/routers'
  import type { BeneficiaryDocumentFilterInput } from '~/server/schema'

  const route = useRoute()

  const props = defineProps<{ beneficiary: GetBeneficiaryOutput }>()

  const filters = ref<BeneficiaryDocumentFilterInput>({})

  const queryInput = computed(() => ({
    beneficiaryId: props.beneficiary.id,
    filters: filters.value
  }))

  const { data: documents, refresh } =
    await useTrpcClient().beneficiary.getBeneficiaryDocuments.useQuery(
      queryInput
    )

  onMounted(async () => {
    const tab = route.hash.slice(1)
    const { item } = route.query

    if (tab === BeneficiaryTab.Documents && item) {
      await nextTick()

      focusAndScrollTo(`#document-${item}`)
    }
  })

  // function getDocumentsByType(type: DocumentType) {
  //   return (
  //     documents.value?.filter(doc => {
  //       return doc.type === type
  //     }) || []
  //   )
  // }

  // const cerfas = computed(() => getDocumentsByType(DocumentType.Cerfa))
  // const courriers = computed(() =>
  //   getDocumentsByType(DocumentType.HistoriqueCourrier)
  // )
  // const justificatifs = computed(() =>
  //   getDocumentsByType(DocumentType.Justificatifs)
  // )
  // const rapports = computed(() => getDocumentsByType(DocumentType.Rapports))
</script>

<!-- <style>
  .documents_content {
    flex: 0 0 80%;
  }
</style> -->
