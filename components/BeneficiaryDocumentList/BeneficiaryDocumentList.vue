<template>
  <div v-if="documents?.length">
    <BeneficiaryDocumentType
      :document-type="DocumentType.Cerfa"
      :documents="cerfas"
      @refresh-documents="refresh"
    />
    <BeneficiaryDocumentType
      :document-type="DocumentType.Rapports"
      :documents="rapports"
      @refresh-documents="refresh"
    />
    <BeneficiaryDocumentType
      :document-type="DocumentType.Justificatifs"
      :documents="justificatifs"
      @refresh-documents="refresh"
    />
    <BeneficiaryDocumentType
      :document-type="DocumentType.HistoriqueCourrier"
      :documents="courriers"
      @refresh-documents="refresh"
    />
  </div>
</template>
<script setup lang="ts">
  import { Document, DocumentType } from '@prisma/client'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary-tabs'
  import { focusAndScrollTo } from '~/utils/focusAnScrollTo'

  const route = useRoute()

  const props = defineProps<{ beneficiaryId: string }>()

  const { data: documents, refresh } = useAsyncData<Document[]>(
    fetchDocuments,
    {
      default: () => []
    }
  )

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
      beneficiaryId: props.beneficiaryId
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
