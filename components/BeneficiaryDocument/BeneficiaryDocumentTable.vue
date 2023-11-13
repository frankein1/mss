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
            <TableSortableHeader
              label="Nom"
              :sort="nameSort"
              @update:sort="onSort({ name: $event })"
            />
            <TableSortableHeader
              label="Date ajout"
              :sort="dateSort"
              numeric
              @update:sort="onSort({ created: $event })"
            />
            <th scope="col">Thèmes</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <BeneficiaryDocumentRow
            v-for="item in documents"
            :key="item.document.key"
            :document="item.document"
            :permissions="item.permissions"
            @refresh-documents="emit('refreshDocuments')"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { GetDocuments } from './types'
  import type { BeneficiaryDocumentSort } from '~/types/table'

  const props = defineProps<{
    documents: GetDocuments
    pending: boolean
    sort: BeneficiaryDocumentSort[]
  }>()

  const emit = defineEmits<{
    'refreshDocuments': []
    'update:sort': [sort: BeneficiaryDocumentSort[]]
  }>()

  const { onSort, tableContainer } = useTable<BeneficiaryDocumentSort>(
    toRef(() => props.sort),
    toRef(() => props.pending),
    emit
  )

  const dateSort = computed(() => props.sort?.find(s => s.created)?.created)
  const nameSort = computed(() => props.sort?.find(s => s.name)?.name)
</script>
