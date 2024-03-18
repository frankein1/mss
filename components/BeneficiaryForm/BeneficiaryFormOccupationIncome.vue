<template>
  <BeneficiaryFormSection>
    <div class="fr-col-12">
      <VeeSelect
        name="socioProfessionalCategory"
        :label="beneficiaryFieldLabels.socioProfessionalCategory"
        :options="
          withEmptyValue(beneficiarySocioProfessionalCategoryKeys.options)
        "
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
        :options="incomeSourceKeys.options"
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
          :options="incomeSourceKeys.options"
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
          :options="incomeSourceKeys.options"
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
    <template v-if="hasOtherMembers">
      <div class="fr-col-12 fr-col-lg-6">
        <VeeMultiSelect
          name="otherMembersMainIncomeSource"
          :label="beneficiaryFieldLabels.otherMembersMainIncomeSource"
          :options="incomeSourceKeys.options"
          label-class="fr-text--regular"
          dropdown
        />
      </div>
      <div class="fr-col-12 fr-col-lg-6">
        <VeeCurrencyInput
          name="otherMembersMainIncomeAmount"
          :label="beneficiaryFieldLabels.otherMembersMainIncomeAmount"
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
        :options="pensionOrganisationKeys.options"
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
        v-if="application.module.ministere"
        name="ministereCategorie"
        :label="beneficiaryFieldLabels.ministereCategorie"
        :options="withEmptyValue(ministereCategorieKeys.options)"
      />
    </div>
    <div class="fr-col-12">
      <VeeSearchableSelect
        v-if="application.module.ministere"
        name="ministereDepartementServiceAc"
        :label="beneficiaryFieldLabels.ministereDepartementServiceAc"
        :options="withEmptyValue(ministereDepartmentServiceAcKeys.options)"
      />
    </div>
    <div class="fr-col-12">
      <VeeSelect
        v-if="application.module.ministere"
        name="ministereStructure"
        :label="beneficiaryFieldLabels.ministereStructure"
        :options="withEmptyValue(ministereStructureKeys.options)"
      />
    </div>
  </BeneficiaryFormSection>
</template>

<script lang="ts" setup>
  import {
    BeneficiaryFamilySituation,
    BeneficiaryPensionOrganisation,
    BeneficiaryRelative,
    RelativeRelationship
  } from '@prisma/client'
  import {
    beneficiarySocioProfessionalCategoryKeys,
    incomeSourceKeys,
    pensionOrganisationKeys,
    ministereDepartmentServiceAcKeys,
    ministereStructureKeys,
    ministereCategorieKeys
  } from '~/client/options'
  import { beneficiaryFieldLabels } from '~/client/labels/beneficiary.labels'

  const props = defineProps<{
    familySituation: BeneficiaryFamilySituation | null | undefined
    majorChildren: number | null | undefined
    taxHouseholdMembers: Pick<BeneficiaryRelative, 'relationship'>[]
  }>()

  const { application } = usePermissions()

  const { value: pensionOrganisations } = useField<
    BeneficiaryPensionOrganisation[]
  >('pensionOrganisations')

  const hasPartner = computed(() => {
    const familySituation = props.familySituation
    return (
      familySituation === BeneficiaryFamilySituation.Married ||
      familySituation === BeneficiaryFamilySituation.CivilUnion ||
      familySituation === BeneficiaryFamilySituation.Cohabitation ||
      familySituation === BeneficiaryFamilySituation.CoupleWithChildren ||
      props.taxHouseholdMembers.filter(
        member => member.relationship === RelativeRelationship.Conjoint
      ).length > 0
    )
  })

  const hasMajorChildren = computed(
    () =>
      (props.majorChildren || 0) > 0 ||
      props.taxHouseholdMembers.filter(
        member => member.relationship === RelativeRelationship.EnfantMajeur
      ).length > 0
  )

  const hasOtherMembers = computed(
    () =>
      props.taxHouseholdMembers.filter(
        member =>
          member.relationship !== RelativeRelationship.Conjoint &&
          member.relationship !== RelativeRelationship.EnfantMajeur &&
          member.relationship !== RelativeRelationship.EnfantMineur
      ).length > 0
  )

  const hasOtherPensionOrganisations = computed(() =>
    (pensionOrganisations.value || []).includes(
      BeneficiaryPensionOrganisation.Other
    )
  )
</script>
