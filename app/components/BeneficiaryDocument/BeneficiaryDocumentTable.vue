<template>
  <div
    ref="tableContainer"
    class="table-container"
    tabindex="0"
  >
    <div
      class="fr-table fr-table--bordered fr-table--no-scroll fr-table--no-caption fr-mb-0 fr-pt-0"
    >
      <table>
        <caption>
          Liste des documents
        </caption>
        <thead>
          <tr>
            <TableSortableHeader
              label="Nom"
              :sort="sort.name"
              @update:sort="emit('update:sort', { name: $event })"
            />
            <TableSortableHeader
              label="Date expiration"
              :sort="sort.expirationDate"
              numeric
              @update:sort="emit('update:sort', { expirationDate: $event })"
            />
            <th scope="col">Thèmes</th>
            <TableSortableHeader
              label="Ajout"
              :sort="sort.created"
              numeric
              @update:sort="emit('update:sort', { created: $event })"
            />
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <BeneficiaryDocumentRow
            v-for="item in documents"
            :key="item.document.key"
            :document="item.document"
            :permissions="item.permissions"
            :family-file-identification="familyFileIdentification"
            @updated="emit('documentUpdated', $event)"
            @deleted="emit('documentDeleted', item.document.key)"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { GetDocuments, GetDocument } from './types'
  import type { BeneficiaryDocumentSort } from '~~/types/table'
  import type { BeneficiaryFileIdentification } from '~~/types/beneficiary'

  const props = defineProps<{
    documents: GetDocuments
    familyFileIdentification: BeneficiaryFileIdentification[]
    pending: boolean
    sort: BeneficiaryDocumentSort
  }>()

  const emit = defineEmits<{
    'update:sort': [sort: BeneficiaryDocumentSort]
    'documentUpdated': [document: GetDocument]
    'documentDeleted': [documentKey: string]
  }>()

  const { tableContainer } = useTable(toRef(() => props.pending))
</script>
