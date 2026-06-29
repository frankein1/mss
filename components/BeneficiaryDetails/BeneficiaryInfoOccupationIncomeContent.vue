<template>
  <div class="fr-grid-row fr-grid-row--gutters">
    <div class="fr-col-12">
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.socioProfessionalCategory"
        :value="
          beneficiarySocioProfessionalCategoryKeys.value(
            occupationIncome.socioProfessionalCategory
          )
        "
      />
    </div>

    <!-- ECOLE -->
    <template v-if="occupationIncome.schoolClass || occupationIncome.school">
      <div class="fr-col-12">
        <hr class="" />
        <h5 class="fr-text--md fr-mb-0">Informations scolaires</h5>
      </div>
      <div class="fr-col-12 fr-col-lg-6">
        <BeneficiaryInfoLabel
          :label="beneficiaryFieldLabels.schoolClass"
          :value="
            beneficiarySchoolClassKeys.value(occupationIncome.schoolClass)
          "
        />
      </div>
      <div class="fr-col-12 fr-col-lg-6">
        <BeneficiarySchoolInfo
          v-if="occupationIncome.school"
          :school="occupationIncome.school"
        />
      </div>
    </template>

    <!-- PRO -->
    <template v-if="hasProfessionnalInfo">
      <div class="fr-col-12">
        <hr class="" />
        <h5 class="fr-text--md fr-mb-0">Informations professionnelles</h5>
      </div>

      <div class="fr-col-12 fr-col-lg-6">
        <BeneficiaryInfoLabel
          :label="beneficiaryFieldLabels.occupation"
          :value="occupationIncome.occupation"
        />
      </div>

      <div class="fr-col-12 fr-col-lg-6">
        <BeneficiaryInfoLabel
          :label="beneficiaryFieldLabels.studyLevel"
          :value="beneficiaryStudyLevelKeys.value(occupationIncome.studyLevel)"
        />
      </div>
      <div class="fr-col-12 fr-col-lg-6">
        <BeneficiaryInfoLabel
          :label="beneficiaryFieldLabels.employer"
          :value="occupationIncome.employer"
        />
      </div>
      <div class="fr-col-12 fr-col-lg-6">
        <BeneficiaryInfoLabel
          :label="beneficiaryFieldLabels.employerSiret"
          :value="occupationIncome.employerSiret"
        />
      </div>
      <div class="fr-col-12 fr-col-lg-6">
        <BeneficiaryInfoLabel
          :label="beneficiaryFieldLabels.unemploymentNumber"
          :value="occupationIncome.unemploymentNumber"
        />
      </div>
      <div class="fr-col-12 fr-col-lg-6">
        <BeneficiaryInfoLabel
          :label="beneficiaryFieldLabels.cafNumber"
          :value="occupationIncome.cafNumber"
        />
      </div>
      <div class="fr-col-12 fr-col-lg-6">
        <BeneficiaryInfoLabel
          :label="beneficiaryFieldLabels.pensionOrganisations"
          :value="pensionOrganisations"
        />
      </div>
      <div class="fr-col-12 fr-col-lg-6">
        <BeneficiaryInfoLabel
          :label="beneficiaryFieldLabels.ministereCategorie"
          :value="
            ministereCategorieKeys.value(occupationIncome.ministereCategorie)
          "
        />
      </div>
      <div class="fr-col-12 fr-col-lg-6">
        <BeneficiaryInfoLabel
          :label="beneficiaryFieldLabels.ministereStructure"
          :value="
            ministereStructureKeys.value(occupationIncome.ministereStructure)
          "
        />
      </div>
      <div class="fr-col-12 fr-col-lg-6">
        <BeneficiaryInfoLabel
          :label="beneficiaryFieldLabels.ministereDepartementServiceAc"
          :value="
            ministereDepartmentServiceAcKeys.value(
              occupationIncome.ministereDepartementServiceAc
            )
          "
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { BeneficiaryPensionOrganisation } from '@prisma/client'
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

  const { occupationIncome } = defineProps<{
    occupationIncome: GetBeneficiaryOccupationIncome
  }>()

  const hasProfessionnalInfo = computed(
    () =>
      occupationIncome.occupation ||
      occupationIncome.studyLevel ||
      occupationIncome.employer ||
      occupationIncome.employerSiret ||
      occupationIncome.unemploymentNumber ||
      occupationIncome.cafNumber ||
      pensionOrganisations.value ||
      occupationIncome.ministereCategorie ||
      occupationIncome.ministereStructure ||
      occupationIncome.ministereDepartementServiceAc
  )

  const pensionOrganisations = computed(() =>
    arrayToString(
      occupationIncome.pensionOrganisations?.filter(
        f => f !== BeneficiaryPensionOrganisation.Other
      ) || [],
      pensionOrganisationKeys.byKey
    )
  )

  function arrayToString(arr: string[], options: Record<string, string>) {
    return (arr || []).map(o => options[o] || o).join(', ')
  }
</script>
