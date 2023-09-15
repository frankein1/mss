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
            <th scope="col">
              Nom
              <AtomSortButton
                :sort="nameSort"
                @update:sort="onSort({ name: $event })"
              />
            </th>
            <th scope="col">
              Date ajout
              <AtomSortButton
                :sort="dateSort"
                numeric
                @update:sort="onSort({ created: $event })"
              />
            </th>
            <th scope="col">Thèmes</th>
          </tr>
        </thead>
        <tbody>
          <BeneficiaryDocumentRow
            v-for="document in documents"
            :key="document.key"
            :document="document"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { GetBeneficiaryDocumentsOutput } from '~/server/routers'
  import type { BeneficiaryDocumentSort } from '~/types/table'

  const props = defineProps<{
    documents: GetBeneficiaryDocumentsOutput
    pending: boolean
    sort: BeneficiaryDocumentSort[]
  }>()

  const emit = defineEmits<{
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
