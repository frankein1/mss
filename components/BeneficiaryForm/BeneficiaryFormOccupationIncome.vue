<template>
  <BeneficiaryFormSection>
    <div class="fr-col-12">
      <VeeSelect
        name="socioProfessionalCategory"
        :label="beneficiaryFieldLabels.socioProfessionalCategory"
        :options="withEmptyValue(beneficiarySocioProfessionalCategoryOptions)"
      />
    </div>
    <div class="fr-col-12">
      <VeeInput
        name="occupation"
        :label="beneficiaryFieldLabels.occupation"
      />
    </div>
    <div class="fr-col-12 fr-col-lg-6">
      <VeeInput
        name="employer"
        :label="beneficiaryFieldLabels.employer"
      />
    </div>
    <div class="fr-col-12 fr-col-lg-6">
      <VeeInput
        name="employerSiret"
        :label="beneficiaryFieldLabels.employerSiret"
      />
    </div>
    <div class="fr-col-12 fr-col-lg-6">
      <VeeMultiSelect
        name="mainIncomeSource"
        :label="beneficiaryFieldLabels.mainIncomeSource"
        :options="incomeSourceOptions"
        label-class="fr-text--regular"
        dropdown
      />
    </div>
    <div class="fr-col-12 fr-col-lg-6">
      <VeeCurrencyInput
        name="mainIncomeAmount"
        :label="beneficiaryFieldLabels.mainIncomeAmount"
      />
    </div>
    <template v-if="hasPartner">
      <div class="fr-col-12 fr-col-lg-6">
        <VeeMultiSelect
          name="partnerMainIncomeSource"
          :label="beneficiaryFieldLabels.partnerMainIncomeSource"
          :options="incomeSourceOptions"
          label-class="fr-text--regular"
          dropdown
        />
      </div>
      <div class="fr-col-12 fr-col-lg-6">
        <VeeCurrencyInput
          name="partnerMainIncomeAmount"
          :label="beneficiaryFieldLabels.partnerMainIncomeAmount"
        />
      </div>
    </template>
    <template v-if="hasMajorChildren">
      <div class="fr-col-12 fr-col-lg-6">
        <VeeMultiSelect
          name="majorChildrenMainIncomeSource"
          :label="beneficiaryFieldLabels.majorChildrenMainIncomeSource"
          :options="incomeSourceOptions"
          label-class="fr-text--regular"
          dropdown
        />
      </div>
      <div class="fr-col-12 fr-col-lg-6">
        <VeeCurrencyInput
          name="majorChildrenMainIncomeAmount"
          :label="beneficiaryFieldLabels.majorChildrenMainIncomeAmount"
        />
      </div>
    </template>
    <template
      v-for="(income, idx) in incomes"
      :key="income.key"
    >
      <div class="fr-col-12 fr-col-lg-6">
        <VeeMultiSelect
          :name="`incomes[${idx}].incomeSource`"
          :label="`${beneficiaryFieldLabels.incomeSource} ${
            incomesRelativesLabels[
              income.value
                .hostedRelative as BeneficiaryHouseholdOccupationRelationship
            ]
          }`"
          :options="incomeSourceOptions"
          label-class="fr-text--regular"
          dropdown
        />
      </div>
      <div class="fr-col-12 fr-col-lg-6">
        <VeeCurrencyInput
          :name="`incomes[${idx}].incomeAmount`"
          :label="`${beneficiaryFieldLabels.incomeAmount} ${
            incomesRelativesLabels[
              income.value
                .hostedRelative as BeneficiaryHouseholdOccupationRelationship
            ]
          }`"
        />
      </div>
    </template>
    <div class="fr-col-12">
      <VeeInput
        name="unemploymentNumber"
        :label="beneficiaryFieldLabels.unemploymentNumber"
      />
    </div>
    <div class="fr-col-12">
      <VeeMultiSelect
        name="pensionOrganisations"
        :label="beneficiaryFieldLabels.pensionOrganisations"
        :options="pensionOrganisationOptions"
        label-class="fr-text--regular"
        dropdown
      />
    </div>
    <div
      v-if="hasOtherPensionOrganisations"
      class="fr-col-12"
    >
      <VeeInput
        name="otherPensionOrganisations"
        :label="beneficiaryFieldLabels.otherPensionOrganisations"
      />
    </div>
    <div class="fr-col-12">
      <VeeInput
        name="cafNumber"
        :label="beneficiaryFieldLabels.cafNumber"
      />
    </div>
    <div class="fr-col-12">
      <VeeInput
        name="bank"
        :label="beneficiaryFieldLabels.bank"
      />
    </div>
    <div class="fr-col-12">
      <VeeInput
        name="funeralContract"
        :label="beneficiaryFieldLabels.funeralContract"
      />
    </div>
    <div class="fr-col-12">
      <VeeSelect
        v-if="permissions.set.ministereCategorie"
        name="ministereCategorie"
        :label="beneficiaryFieldLabels.ministereCategorie"
        :options="withEmptyValue(ministereCategorieOptions)"
      />
    </div>
    <div class="fr-col-12">
      <VeeSearchableSelect
        v-if="permissions.set.ministereDepartementServiceAc"
        name="ministereDepartementServiceAc"
        :label="beneficiaryFieldLabels.ministereDepartementServiceAc"
        :options="withEmptyValue(ministereDepartmentServiceAcOptions)"
      />
    </div>
    <div class="fr-col-12">
      <VeeSelect
        v-if="permissions.set.ministereStructure"
        name="ministereStructure"
        :label="beneficiaryFieldLabels.ministereStructure"
        :options="withEmptyValue(ministereStructureOptions)"
      />
    </div>
  </BeneficiaryFormSection>
</template>

<script lang="ts" setup>
  import {
    BeneficiaryFamilySituation,
    BeneficiaryPensionOrganisation
  } from '@prisma/client'
  import {
    beneficiarySocioProfessionalCategoryOptions,
    incomeSourceOptions,
    pensionOrganisationOptions
  } from '~/client/options/beneficiary'
  import {
    ministereDepartmentServiceAcOptions,
    ministereStructureOptions,
    ministereCategorieOptions
  } from '~/client/options/ministry'
  import {
    beneficiaryFieldLabels,
    incomesRelativesLabels
  } from '~/client/labels/beneficiary.labels'
  import { BeneficiaryPermissions } from '~/server/security'
  import { CreateOrUpdateIncomeInput } from '~/server/schema'
  import { BeneficiaryHouseholdOccupationRelationship } from '~/types/beneficiary'

  const props = defineProps<{
    familySituation: BeneficiaryFamilySituation | null | undefined
    majorChildren: number | null | undefined
    permissions: BeneficiaryPermissions
  }>()

  const { fields: incomes } =
    useFieldArray<CreateOrUpdateIncomeInput>('incomes')

  const { value: pensionOrganisations } = useField<
    BeneficiaryPensionOrganisation[]
  >('pensionOrganisations')

  const hasPartner = computed(() => {
    const familySituation = props.familySituation
    if (!familySituation) {
      return false
    }
    return (
      familySituation === BeneficiaryFamilySituation.Married ||
      familySituation === BeneficiaryFamilySituation.CivilUnion ||
      familySituation === BeneficiaryFamilySituation.Cohabitation ||
      familySituation === BeneficiaryFamilySituation.CoupleWithChildren
    )
  })

  const hasMajorChildren = computed(() => (props.majorChildren || 0) > 0)

  const hasOtherPensionOrganisations = computed(() =>
    (pensionOrganisations.value || []).includes(
      BeneficiaryPensionOrganisation.Other
    )
  )
</script>
