<template>
  <div class="fr-grid-row">
    <div class="fr-col-12 fr-pb-1w">
      <div class="fr-text--bold">Situation familiale</div>
    </div>
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
    <div class="fr-col-6">
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.majorChildren"
        :value="taxHouseholds.majorChildren || '0'"
      />
    </div>
    <div class="fr-col-6">
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.minorChildren"
        :value="taxHouseholds.minorChildren || '0'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { beneficiaryFamilySituationKeys } from '~/client/options'
  import type { GetBeneficiaryTaxHousehold } from '~/types/beneficiary'
  import { beneficiaryFieldLabels } from '~/client/labels/beneficiary.labels'

  defineProps<{
    taxHouseholds: GetBeneficiaryTaxHousehold
  }>()
</script>
