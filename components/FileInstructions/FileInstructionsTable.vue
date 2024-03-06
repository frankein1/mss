<template>
  <div
    ref="tableContainer"
    class="table-container fr-pb-0"
    tabindex="0"
  >
    <div
      class="fr-table fr-table--bordered fr-mb-0 fr-pt-0 fr-table--no-caption"
    >
      <table>
        <caption>
          Instructions
        </caption>
        <thead>
          <tr>
            <th
              id="status-col"
              scope="col"
            >
              {{ helpRequestFieldLabels.status }}
            </th>
            <TableSortableHeader
              label="Ouverture dossier"
              :sort="sort.socialSupport?.date"
              numeric
              @update:sort="
                emit('update:sort', { socialSupport: { date: $event } })
              "
            />
            <TableSortableHeader
              :label="helpRequestFieldLabels.beneficiaryId"
              :sort="sort.socialSupport?.beneficiary?.usualName"
              @update:sort="
                emit('update:sort', {
                  socialSupport: { beneficiary: { usualName: $event } }
                })
              "
            />
            <th scope="col">Objet</th>
            <th scope="col">Agent</th>
            <th scope="col">Échéance</th>
          </tr>
        </thead>
        <tbody>
          <FileInstructionRow
            v-for="item in items"
            :key="item.id"
            :file-instruction="item"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { FileInstructions } from '~/server/trpc/routers'
  import { helpRequestFieldLabels } from '~/client/labels'
  import type { FileInstructionSort } from '~/types/table'

  const props = defineProps<{
    items: FileInstructions
    sort: FileInstructionSort
    pending: boolean
  }>()

  const emit = defineEmits<{
    'update:sort': [sort: FileInstructionSort]
  }>()

  const { tableContainer } = useTable(toRef(() => props.pending))
</script>
