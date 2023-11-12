<template>
  <BeneficiaryFormSection section-title="Identité du bénéficiaire">
    <div class="fr-col-12">
      <VeeRadioButtons
        class="fr-mb-0"
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
    <div class="fr-col-12 fr-col-lg-4">
      <VeeInput
        name="birthDate"
        :label="beneficiaryFieldLabels.birthDate"
        type="date"
      />
    </div>
    <div class="fr-col-12 fr-col-lg-8">
      <VeeInput
        name="birthPlace"
        :label="beneficiaryFieldLabels.birthPlace"
      />
    </div>
    <div
      v-if="isDeceased"
      class="fr-col-12"
    >
      <VeeInput
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
    <div
      v-if="permissions.set.numeroPegase"
      class="fr-col-12"
    >
      <VeeInput
        name="numeroPegase"
        :label="beneficiaryFieldLabels.numeroPegase"
        hint="Format attendu : A-00-000000"
      />
    </div>
  </BeneficiaryFormSection>
</template>

<script setup lang="ts">
  import { BeneficiaryStatus } from '@prisma/client'
  import { beneficiaryFieldLabels } from '~/client/labels'
  import {
    beneficiaryGenderOptions,
    beneficiaryTitleOptions
  } from '~/client/options/beneficiary'
  import { nationalityOptions } from '~/client/options/nationality'
  import { BeneficiaryPermissions } from '~/server/security'

  defineProps<{
    permissions: BeneficiaryPermissions
  }>()

  const { value: status } = useField<BeneficiaryStatus>('status')

  const isDeceased = computed(() => status.value === BeneficiaryStatus.Deceased)
</script>
