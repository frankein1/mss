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
          :beneficiary="beneficiary"
          @refresh-documents="emit('refreshDocuments')"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { DocumentType } from '@prisma/client'
  import { documentTypeLabels } from '~/client/options/document'
  import {
    GetBeneficiaryDocumentsOutput,
    GetBeneficiaryOutput
  } from '~/server/routers'

  defineProps<{
    documentType: DocumentType
    documents: GetBeneficiaryDocumentsOutput
    beneficiary: GetBeneficiaryOutput
  }>()

  const emit = defineEmits<{
    refreshDocuments: []
  }>()
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
    min-height: 150px;
  }
</style>
