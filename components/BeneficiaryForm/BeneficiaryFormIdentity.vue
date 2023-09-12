<template>
  <div
    class="fr-grid-row fr-grid-row--center fr-grid-row--gutters feature-section fr-mb-3w"
  >
    <h3 class="fr-h4">Identifité du bénéficiaire</h3>
    <div class="fr-col-12">
      <VeeRadioButtons
        name="title"
        :label="beneficiaryFieldLabels.title"
        :options="beneficiaryTitleOptions"
      />
    </div>
    <div class="fr-col-12">
      <VeeInput
        name="usualName"
        :label="beneficiaryFieldLabels.usualName"
      />
    </div>
    <div class="fr-col-12">
      <VeeInput
        name="birthName"
        :label="beneficiaryFieldLabels.birthName"
      />
    </div>
    <div class="fr-col-12">
      <VeeInput
        name="firstName"
        :label="beneficiaryFieldLabels.firstName"
      />
    </div>
    <div class="fr-col-12 fr-col-md-4">
      <VeeInput
        name="birthDate"
        :label="beneficiaryFieldLabels.birthDate"
        type="date"
      />
    </div>
    <div class="fr-col-12 fr-col-md-8">
      <VeeInput
        name="birthPlace"
        :label="beneficiaryFieldLabels.birthPlace"
      />
    </div>
    <div class="fr-col-12">
      <VeeInput
        v-if="isDeceased"
        name="deathDate"
        :label="beneficiaryFieldLabels.deathDate"
        type="date"
      />
    </div>
    <div class="fr-col-12">
      <VeeSelect
        name="gender"
        :label="beneficiaryFieldLabels.gender"
        :options="withEmptyValue(beneficiaryGenderOptions)"
      />
    </div>
    <div class="fr-col-12">
      <VeeSelect
        name="nationality"
        :label="beneficiaryFieldLabels.nationality"
        :options="withEmptyValue(nationalityOptions)"
      />
    </div>
    <div class="fr-col-12">
      <VeeInput
        v-if="isMinistryAgent"
        name="numeroPegase"
        :label="beneficiaryFieldLabels.numeroPegase"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { BeneficiaryStatus } from '@prisma/client'
  import { beneficiaryFieldLabels } from '~/client/labels'
  import {
    beneficiaryGenderOptions,
    beneficiaryTitleOptions
  } from '~/client/options/beneficiary'
  import { nationalityOptions } from '~/client/options/nationality'

  const isMinistryAgent = useMinistryAgent()

  const { value: status } = useField<BeneficiaryStatus>('status')

  const isDeceased = computed(() => status.value === BeneficiaryStatus.Deceased)
</script>
