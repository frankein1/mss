<template>
  <div class="fr-grid-row">
    <div class="fr-col-12 fr-pb-1w">
      <BeneficiaryInfoLabel
        :value="
          beneficiaryFamilySituationKeys.value(taxHouseholds.familySituation)
        "
      />
    </div>
    <div
      v-if="taxHouseholds.weddingDate"
      class="fr-col-12 fr-pb-1w"
    >
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.weddingDate"
        :value="formatDate(taxHouseholds.weddingDate)"
      />
    </div>
    <div
      v-if="taxHouseholds.divorceDate"
      class="fr-col-12 fr-pb-1w"
    >
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.divorceDate"
        :value="formatDate(taxHouseholds.divorceDate)"
      />
    </div>
    <template v-if="hasChildren">
      <div
        v-if="taxHouseholds.majorChildren && taxHouseholds.majorChildren > 0"
        class="fr-col-6"
      >
        <BeneficiaryInfoLabel
          :label="beneficiaryFieldLabels.majorChildren"
          :value="taxHouseholds.majorChildren || '0'"
        />
      </div>
      <div
        v-if="taxHouseholds.minorChildren && taxHouseholds.minorChildren > 0"
        class="fr-col-6"
      >
        <BeneficiaryInfoLabel
          :label="beneficiaryFieldLabels.minorChildren"
          :value="taxHouseholds.minorChildren || '0'"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { beneficiaryFamilySituationKeys } from '~/client/options'
  import type { GetBeneficiaryTaxHousehold } from '~/types/beneficiary'
  import { beneficiaryFieldLabels } from '~/client/labels/beneficiary.labels'

  const props = defineProps<{
    taxHouseholds: GetBeneficiaryTaxHousehold
  }>()
  const hasChildren = computed(() => {
    return (
      (props.taxHouseholds.minorChildren &&
        props.taxHouseholds.minorChildren > 0) ||
      (props.taxHouseholds.majorChildren &&
        props.taxHouseholds.majorChildren > 0)
    )
  })
</script>
