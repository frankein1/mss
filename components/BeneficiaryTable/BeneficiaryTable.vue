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
              :sort="usualNameSort"
              @update:sort="onSort({ usualName: $event })"
            />
            <TableSortableHeader
              :label="beneficiaryFieldLabels.firstName"
              @update:sort="onSort({ firstName: $event })"
            />
            <TableSortableHeader
              label="Naissance"
              @update:sort="onSort({ birthDate: $event })"
            />
            <th scope="col">Naissance</th>
            <th scope="col">Téléphone</th>
            <th scope="col">Adresse</th>
            <th scope="col">{{ beneficiaryFieldLabels.types }}</th>
          </tr>
        </thead>
        <tbody>
          <BeneficiaryRow
            v-for="beneficiary in beneficiaries"
            :key="beneficiary.id"
            :beneficiary="beneficiary"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { GetBeneficiaries } from './types'
  import { beneficiaryFieldLabels } from '~/client/labels'
  import type { BeneficiarySort } from '~/types/table'

  const props = defineProps<{
    beneficiaries: GetBeneficiaries
    pending: boolean
    sort: BeneficiarySort[]
  }>()

  const emit = defineEmits<{
    'update:sort': [sort: BeneficiarySort[]]
  }>()

  const { onSort, tableContainer } = useTable<BeneficiarySort>(
    toRef(() => props.sort),
    toRef(() => props.pending),
    emit
  )

  const usualNameSort = computed(
    () => props.sort?.find(s => s.usualName)?.usualName
  )
</script>
