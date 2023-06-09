<template>
  <div v-if="documents.length">
    <div class="fr-h6">{{ documentTypeLabels[documentType] }}</div>
    <div class="documentlist__container">
      <div
        v-for="document in documents"
        :key="document.key"
        class="documentlist__item"
      >
        <BeneficiaryDocument
          :document="document"
          :on-document-updated="onDocumentUpdated"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { Document, DocumentType } from '@prisma/client'
  import { documentTypeLabels } from '~/client/options/document'

  const props = defineProps<{
    documentType: DocumentType
    documents: Document[]
    refetchDocuments: () => void
  }>()

  const onDocumentUpdated = () => {
    console.log('toto')
    props.refetchDocuments()
  }
</script>

<style lang="scss">
  .documentlist__container {
    display: flex;
    flex-wrap: wrap;
  }

  .documentlist__item {
    padding-right: 1em;
    padding-bottom: 1em;
    flex: 0 1 30%;
    height: 200px;
  }
</style>
