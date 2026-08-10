<template>
  <div class="fr-grid-row fr-grid-row--gutters">
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.socioProfessionalCategory"
      :value="
        beneficiarySocioProfessionalCategoryKeys.value(
          occupationIncome.socioProfessionalCategory
        )
      "
      class="fr-col-12 fr-col-lg-6"
    />
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.activityStatus"
      :value="activityStatus"
      class="fr-col-12 fr-col-lg-6"
    />

    <!-- ECOLE -->
    <template
      v-if="
        occupationIncome.schoolClass ||
        occupationIncome.schoolPrograms?.length ||
        occupationIncome.school
      "
    >
      <div class="fr-col-12">
        <hr class="" />
        <h5 class="fr-text--md fr-mb-0">Informations scolaires</h5>
      </div>
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.schoolClass"
        :value="beneficiarySchoolClassKeys.value(occupationIncome.schoolClass)"
        class="fr-col-12 fr-col-lg-6"
      />
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.schoolPrograms"
        :value="schoolPrograms"
        class="fr-col-12 fr-col-lg-6"
      />
      <BeneficiarySchoolInfo
        v-if="occupationIncome.school"
        :school="occupationIncome.school"
        class="fr-col-12 fr-col-lg-6"
      />
    </template>

    <!-- PRO -->
    <template v-if="hasProfessionnalInfo">
      <div class="fr-col-12">
        <hr class="" />
        <h5 class="fr-text--md fr-mb-0">Informations professionnelles</h5>
      </div>

      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.contractType"
        :value="
          beneficiaryContractTypeKeys.value(occupationIncome.contractType)
        "
        class="fr-col-12 fr-col-lg-6"
      />

      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.occupation"
        :value="occupationIncome.occupation"
        class="fr-col-12 fr-col-lg-6"
      />

      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.studyLevel"
        :value="beneficiaryStudyLevelKeys.value(occupationIncome.studyLevel)"
        class="fr-col-12 fr-col-lg-6"
      />
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.employer"
        :value="occupationIncome.employer"
        class="fr-col-12 fr-col-lg-6"
      />
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.employerSiret"
        :value="occupationIncome.employerSiret"
        class="fr-col-12 fr-col-lg-6"
      />
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.unemploymentNumber"
        :value="occupationIncome.unemploymentNumber"
        class="fr-col-12 fr-col-lg-6"
      />
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.cafNumber"
        :value="occupationIncome.cafNumber"
        class="fr-col-12 fr-col-lg-6"
      />
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.pensionOrganisations"
        :value="pensionOrganisations"
        class="fr-col-12 fr-col-lg-6"
      />
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.ministereCategorie"
        :value="
          ministereCategorieKeys.value(occupationIncome.ministereCategorie)
        "
        class="fr-col-12 fr-col-lg-6"
      />
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.ministereStructure"
        :value="
          ministereStructureKeys.value(occupationIncome.ministereStructure)
        "
        class="fr-col-12 fr-col-lg-6"
      />
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.ministereDepartementServiceAc"
        :value="
          ministereDepartmentServiceAcKeys.value(
            occupationIncome.ministereDepartementServiceAc
          )
        "
        class="fr-col-12 fr-col-lg-6"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { BeneficiaryPensionOrganisation } from '@prisma/client'
  import {
    beneficiarySocioProfessionalCategoryKeys,
    beneficiaryActivityStatusKeys,
    beneficiaryContractTypeKeys,
    pensionOrganisationKeys,
    ministereStructureKeys,
    ministereCategorieKeys,
    ministereDepartmentServiceAcKeys,
    beneficiaryStudyLevelKeys,
    beneficiarySchoolClassKeys,
    beneficiarySchoolProgramKeys
  } from '~/client/options'
  import type { GetBeneficiaryOccupationIncome } from '~/types/beneficiary'
  import { beneficiaryFieldLabels } from '~/client/labels/beneficiary.labels'

  const { occupationIncome } = defineProps<{
    occupationIncome: GetBeneficiaryOccupationIncome
  }>()

  const hasProfessionnalInfo = computed(
    () =>
      occupationIncome.contractType ||
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

  const activityStatus = computed(() =>
    arrayToString(
      occupationIncome.activityStatus || [],
      beneficiaryActivityStatusKeys.byKey
    )
  )

  const schoolPrograms = computed(() =>
    arrayToString(
      occupationIncome.schoolPrograms || [],
      beneficiarySchoolProgramKeys.byKey
    )
  )

  function arrayToString(arr: string[], options: Record<string, string>) {
    return (arr || []).map(o => options[o] || o).join(', ')
  }
</script>
