<template>
  <div class="documents_container">
    <div
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
    </div>
    <div class="documents_actions">
      <BeneficiaryDocumentAdd
        :beneficiary-id="beneficiary.id"
        @refresh-documents="refresh"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
  import { DocumentType } from '@prisma/client'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary-tabs'
  import { focusAndScrollTo } from '~/utils/focusAnScrollTo'
  import {
    GetBeneficiaryDocumentsOutput,
    GetBeneficiaryOutput
  } from '~/server/routers'

  const route = useRoute()

  const props = defineProps<{ beneficiary: GetBeneficiaryOutput }>()

  const { data: documents, refresh } =
    useAsyncData<GetBeneficiaryDocumentsOutput>(fetchDocuments, {
      default: () => []
    })

  onMounted(async () => {
    const tab = route.hash.slice(1)
    const { item } = route.query

    if (tab === BeneficiaryTab.Documents && item) {
      await nextTick()

      focusAndScrollTo(`#document-${item}`)
    }
  })

  function fetchDocuments() {
    return useTrpcClient().beneficiary.getBeneficiaryDocuments.query({
      beneficiaryId: props.beneficiary.id
    })
  }

  function getDocumentsByType(type: DocumentType) {
    return (
      documents.value?.filter(doc => {
        return doc.type === type
      }) || []
    )
  }

  const cerfas = computed(() => getDocumentsByType(DocumentType.Cerfa))
  const courriers = computed(() =>
    getDocumentsByType(DocumentType.HistoriqueCourrier)
  )
  const justificatifs = computed(() =>
    getDocumentsByType(DocumentType.Justificatifs)
  )
  const rapports = computed(() => getDocumentsByType(DocumentType.Rapports))
</script>

<style>
  .documents_container {
    display: flex;
  }

  .documents_content {
    flex: 0 0 80%;
  }
</style>
