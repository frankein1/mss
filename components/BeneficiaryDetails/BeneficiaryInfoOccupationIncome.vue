<template>
  <div
    v-if="hasOccupationIncomeSection"
    class="fr-container"
  >
    <div class="fr-grid-row">
      <div class="fr-col-6">
        <BeneficiaryInfoLabel
          label="Catégorie socio-professionnelle"
          :value="
            BeneficiarySocioProfessionalCategoryKeys.value(
              beneficiary.socioProfessionalCategory
            )
          "
        />
        <BeneficiaryInfoLabel
          label="Employeur"
          :value="beneficiary.employer"
        />
        <BeneficiaryInfoLabel
          label="Nature des ressources"
          :value="mainIncomeSource"
        />
        <BeneficiaryInfoLabel
          label="N° Pôle Emploi"
          :value="beneficiary.unemploymentNumber"
        />
        <BeneficiaryInfoLabel
          label="Organisme de retraite"
          :value="pensionOrganisations"
        />
        <BeneficiaryInfoLabel
          label="Contrat obsèque"
          :value="beneficiary.funeralContract"
        />
      </div>
      <div class="fr-col-6">
        <BeneficiaryInfoLabel
          label="Profession(s)"
          :value="beneficiary.occupation"
        />
        <BeneficiaryInfoLabel
          label="SIRET de l'employeur"
          :value="beneficiary.employerSiret"
        />
        <BeneficiaryInfoLabel
          label="Montant des ressources"
          :value="euros(beneficiary.mainIncomeAmount)"
        />
        <BeneficiaryInfoLabel
          label="N° CAF"
          :value="beneficiary.cafNumber"
        />
        <BeneficiaryInfoLabel
          label="Banque"
          :value="beneficiary.bank"
        />
      </div>
    </div>
    <div class="fr-grid-row">
      <div class="fr-col-6">
        <BeneficiaryInfoLabel
          label="Nature des ressources du conjoint"
          :value="partnerMainIncomeSource"
        />
      </div>
      <div class="fr-col-6">
        <BeneficiaryInfoLabel
          label="Montant des ressources du conjoint"
          :value="euros(beneficiary.partnerMainIncomeAmount)"
        />
      </div>
    </div>

    <div class="fr-grid-row">
      <div class="fr-col-6">
        <BeneficiaryInfoLabel
          label="Nature des ressources des enfants majeurs"
          :value="majorChildrenMainIncomeType"
        />
      </div>
      <div class="fr-col-6">
        <BeneficiaryInfoLabel
          label="Montant des ressources des enfants majeurs"
          :value="euros(beneficiary.majorChildrenMainIncomeAmount)"
        />
      </div>
    </div>

    <div
      v-if="isMinistryAgent"
      class="fr-grid-row"
    >
      <div class="fr-col-6">
        <BeneficiaryInfoLabel
          label="Catégorie"
          :value="MinistereCategorieKeys.value(beneficiary.ministereCategorie)"
        />
        <BeneficiaryInfoLabel
          label="Structure de rattachement"
          :value="MinistereStructureKeys.value(beneficiary.ministereStructure)"
        />
      </div>
      <div class="fr-col-6">
        <BeneficiaryInfoLabel
          label="Département ou service de l'Administration Centrale"
          :value="
            MinistereDepartmentServiceAcKeys.value(
              beneficiary.ministereDepartementServiceAc
            )
          "
        />
      </div>
    </div>
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
  import type { GetBeneficiaryOutput } from '~/server/routers'

  const props = defineProps<{
    beneficiary: GetBeneficiaryOutput
  }>()

  const isMinistryAgent = useMinistryAgent()

  const hasOccupationIncomeSection = computed(
    () =>
      props.beneficiary.socioProfessionalCategory ||
      props.beneficiary.occupation ||
      props.beneficiary.employer ||
      props.beneficiary.employerSiret ||
      props.beneficiary.mainIncomeSource?.length ||
      props.beneficiary.mainIncomeAmount ||
      props.beneficiary.partnerMainIncomeSource?.length ||
      props.beneficiary.partnerMainIncomeAmount ||
      props.beneficiary.majorChildrenMainIncomeSource?.length ||
      props.beneficiary.majorChildrenMainIncomeAmount ||
      props.beneficiary.unemploymentNumber ||
      props.beneficiary.pensionOrganisations?.length ||
      props.beneficiary.cafNumber ||
      props.beneficiary.bank ||
      props.beneficiary.funeralContract ||
      (isMinistryAgent.value &&
        (props.beneficiary.ministereCategorie ||
          props.beneficiary.ministereDepartementServiceAc ||
          props.beneficiary.ministereStructure))
  )

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
