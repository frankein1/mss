<template>
  <section
    v-if="hasOccupationIncomeSection"
    class="beneficiary-details-section"
  >
    <h2 class="fr-h5">Activité/Revenu</h2>
    <ul class="information-list">
      <li v-if="beneficiary.socioProfessionalCategory">
        <span class="information-label">Catégorie socio-professionnelle :</span>
        {{
          beneficiarySocioProfessionalCategoryLabels[
            beneficiary.socioProfessionalCategory
          ]
        }}
      </li>
      <li v-if="beneficiary.occupation">
        <span class="information-label">Profession(s) :</span>
        {{ beneficiary.occupation }}
      </li>
      <li v-if="beneficiary.employer">
        <span class="information-label">Employeur :</span>
        {{ beneficiary.employer }}
      </li>
      <li v-if="beneficiary.employerSiret">
        <span class="information-label">SIRET de l'employeur :</span>
        {{ beneficiary.employerSiret }}
      </li>
      <li v-if="mainIncomeSource">
        <span class="information-label">Nature des ressources :</span>
        {{ mainIncomeSource }}
      </li>
      <li v-if="beneficiary.mainIncomeAmount">
        <span class="information-label">Montant des ressources :</span>
        {{ euros(beneficiary.mainIncomeAmount) }}
      </li>
      <li v-if="partnerMainIncomeSource">
        <span class="information-label"
          >Nature des ressources du conjoint :</span
        >
        {{ partnerMainIncomeSource }}
      </li>
      <li v-if="beneficiary.partnerMainIncomeAmount">
        <span class="information-label"
          >Montant des ressources du conjoint :</span
        >
        {{ euros(beneficiary.partnerMainIncomeAmount) }}
      </li>
      <li v-if="majorChildrenMainIncomeType">
        <span class="information-label"
          >Nature des ressources des enfants majeurs :</span
        >
        {{ majorChildrenMainIncomeType }}
      </li>
      <li v-if="beneficiary.majorChildrenMainIncomeAmount">
        <span class="information-label"
          >Montant des ressources des enfants majeurs :</span
        >
        {{ euros(beneficiary.majorChildrenMainIncomeAmount) }}
      </li>
      <li v-if="beneficiary.unemploymentNumber">
        <span class="information-label">N° Pôle Emploi :</span>
        {{ beneficiary.unemploymentNumber }}
      </li>
      <li v-if="pensionOrganisations">
        <span class="information-label">Organisme(s) de retraite :</span>
        {{ pensionOrganisations }}
      </li>
      <li v-if="beneficiary.cafNumber">
        <span class="information-label">N° CAF :</span>
        {{ beneficiary.cafNumber }}
      </li>
      <li v-if="beneficiary.bank">
        <span class="information-label">Banque :</span>
        {{ beneficiary.bank }}
      </li>
      <li v-if="beneficiary.funeralContract">
        <span class="information-label">Contrat obsèques :</span>
        {{ beneficiary.funeralContract }}
      </li>
      <template v-if="isMinistryAgent">
        <li v-if="beneficiary.ministereCategorie">
          <span class="information-label">Catégorie :</span>
          {{ ministereCategorieLabels[beneficiary.ministereCategorie] }}
        </li>
        <li v-if="beneficiary.ministereDepartementServiceAc">
          <span class="information-label"
            >Département ou service de l'Administration Centrale :</span
          >
          {{
            ministereDepartmentServiceAcLabels[
              beneficiary.ministereDepartementServiceAc
            ]
          }}
        </li>
        <li v-if="beneficiary.ministereStructure">
          <span class="information-label">Structure de rattachement :</span>
          {{ ministereStructureLabels[beneficiary.ministereStructure] }}
        </li>
      </template>
    </ul>
  </section>
</template>

<script lang="ts" setup>
  import { BeneficiaryPensionOrganisation } from '@prisma/client'
  import {
    beneficiarySocioProfessionalCategoryLabels,
    incomeSourceLabels,
    pensionOrganisationLabels
  } from '~/client/options/beneficiary'
  import {
    ministereStructureLabels,
    ministereCategorieLabels,
    ministereDepartmentServiceAcLabels
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
