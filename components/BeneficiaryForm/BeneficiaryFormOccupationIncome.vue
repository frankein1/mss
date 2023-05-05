<template>
  <AccordionFieldset
    class="occupation-income-accordion-fieldset"
    label="Activité/Revenu"
  >
    <div class="fr-container--fluid">
      <div class="fr-grid-row fr-grid-row--gutters form-grid">
        <AtomSelect
          name="socioProfessionalCategory"
          label="Catégorie socio-professionnelle"
          :options="withEmptyValue(beneficiarySocioProfessionalCategoryOptions)"
          :model-value="beneficiary?.socioProfessionalCategory || ''"
        />
        <AtomInput
          name="occupation"
          label="Profession(s)"
          :value="beneficiary?.occupation || ''"
        />
        <AtomInput
          name="employer"
          label="Employeur"
          :value="beneficiary?.employer || ''"
        />
        <AtomInput
          name="employerSiret"
          label="SIRET de l'employeur"
          :value="beneficiary?.employerSiret || ''"
        />
        <AtomMultiSelect
          name="mainIncomeSource"
          label="Natures des ressources"
          :options="incomeSourceOptions"
          :model-value="beneficiary?.mainIncomeSource || []"
          label-class="fr-text--regular"
          dropdown
        />
        <AtomCurrencyInput
          name="mainIncomeAmount"
          label="Montant des ressources"
          :value="beneficiary?.mainIncomeAmount || ''"
        />
        <AtomMultiSelect
          v-show="hasPartner"
          name="partnerMainIncomeSource"
          label="Natures des ressources du conjoint"
          :options="incomeSourceOptions"
          :model-value="beneficiary?.partnerMainIncomeSource || []"
          label-class="fr-text--regular"
          dropdown
        />
        <AtomCurrencyInput
          v-show="hasPartner"
          name="partnerMainIncomeAmount"
          label="Montant des ressources du conjoint"
          :value="beneficiary?.partnerMainIncomeAmount || ''"
        />
        <AtomMultiSelect
          v-show="majorChildrenNb"
          name="majorChildrenMainIncomeSource"
          label="Natures des ressources des enfants majeurs"
          :options="incomeSourceOptions"
          :model-value="beneficiary?.majorChildrenMainIncomeSource || []"
          label-class="fr-text--regular"
          dropdown
        />
        <AtomCurrencyInput
          v-show="majorChildrenNb"
          name="majorChildrenMainIncomeAmount"
          label="Montant des ressources des enfants majeurs"
          :value="beneficiary?.majorChildrenMainIncomeAmount || ''"
        />
        <AtomInput
          name="unemploymentNumber"
          label="N° Pôle Emploi"
          :value="beneficiary?.unemploymentNumber || ''"
        />
        <AtomMultiSelect
          v-model="pensionOrganisations"
          name="pension_organisations"
          label="Organismes de retraite"
          :options="pensionOrganisationOptions"
          label-class="fr-text--regular"
          dropdown
        />
        <AtomInput
          v-if="hasOtherPensionOrganisations"
          name="other_pension_organisations"
          label="Autre(s) organisme(s) de retraite"
          :value="initialOtherPensionOrganisations"
        />
        <AtomInput
          name="cafNumber"
          label="N° CAF"
          :value="beneficiary?.cafNumber || ''"
        />
        <AtomInput
          name="bank"
          label="Banque"
          :value="beneficiary?.bank || ''"
        />
        <AtomInput
          name="funeralContract"
          label="Contrat obsèques"
          :value="beneficiary?.funeralContract || ''"
        />
        <template v-if="isMinistryAgent">
          <AtomSelect
            name="ministereCategorie"
            label="Catégorie"
            :options="withEmptyValue(ministerOptions)"
            :model-value="beneficiary?.ministereCategorie || ''"
          />
          <AtomSearchableSelect
            name="ministereDepartementServiceAc"
            label="Département ou service de l'Administration Centrale"
            :options="ministereDepartmentServiceAcOptions"
            :value="beneficiary?.ministereDepartementServiceAc || ''"
          />
          <AtomSelect
            name="ministereStructure"
            label="Structure de rattachement"
            :options="withEmptyValue(ministereStructureOptions)"
            :model-value="beneficiary?.ministereStructure || ''"
          />
        </template>
      </div>
    </div>
  </AccordionFieldset>
</template>

<script lang="ts" setup>
  import { Beneficiary } from '@prisma/client'
  import {
    beneficiarySocioProfessionalCategoryOptions,
    incomeSourceOptions,
    pensionOrganisationOptions,
    PensionOrganisation
  } from '~/client/options/beneficiary'
  import {
    ministerOptions,
    ministereDepartmentServiceAcOptions,
    ministereStructureOptions
  } from '~/client/options/ministry'
  import { useAuthStore } from '~/store/auth'

  const props = defineProps<{
    beneficiary: Beneficiary
    familySituation: string
    majorChildrenNb: number
  }>()

  const isMinistryAgent = useAuthStore().isMinistryAgent

  // Filter other pension organisations input from free field
  const beneficiaryPensionOrganisations =
    props.beneficiary?.pensionOrganisations?.filter(org =>
      pensionOrganisationOptions.has(org)
    )
  const pensionOrganisations = ref<string[]>(
    beneficiaryPensionOrganisations || []
  )

  const hasPartner = computed(() => props.familySituation)

  const hasOtherPensionOrganisations = computed(() =>
    pensionOrganisations.value.includes(PensionOrganisation.Other)
  )

  const initialOtherPensionOrganisations = computed(() => {
    if (!hasOtherPensionOrganisations.value) return ''
    return props.beneficiary?.pensionOrganisations?.find(
      org => !pensionOrganisationOptions.has(org)
    )
  })
</script>

<style>
  /* Allow to display ministere_departement_service_ac searchable select options within the accordion, as overflow is hidden */
  .occupation-income-accordion-fieldset.fr-accordion .fr-collapse--expanded {
    padding-bottom: 9.625rem;
  }
</style>
