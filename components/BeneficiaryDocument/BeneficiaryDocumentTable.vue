<template>
  <div
    ref="tableContainer"
    class="table-container"
    tabindex="0"
  >
    <div
      class="fr-table fr-table--bordered fr-table--no-caption fr-mb-0 fr-pt-0"
    >
      <table>
        <caption>
          Liste des documents
        </caption>
        <thead>
          <tr>
            <th scope="col">Type</th>
          </tr>
        </thead>
        <tbody>
          <!-- TODO: BeneficiaryDocumentRow -->
          <!-- <BeneficiaryRow
            v-for="document in documents"
            :key="document.key"
            :document="document"
          /> -->
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { GetBeneficiaryDocumentsOutput } from '~/server/routers'

  defineProps<{
    documents: GetBeneficiaryDocumentsOutput
  }>()
</script>
