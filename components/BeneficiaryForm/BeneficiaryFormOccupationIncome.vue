<template>
  <div class="fr-container--fluid">
    <div class="fr-grid-row fr-grid-row--gutters form-grid">
      <VeeSelect
        name="occupation.socioProfessionalCategory"
        label="Catégorie socio-professionnelle"
        :options="withEmptyValue(beneficiarySocioProfessionalCategoryOptions)"
      />
      <VeeInput
        name="occupation.occupation"
        label="Profession(s)"
      />
      <VeeInput
        name="occupation.employer"
        label="Employeur"
      />
      <VeeInput
        name="occupation.employerSiret"
        label="SIRET de l'employeur"
      />
      <VeeMultiSelect
        name="occupation.mainIncomeSource"
        label="Natures des ressources"
        :options="incomeSourceOptions"
        label-class="fr-text--regular"
        dropdown
      />
      <VeeInput
        name="occupation.mainIncomeAmount"
        label="Montant des ressources"
      />
    </div>
    <div
      v-show="hasPartner"
      class="fr-grid-row fr-grid-row--gutters form-grid"
    >
      <VeeMultiSelect
        name="occupation.partnerMainIncomeSource"
        label="Natures des ressources du conjoint"
        :options="incomeSourceOptions"
        label-class="fr-text--regular"
        dropdown
      />
      <VeeInput
        name="occupation.partnerMainIncomeAmount"
        label="Montant des ressources du conjoint"
      />
    </div>

    <div
      v-show="hasMajorChildren"
      class="fr-grid-row fr-grid-row--gutters form-grid"
    >
      <VeeMultiSelect
        name="occupation.majorChildrenMainIncomeSource"
        label="Natures des ressources des enfants majeurs"
        :options="incomeSourceOptions"
        label-class="fr-text--regular"
        dropdown
      />
      <VeeInput
        name="occupation.majorChildrenMainIncomeAmount"
        label="Montant des ressources des enfants majeurs"
      />
    </div>
    <div class="fr-grid-row fr-grid-row--gutters form-grid">
      <VeeInput
        name="occupation.unemploymentNumber"
        label="N° Pôle Emploi"
      />
      <VeeMultiSelect
        name="occupation.pensionOrganisations"
        label="Organismes de retraite"
        :options="pensionOrganisationOptions"
        label-class="fr-text--regular"
        dropdown
      />
      <VeeInput
        v-if="hasOtherPensionOrganisations"
        name="occupation.otherPensionOrganisations"
        label="Autre(s) organisme(s) de retraite"
      />
      <VeeInput
        name="occupation.cafNumber"
        label="N° CAF"
      />
      <VeeInput
        name="occupation.bank"
        label="Banque"
      />
      <VeeInput
        name="occupation.funeralContract"
        label="Contrat obsèques"
      />
    </div>
    <div
      v-show="isMinistryAgent"
      class="fr-grid-row fr-grid-row--gutters form-grid"
    >
      <VeeSelect
        name="occupation.ministereCategorie"
        label="Catégorie"
        :options="withEmptyValue(ministerOptions)"
      />
      <!-- <AtomSearchableSelect
          name="occupation.ministereDepartementServiceAc"
          label="Département ou service de l'Administration Centrale"
          :options="ministereDepartmentServiceAcOptions"
          :value="beneficiary?.ministereDepartementServiceAc || ''"
        /> -->
      <VeeSelect
        name="occupation.ministereDepartementServiceAc"
        label="Département ou service de l'Administration Centrale"
        :options="ministereDepartmentServiceAcOptions"
      />
      <VeeSelect
        name="occupation.ministereStructure"
        label="Structure de rattachement"
        :options="withEmptyValue(ministereStructureOptions)"
      />
    </div>
  </div>
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
    ministerOptions,
    ministereDepartmentServiceAcOptions,
    ministereStructureOptions
  } from '~/client/options/ministry'
  import { UpdateBeneficiaryInput } from '~/server/schema/beneficiary.schema'
  import { useAuthStore } from '~/store/auth'

  const props = defineProps<{
    values: UpdateBeneficiaryInput
  }>()

  const isMinistryAgent = useAuthStore().isMinistryAgent

  const hasPartner = computed(() => {
    const familySituation = props.values.taxHousehold.familySituation
    if (!familySituation) {
      return false
    }
    return (
      familySituation === BeneficiaryFamilySituation.Married ||
      familySituation === BeneficiaryFamilySituation.CivilUnion ||
      familySituation === BeneficiaryFamilySituation.Cohabitation
    )
  })

  const hasMajorChildren = computed(
    () => (props.values.taxHousehold.majorChildren || 0) > 0
  )

  const hasOtherPensionOrganisations = computed(() =>
    (props.values.occupation.pensionOrganisations || []).includes(
      BeneficiaryPensionOrganisation.Other
    )
  )
</script>
