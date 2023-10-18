<template>
  <div class="fr-grid-row">
    <div class="fr-col-12 fr-pb-1w">
      <div class="fr-text--bold">Situation familiale</div>
    </div>
    <div class="fr-col-12 fr-pb-1w">
      <BeneficiaryInfoLabel
        :value="
          BeneficiaryFamilySituationKeys.value(beneficiary.familySituation)
        "
      />
    </div>
    <div class="fr-col-6">
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.minorChildren"
        :value="beneficiary.minorChildren || '0'"
      />
    </div>
    <div class="fr-col-6">
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.majorChildren"
        :value="beneficiary.majorChildren || '0'"
      />
    </div>
    <div
      v-for="taxHousehold in taxHouseholds"
      :key="taxHousehold.id"
      class="fr-col-12"
    >
      <hr class="fr-col-12 fr-mt-5v" />
      <BeneficiaryInfoRelative :relative="taxHousehold" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { BeneficiaryFamilySituationKeys } from '~/client/options/beneficiary'
  import { BeneficiaryRelativeWithLinkedBeneficiary } from '~/types/relative'
  import type { GetBeneficiaryOutput } from '~/server/trpc/routers'
  import { beneficiaryFieldLabels } from '~/client/labels/beneficiary.labels'

  defineProps<{
    beneficiary: GetBeneficiaryOutput
    taxHouseholds: BeneficiaryRelativeWithLinkedBeneficiary[]
  }>()
</script>
