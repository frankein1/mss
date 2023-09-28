<template>
  <BeneficiaryFormSection>
    <div class="fr-col-12">
      <VeeSelect
        name="socioProfessionalCategory"
        label="Catégorie socio-professionnelle"
        :options="withEmptyValue(beneficiarySocioProfessionalCategoryOptions)"
      />
    </div>
    <div class="fr-col-12">
      <VeeInput
        name="occupation"
        label="Profession(s)"
      />
    </div>
    <div class="fr-col-12">
      <VeeInput
        name="employer"
        label="Employeur"
      />
    </div>
    <div class="fr-col-12">
      <VeeInput
        name="employerSiret"
        label="SIRET de l'employeur"
      />
    </div>
    <div class="fr-col-12">
      <VeeMultiSelect
        name="mainIncomeSource"
        label="Natures des ressources"
        :options="incomeSourceOptions"
        label-class="fr-text--regular"
        dropdown
      />
    </div>
    <div class="fr-col-12">
      <VeeCurrencyInput
        name="mainIncomeAmount"
        label="Montant des ressources"
      />
    </div>
    <template v-if="hasPartner">
      <div class="fr-col-12">
        <VeeMultiSelect
          name="partnerMainIncomeSource"
          label="Natures des ressources du conjoint"
          :options="incomeSourceOptions"
          label-class="fr-text--regular"
          dropdown
        />
      </div>
      <div class="fr-col-12">
        <VeeCurrencyInput
          name="partnerMainIncomeAmount"
          label="Montant des ressources du conjoint"
        />
      </div>
    </template>
    <template v-if="hasMajorChildren">
      <div class="fr-col-12">
        <VeeMultiSelect
          name="majorChildrenMainIncomeSource"
          label="Natures des ressources des enfants majeurs"
          :options="incomeSourceOptions"
          label-class="fr-text--regular"
          dropdown
        />
      </div>
      <div class="fr-col-12">
        <VeeCurrencyInput
          name="majorChildrenMainIncomeAmount"
          label="Montant des ressources des enfants majeurs"
        />
      </div>
    </template>
    <div class="fr-col-12">
      <VeeInput
        name="unemploymentNumber"
        label="N° Pôle Emploi"
      />
    </div>
    <div class="fr-col-12">
      <VeeMultiSelect
        name="pensionOrganisations"
        label="Organismes de retraite"
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
        label="Autre(s) organisme(s) de retraite"
      />
    </div>
    <div class="fr-col-12">
      <VeeInput
        name="cafNumber"
        label="N° CAF"
      />
    </div>
    <div class="fr-col-12">
      <VeeInput
        name="bank"
        label="Banque"
      />
    </div>
    <div class="fr-col-12">
      <VeeInput
        name="funeralContract"
        label="Contrat obsèques"
      />
    </div>
    <template v-if="isMinistryAgent">
      <div class="fr-col-12">
        <VeeSelect
          name="ministereCategorie"
          label="Catégorie"
          :options="withEmptyValue(ministereCategorieOptions)"
        />
      </div>
      <div class="fr-col-12">
        <VeeSearchableSelect
          name="ministereDepartementServiceAc"
          label="Département ou service de l'Administration Centrale"
          :options="withEmptyValue(ministereDepartmentServiceAcOptions)"
        />
      </div>
      <div class="fr-col-12">
        <VeeSelect
          name="ministereDepartementServiceAc"
          label="Département ou service de l'Administration Centrale"
          :options="withEmptyValue(ministereDepartmentServiceAcOptions)"
        />
      </div>
      <div class="fr-col-12">
        <VeeSelect
          name="ministereStructure"
          label="Structure de rattachement"
          :options="withEmptyValue(ministereStructureOptions)"
        />
      </div>
    </template>
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

  const props = defineProps<{
    familySituation: BeneficiaryFamilySituation | null | undefined
    majorChildren: number | null | undefined
  }>()

  const { value: pensionOrganisations } = useField<
    BeneficiaryPensionOrganisation[]
  >('pensionOrganisations')

  const isMinistryAgent = useMinistryAgent()

  const hasPartner = computed(() => {
    const familySituation = props.familySituation
    if (!familySituation) {
      return false
    }
    return (
      familySituation === BeneficiaryFamilySituation.Married ||
      familySituation === BeneficiaryFamilySituation.CivilUnion ||
      familySituation === BeneficiaryFamilySituation.Cohabitation
    )
  })

  const hasMajorChildren = computed(() => (props.majorChildren || 0) > 0)

  const hasOtherPensionOrganisations = computed(() =>
    (pensionOrganisations.value || []).includes(
      BeneficiaryPensionOrganisation.Other
    )
  )
</script>
