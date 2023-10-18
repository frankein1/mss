<template>
  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.socioProfessionalCategory"
      :value="
        BeneficiarySocioProfessionalCategoryKeys.value(
          beneficiary.socioProfessionalCategory
        )
      "
      class="fr-col-6"
    />
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.occupation"
      :value="beneficiary.occupation"
      class="fr-col-6"
    />
  </div>
  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.employer"
      :value="beneficiary.employer"
      class="fr-col-6"
    />
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.employerSiret"
      :value="beneficiary.employerSiret"
      class="fr-col-6"
    />
  </div>
  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.mainIncomeSource"
      :value="mainIncomeSource"
      class="fr-col-6"
    />
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.mainIncomeAmount"
      :value="euros(beneficiary.mainIncomeAmount)"
      class="fr-col-6"
    />
  </div>
  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.unemploymentNumber"
      :value="beneficiary.unemploymentNumber"
      class="fr-col-6"
    />
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.cafNumber"
      :value="beneficiary.cafNumber"
      class="fr-col-6"
    />
  </div>
  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.pensionOrganisations"
      :value="pensionOrganisations"
      class="fr-col-6"
    />
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.bank"
      :value="beneficiary.bank"
      class="fr-col-6"
    />
  </div>
  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.funeralContract"
      :value="beneficiary.funeralContract"
      class="fr-col-12"
    />
  </div>
  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.partnerMainIncomeSource"
      :value="partnerMainIncomeSource"
      class="fr-col-6"
    />
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.partnerMainIncomeAmount"
      :value="euros(beneficiary.partnerMainIncomeAmount)"
      class="fr-col-6"
    />
  </div>

  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.majorChildrenMainIncomeSource"
      :value="majorChildrenMainIncomeType"
      class="fr-col-6"
    />
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.majorChildrenMainIncomeAmount"
      :value="euros(beneficiary.majorChildrenMainIncomeAmount)"
      class="fr-col-6"
    />
  </div>

  <div
    v-if="isMinistryAgent"
    class="fr-grid-row"
  >
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.ministereCategorie"
      :value="MinistereCategorieKeys.value(beneficiary.ministereCategorie)"
      class="fr-col-6"
    />
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.ministereStructure"
      :value="MinistereStructureKeys.value(beneficiary.ministereStructure)"
      class="fr-col-6"
    />
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.ministereDepartementServiceAc"
      :value="
        MinistereDepartmentServiceAcKeys.value(
          beneficiary.ministereDepartementServiceAc
        )
      "
      class="fr-col-6"
    />
  </div>
</template>

<script lang="ts" setup>
  import { BeneficiaryPensionOrganisation } from '@prisma/client'
  import {
    BeneficiarySocioProfessionalCategoryKeys,
    incomeSourceLabels,
    pensionOrganisationLabels
  } from '~/client/options/beneficiary'
  import {
    MinistereStructureKeys,
    MinistereCategorieKeys,
    MinistereDepartmentServiceAcKeys
  } from '~/client/options/ministry'
  import type { GetBeneficiaryOutput } from '~/server/trpc/routers'
  import { beneficiaryFieldLabels } from '~/client/labels/beneficiary.labels'

  const props = defineProps<{
    beneficiary: GetBeneficiaryOutput
  }>()

  const isMinistryAgent = useMinistryAgent()

  const mainIncomeSource = computed(() =>
    arrayToString(props.beneficiary.mainIncomeSource || [], incomeSourceLabels)
  )

  const partnerMainIncomeSource = computed(() =>
    arrayToString(
      props.beneficiary.partnerMainIncomeSource || [],
      incomeSourceLabels
    )
  )

  const majorChildrenMainIncomeType = computed(() =>
    arrayToString(
      props.beneficiary.majorChildrenMainIncomeSource || [],
      incomeSourceLabels
    )
  )

  const pensionOrganisations = computed(() =>
    arrayToString(
      props.beneficiary.pensionOrganisations?.filter(
        f => f !== BeneficiaryPensionOrganisation.Other
      ) || [],
      pensionOrganisationLabels
    )
  )

  function arrayToString(arr: string[], options: Record<string, string>) {
    return (arr || []).map(o => options[o] || o).join(', ')
  }
</script>
