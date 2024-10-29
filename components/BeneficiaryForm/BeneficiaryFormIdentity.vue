<template>
  <BeneficiaryFormSection section-title="Identité du bénéficiaire">
    <div class="fr-col-12">
      <VeeRadioButtons
        class="fr-mb-0"
        name="title"
        :label="beneficiaryFieldLabels.title"
        :options="beneficiaryTitleKeys.options"
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
    <BeneficiaryFormSimilarAlert
      v-model:similar-beneficiary="similarBeneficiary"
      :usual-name="usualName"
      :first-name="firstName"
      :birth-date="birthDate"
      :birth-name="birthName"
      :initial-beneficiary="initialBeneficiary"
      @update:similar-beneficiary="updateSimilarBeneficiary"
    />
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
        :options="withEmptyValue(beneficiaryGenderKeys.options)"
      />
    </div>
    <div class="fr-col-12">
      <VeeSelect
        name="nationality"
        :label="beneficiaryFieldLabels.nationality"
        :options="withEmptyValue(nationalityKeys.options)"
      />
    </div>
    <div
      v-if="application.module.ministere"
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
    beneficiaryGenderKeys,
    beneficiaryTitleKeys,
    nationalityKeys
  } from '~/client/options'
  import { SimilarBeneficiary } from '~/server/trpc/routers'
  import { BeneficiaryIdentification } from '~/types/beneficiary'

  const { application } = usePermissions()
  const similarBeneficiary = ref<SimilarBeneficiary>(undefined)

  defineProps<{ initialBeneficiary: BeneficiaryIdentification | null }>()

  const emit = defineEmits<{
    update: [similarBeneficiary: SimilarBeneficiary]
  }>()

  const { value: status } = useField<BeneficiaryStatus>('status')
  const { value: usualName } = useField<string | null | undefined>('usualName')
  const { value: birthName } = useField<string | null | undefined>('birthName')
  const { value: firstName } = useField<string | null | undefined>('firstName')
  const { value: birthDate } = useField<Date | null | undefined>('birthDate')

  const isDeceased = computed(() => status.value === BeneficiaryStatus.Deceased)

  const updateSimilarBeneficiary = () => {
    emit('update', similarBeneficiary.value)
  }
</script>
