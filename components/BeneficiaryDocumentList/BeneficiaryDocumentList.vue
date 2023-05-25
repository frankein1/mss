<template>
  <div v-if="documents?.length">
    <BeneficiaryDocumentType
      :document-type="DocumentType.Cerfa"
      :documents="cerfas"
    />
    <BeneficiaryDocumentType
      :document-type="DocumentType.Rapports"
      :documents="rapports"
    />
    <BeneficiaryDocumentType
      :document-type="DocumentType.Justificatifs"
      :documents="justificatifs"
    />
    <BeneficiaryDocumentType
      :document-type="DocumentType.HistoriqueCourrier"
      :documents="courriers"
    />
  </div>
</template>
<script setup lang="ts">
  import { Document, DocumentType } from '@prisma/client'

  const props = defineProps<{ beneficiaryId: string }>()

  const { data: documents } = useAsyncData<Document[]>(fetchDocuments, {
    default: () => []
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
