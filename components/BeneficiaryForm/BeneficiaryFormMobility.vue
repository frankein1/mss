<template>
  <BeneficiaryFormSection section-title="Mobilité">
    <div class="fr-col-12">
      <VeeSelect
        name="mobility"
        :label="beneficiaryFieldLabels.mobility"
        :options="withEmptyValue(beneficiaryMobilityOptions)"
      />
    </div>
  </BeneficiaryFormSection>
</template>

<script setup lang="ts">
  import { beneficiaryFieldLabels } from '~/client/labels'
  import { beneficiaryMobilityOptions } from '~/client/options'
</script>
