<template>
  <BeneficiaryFormSection section-title="Situation familiale">
    <div class="fr-col-12">
      <VeeSelect
        name="familySituation"
        :label="beneficiaryFieldLabels.familySituation"
        :options="withEmptyValue(beneficiaryFamilySituationKeys.options)"
      />
    </div>
    <div class="fr-col-12 fr-col-lg-6">
      <VeeInput
        name="minorChildren"
        :label="beneficiaryFieldLabels.minorChildren"
        type="number"
      />
    </div>
    <div class="fr-col-12 fr-col-lg-6">
      <VeeInput
        name="majorChildren"
        :label="beneficiaryFieldLabels.majorChildren"
        type="number"
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
  import { beneficiaryFamilySituationKeys } from '~/client/options'
</script>
