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

    <AtomCallout class="callout-container">
      <div class="budget-redirection">
        <div>
          <p>
            Pour détailler les
            <strong
              >ressources du bénéficiaire et des membres de son foyer</strong
            >, rendez-vous dans l’onglet “Budget” du dossier bénéficiaire.
          </p>
        </div>

        <AtomPictogram path="/pictograms/money.svg"></AtomPictogram>
      </div>
    </AtomCallout>
  </BeneficiaryFormSection>
</template>

<script lang="ts" setup>
  import { BeneficiaryPensionOrganisation } from '@prisma/client'
  import {
    beneficiarySocioProfessionalCategoryKeys,
    pensionOrganisationKeys,
    ministereDepartmentServiceAcKeys,
    ministereStructureKeys,
    ministereCategorieKeys
  } from '~/client/options'
  import { beneficiaryFieldLabels } from '~/client/labels/beneficiary.labels'

  const { application } = usePermissions()

  const { value: pensionOrganisations } = useField<
    BeneficiaryPensionOrganisation[]
  >('pensionOrganisations')

  const hasOtherPensionOrganisations = computed(() =>
    (pensionOrganisations.value || []).includes(
      BeneficiaryPensionOrganisation.Other
    )
  )
</script>

<style scoped>
  .callout-container {
    margin-top: 2.5rem;
  }

  .budget-redirection {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
</style>
