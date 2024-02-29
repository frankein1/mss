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
          Liste des bénéficiaires
        </caption>
        <thead>
          <tr>
            <TableSortableHeader
              :label="beneficiaryFieldLabels.usualName"
              :sort="sort.usualName"
              @update:sort="emit('update:sort', { usualName: $event })"
            />
            <TableSortableHeader
              :label="beneficiaryFieldLabels.firstName"
              :sort="sort.firstName"
              @update:sort="emit('update:sort', { firstName: $event })"
            />
            <TableSortableHeader
              label="Naissance"
              :sort="sort.birthDate?.sort"
              @update:sort="
                emit('update:sort', {
                  birthDate: { sort: $event, nulls: 'last' }
                })
              "
            />
            <th scope="col">Téléphone</th>
            <th scope="col">Adresse</th>
            <th scope="col">{{ beneficiaryFieldLabels.subjects }}</th>
          </tr>
        </thead>
        <tbody>
          <BeneficiaryRow
            v-for="item in items"
            :key="item.beneficiary.id"
            :item="item"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { BeneficiaryPageItems } from './types'
  import { beneficiaryFieldLabels } from '~/client/labels'
  import type { BeneficiarySort } from '~/types/table'

  const props = defineProps<{
    items: BeneficiaryPageItems
    pending: boolean
    sort: BeneficiarySort
  }>()

  const emit = defineEmits<{
    'update:sort': [sort: BeneficiarySort]
  }>()

  const { tableContainer } = useTable(toRef(() => props.pending))
</script>
