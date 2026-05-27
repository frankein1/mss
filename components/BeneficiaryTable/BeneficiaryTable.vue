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
            <th
              v-if="selectable"
              class="fr-cell--fixed"
              role="columnheader"
              scope="row"
            >
              <div class="fr-checkbox-group fr-checkbox-group--sm">
                <input
                  id="table-select-all"
                  ref="selectAllCheckbox"
                  type="checkbox"
                  name="row-select-all"
                  :checked="isAllSelected"
                  :disabled="isSelectAllDisabled"
                  @change="toggleAll"
                />
                <label
                  class="fr-label"
                  for="table-select-all"
                  title="Sélectionner toutes les lignes visibles"
                >
                  <span class="fr-sr-only"
                    >Sélectionner toutes les lignes visibles</span
                  >
                </label>
              </div>
            </th>
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
            <th
              v-if="showReferents"
              scope="col"
            >
              Référents
            </th>
          </tr>
        </thead>
        <tbody>
          <BeneficiaryRow
            v-for="beneficiary in beneficiaryList"
            :key="beneficiary.id"
            :beneficiary="beneficiary"
            :selectable="selectable"
            :selected="isSelected(beneficiary.id)"
            :disabled="isRowDisabled(beneficiary.id)"
            :show-referents="showReferents"
            @toggle="toggleRow(beneficiary)"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { BeneficiaryListItem, BeneficiaryListItems } from './types'
  import { beneficiaryFieldLabels } from '~/client/labels'
  import type { BeneficiarySort } from '~/types/table'

  const props = defineProps<{
    beneficiaryList: BeneficiaryListItems
    pending: boolean
    sort: BeneficiarySort
    selectable?: boolean
    selectionLimit?: number
    showReferents?: boolean
    disabledBeneficiaryIds?: string[]
  }>()

  const emit = defineEmits<{
    'update:sort': [sort: BeneficiarySort]
  }>()

  const { tableContainer } = useTable(toRef(() => props.pending))

  const selectedBeneficiaries = defineModel<
    { beneficiaryId: string; familyFileId: string }[]
  >('selectedBeneficiaries', { default: () => [] })
  const selectAllCheckbox = ref<HTMLInputElement | null>(null)

  const isLimitReached = computed(
    () =>
      props.selectionLimit !== undefined &&
      selectedBeneficiaries.value.length >= props.selectionLimit
  )

  function isSelected(id: string) {
    return selectedBeneficiaries.value.some(b => b.beneficiaryId === id)
  }

  const disabledSet = computed(
    () => new Set(props.disabledBeneficiaryIds ?? [])
  )

  function isRowDisabled(id: string) {
    return (
      (isLimitReached.value && !isSelected(id)) || disabledSet.value.has(id)
    )
  }

  function toggleRow(beneficiary: BeneficiaryListItem) {
    if (isSelected(beneficiary.id)) {
      selectedBeneficiaries.value = selectedBeneficiaries.value.filter(
        b => b.beneficiaryId !== beneficiary.id
      )
    } else if (!isLimitReached.value) {
      selectedBeneficiaries.value = [
        ...selectedBeneficiaries.value,
        {
          beneficiaryId: beneficiary.id,
          familyFileId: beneficiary.familyFileId
        }
      ]
    }
  }

  const selectableBeneficiaries = computed(() =>
    props.beneficiaryList.filter(b => !disabledSet.value.has(b.id))
  )

  const isAllSelected = computed(
    () =>
      selectableBeneficiaries.value.length > 0 &&
      selectableBeneficiaries.value.every(b => isSelected(b.id))
  )

  const isIndeterminate = computed(
    () =>
      !isAllSelected.value &&
      selectableBeneficiaries.value.some(b => isSelected(b.id))
  )

  const isSelectAllDisabled = computed(
    () => isLimitReached.value && !isAllSelected.value
  )

  watch(isIndeterminate, value => {
    if (selectAllCheckbox.value) {
      selectAllCheckbox.value.indeterminate = value
    }
  })

  function toggleAll() {
    if (isAllSelected.value) {
      const visibleSelectableIds = new Set(
        selectableBeneficiaries.value.map(b => b.id)
      )
      selectedBeneficiaries.value = selectedBeneficiaries.value.filter(
        b => !visibleSelectableIds.has(b.beneficiaryId)
      )
    } else {
      const remaining =
        props.selectionLimit !== undefined
          ? props.selectionLimit - selectedBeneficiaries.value.length
          : Infinity
      const existingIds = new Set(
        selectedBeneficiaries.value.map(b => b.beneficiaryId)
      )
      const toAdd = selectableBeneficiaries.value
        .filter(b => !existingIds.has(b.id))
        .slice(0, remaining)
        .map(b => ({ beneficiaryId: b.id, familyFileId: b.familyFileId }))
      selectedBeneficiaries.value = [...selectedBeneficiaries.value, ...toAdd]
    }
  }
</script>

<style lang="scss" scoped>
  .fr-cell--fixed {
    position: relative;
    z-index: 1;
    vertical-align: middle;

    .fr-checkbox-group {
      margin-inline: auto;
      width: 1rem;
      height: 1rem;
      transform: translateY(-4px);
    }
  }
</style>
