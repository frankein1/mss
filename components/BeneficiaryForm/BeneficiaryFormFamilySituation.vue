<template>
  <BeneficiaryFormSection section-title="Situation familiale">
    <div class="fr-col-12">
      <VeeSelect
        name="familySituation"
        :label="beneficiaryFieldLabels.familySituation"
        :options="withEmptyValue(beneficiaryFamilySituationOptions)"
      />
    </div>
    <div class="fr-col-12 fr-col-lg-6">
      <VeeInput
        name="minorChildren"
        :label="beneficiaryFieldLabels.minorChildren"
        type="number"
        :min="0"
      />
    </div>
    <div class="fr-col-12 fr-col-lg-6">
      <VeeInput
        name="majorChildren"
        :label="beneficiaryFieldLabels.majorChildren"
        type="number"
        :min="0"
      />
    </div>
    <div class="fr-col-12">
      <VeeCheckbox
        label="Ce bénéficiaire est aidant familial"
        name="caregiver"
      />
    </div>
  </BeneficiaryFormSection>
</template>

<script setup lang="ts">
  import { beneficiaryFieldLabels } from '~/client/labels'
  import { beneficiaryFamilySituationOptions } from '~/client/options/beneficiary'
</script>
