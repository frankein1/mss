<template>
  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.socioProfessionalCategory"
      :value="
        beneficiarySocioProfessionalCategoryKeys.value(
          occupationIncome.socioProfessionalCategory
        )
      "
      class="fr-col-12 fr-col-md-6"
    />
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.occupation"
      :value="occupationIncome.occupation"
      class="fr-col-12 fr-col-md-6"
    />
  </div>
  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      v-if="
        occupationIncome.socioProfessionalCategory ===
        BeneficiarySocioProfessionalCategory.Student
      "
      :label="beneficiaryFieldLabels.schoolName"
      :value="occupationIncome.schoolName"
      class="fr-col-12"
    />
  </div>
  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      v-if="
        occupationIncome.socioProfessionalCategory ===
          BeneficiarySocioProfessionalCategory.Student &&
        occupationIncome.isSchoolInQPV === true
      "
      :label="beneficiaryFieldLabels.isSchoolInQPV"
      :value="occupationIncome.isSchoolInQPV ? 'Oui' : 'Non'"
      class="fr-col-12"
    />
  </div>
  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.studyLevel"
      :value="beneficiaryStudyLevelKeys.value(occupationIncome.studyLevel)"
      class="fr-col-12 fr-col-md-6"
    />
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.schoolClass"
      :value="beneficiarySchoolClassKeys.value(occupationIncome.schoolClass)"
      class="fr-col-12 fr-col-md-6"
    />
  </div>
  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.employer"
      :value="occupationIncome.employer"
      class="fr-col-12 fr-col-md-6"
    />
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.employerSiret"
      :value="occupationIncome.employerSiret"
      class="fr-col-12 fr-col-md-6"
    />
  </div>
  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.unemploymentNumber"
      :value="occupationIncome.unemploymentNumber"
      class="fr-col-12 fr-col-md-6"
    />
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.cafNumber"
      :value="occupationIncome.cafNumber"
      class="fr-col-12 fr-col-md-6"
    />
  </div>
  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.pensionOrganisations"
      :value="pensionOrganisations"
      class="fr-col-12 fr-col-md-6"
    />
  </div>

  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.ministereCategorie"
      :value="ministereCategorieKeys.value(occupationIncome.ministereCategorie)"
      class="fr-col-12 fr-col-md-6"
    />
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.ministereStructure"
      :value="ministereStructureKeys.value(occupationIncome.ministereStructure)"
      class="fr-col-12 fr-col-md-6"
    />
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.ministereDepartementServiceAc"
      :value="
        ministereDepartmentServiceAcKeys.value(
          occupationIncome.ministereDepartementServiceAc
        )
      "
      class="fr-col-12 fr-col-md-6"
    />
  </div>
</template>

<script lang="ts" setup>
  import {
    BeneficiaryPensionOrganisation,
    BeneficiarySocioProfessionalCategory
  } from '@prisma/client'
  import {
    beneficiarySocioProfessionalCategoryKeys,
    pensionOrganisationKeys,
    ministereStructureKeys,
    ministereCategorieKeys,
    ministereDepartmentServiceAcKeys,
    beneficiaryStudyLevelKeys,
    beneficiarySchoolClassKeys
  } from '~/client/options'
  import type { GetBeneficiaryOccupationIncome } from '~/types/beneficiary'
  import { beneficiaryFieldLabels } from '~/client/labels/beneficiary.labels'

  const props = defineProps<{
    occupationIncome: GetBeneficiaryOccupationIncome
  }>()

  const pensionOrganisations = computed(() =>
    arrayToString(
      props.occupationIncome.pensionOrganisations?.filter(
        f => f !== BeneficiaryPensionOrganisation.Other
      ) || [],
      pensionOrganisationKeys.byKey
    )
  )

  function arrayToString(arr: string[], options: Record<string, string>) {
    return (arr || []).map(o => options[o] || o).join(', ')
  }
</script>
