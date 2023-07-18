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
            <th scope="col">
              {{ beneficiaryFieldLabels.usualName }}
              <AtomSortButton
                :sort="usualNameSort"
                @update:sort="onSort({ usualName: $event })"
              />
            </th>
            <th scope="col">
              {{ beneficiaryFieldLabels.firstName }}
              <AtomSortButton @update:sort="onSort({ firstName: $event })" />
            </th>
            <th scope="col">Âge</th>
            <th scope="col">
              {{ beneficiaryFieldLabels.birthDate }}
            </th>
            <th scope="col">Adresse postale</th>
            <th scope="col">{{ beneficiaryFieldLabels.city }}</th>
            <th scope="col">Téléphone</th>
            <th scope="col">Types d'accompagnement</th>
            <th scope="col">Référents</th>
            <th scope="col">{{ beneficiaryFieldLabels.status }}</th>
            <th scope="col">N° Dossier</th>
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
  import { Beneficiaries } from './types'
  import { beneficiaryFieldLabels } from '~/client/labels'
  import type { BeneficiarySort } from '~/types/table'

  const props = defineProps<{
    beneficiaries: Beneficiaries
    pending: boolean
    sort: BeneficiarySort[]
  }>()

  const emit = defineEmits<{
    (e: 'update:sort', sort: BeneficiarySort[]): void
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
