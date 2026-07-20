<template>
  <section class="fr-p-3v">
    <h2 class="title-blue fr-mb-6v">
      {{ routes.beneficiary.AppBeneficiaryEditOccupation.title }}
    </h2>

    <BeneficiaryFormSection>
      <div class="fr-col-12 fr-col-lg-6">
        <VeeSelect
          name="socioProfessionalCategory"
          :label="beneficiaryFieldLabels.socioProfessionalCategory"
          :options="
            withEmptyValue(beneficiarySocioProfessionalCategoryKeys.options)
          "
        />
      </div>
      <div class="fr-col-12 fr-col-lg-6">
        <MultiSelect
          name="activityStatus"
          :label="beneficiaryFieldLabels.activityStatus"
          :options="beneficiaryActivityStatusKeys.options"
        />
      </div>
    </BeneficiaryFormSection>

    <BeneficiaryFormSection
      v-if="
        socioProfessionalCategory ===
        BeneficiarySocioProfessionalCategory.Student
      "
      section-title="Informations scolaires"
    >
      <div class="fr-col-12">
        <AtomCallout class>
          <p>
            Pour les bénéficiaires en études, vous pouvez maintenant saisir la
            classe actuellement fréquentée par l'apprenant en plus de son niveau
            scolaire.
          </p>
        </AtomCallout>
      </div>

      <BeneficiaryFormSchoolSearch :initial-school="localInitialSchool" />

      <div class="fr-col-12">
        <VeeSelectOptionGroup
          name="schoolClass"
          :label="beneficiaryFieldLabels.schoolClass"
          :groups="beneficiarySchoolClassGroups"
        />
      </div>
    </BeneficiaryFormSection>

    <BeneficiaryFormSection section-title="Informations professionnelles">
      <div class="fr-col-12">
        <VeeSelect
          name="contractType"
          :label="beneficiaryFieldLabels.contractType"
          :options="withEmptyValue(beneficiaryContractTypeKeys.options)"
        />
      </div>
      <div class="fr-col-12">
        <VeeInput
          name="occupation"
          :label="beneficiaryFieldLabels.occupation"
        />
      </div>
      <div class="fr-col-12">
        <VeeSelect
          name="studyLevel"
          :label="beneficiaryFieldLabels.studyLevel"
          :options="withEmptyValue(beneficiaryStudyLevelKeys.options)"
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
        <MultiSelect
          name="pensionOrganisations"
          :label="beneficiaryFieldLabels.pensionOrganisations"
          :options="pensionOrganisationKeys.options"
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

      <template v-if="application.module.ministere">
        <div class="fr-col-12">
          <VeeSelect
            name="ministereCategorie"
            :label="beneficiaryFieldLabels.ministereCategorie"
            :options="withEmptyValue(ministereCategorieKeys.options)"
          />
        </div>
        <div class="fr-col-12">
          <VeeCombobox
            name="ministereDepartementServiceAc"
            :label="beneficiaryFieldLabels.ministereDepartementServiceAc"
            :options="withEmptyValue(ministereDepartmentServiceAcKeys.options)"
          />
        </div>
        <div class="fr-col-12">
          <VeeSelect
            name="ministereStructure"
            :label="beneficiaryFieldLabels.ministereStructure"
            :options="withEmptyValue(ministereStructureKeys.options)"
          />
        </div>
      </template>

      <AtomCallout class="callout-container fr-col-12">
        <div class="budget-redirection">
          <div>
            <p>
              Pour détailler les
              <strong
                >ressources du bénéficiaire et des membres de son foyer</strong
              >, rendez-vous dans l'onglet "Budget" du dossier bénéficiaire.
            </p>
          </div>

          <AtomPictogram
            class="fr-hidden fr-unhidden-lg"
            path="/pictograms/money.svg"
          ></AtomPictogram>
        </div>
      </AtomCallout>
    </BeneficiaryFormSection>
  </section>
</template>

<script lang="ts" setup>
  import {
    BeneficiaryPensionOrganisation,
    BeneficiarySocioProfessionalCategory
  } from '@prisma/client'
  import {
    beneficiarySocioProfessionalCategoryKeys,
    beneficiaryActivityStatusKeys,
    beneficiaryContractTypeKeys,
    beneficiarySchoolClassGroups,
    pensionOrganisationKeys,
    ministereDepartmentServiceAcKeys,
    ministereStructureKeys,
    ministereCategorieKeys,
    beneficiaryStudyLevelKeys
  } from '~/client/options'
  import { beneficiaryFieldLabels } from '~/client/labels/beneficiary.labels'
  import { routes } from '~/utils/routes'
  import type { DataEducationSchool } from './types'

  const { initialSchool } = defineProps<{
    initialSchool: DataEducationSchool | null
  }>()
  const localInitialSchool = ref<DataEducationSchool | null>(initialSchool)

  const { application } = usePermissions()

  const { value: socioProfessionalCategory } =
    useField<BeneficiarySocioProfessionalCategory | null>(
      'socioProfessionalCategory'
    )
  const { value: pensionOrganisations } = useField<
    BeneficiaryPensionOrganisation[]
  >('pensionOrganisations')

  const { setValue: setSchoolUai } = useField<string | null>('schoolUai')
  const { setValue: setSchoolClass } = useField<string | null>('schoolClass')

  const hasOtherPensionOrganisations = computed(() =>
    (pensionOrganisations.value || []).includes(
      BeneficiaryPensionOrganisation.Other
    )
  )

  watch(socioProfessionalCategory, value => {
    if (value !== BeneficiarySocioProfessionalCategory.Student) {
      localInitialSchool.value = null
      setSchoolUai(null)
      setSchoolClass(null)
    }
  })
</script>

<style scoped lang="scss">
  .callout-container {
    margin-top: 2.5rem;

    svg {
      min-width: 80px;
    }
  }

  .budget-redirection {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  :deep(.combobox-wrapper.fr-input-group:not(:last-child)),
  :deep(.fr-select-group:not(:last-child)) {
    margin-bottom: 0;
  }
</style>
