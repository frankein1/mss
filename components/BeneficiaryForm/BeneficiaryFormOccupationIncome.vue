<template>
  <section class="fr-p-3v">
    <h2 class="title-blue fr-mb-6v">
      {{ routes.beneficiary.AppBeneficiaryEditOccupation.title }}
    </h2>

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

      <div class="fr-col-12">
        <VeeSelectOptionGroup
          name="schoolClass"
          :label="beneficiaryFieldLabels.schoolClass"
          :groups="beneficiarySchoolClassGroups"
        />
      </div>

      <div class="fr-col-12">
        <ComboBox
          ref="city-combobox"
          v-slot="{ option }"
          v-model="selectedCity"
          label="Commune de l'établissement"
          :options="cityResults"
          :format-display-value="(opt: SchoolCityOption) => opt.label"
          @input="onSchoolCitySearch"
          @select="onCitySelect"
        >
          <span>
            {{ option.label }}
          </span>
        </ComboBox>
      </div>

      <div
        v-if="selectedCity"
        class="fr-col-12"
      >
        <ComboBox
          ref="school-combobox"
          v-slot="{ option }"
          v-model="selectedSchool"
          :label="beneficiaryFieldLabels.schoolUai"
          :options="schoolResults"
          :format-display-value="(opt: SchoolOption) => opt.label"
          @input="onSchoolSearch"
          @select="onSchoolSelect"
        >
          <span>
            {{ option.label }}
          </span>
        </ComboBox>
      </div>

      <div
        v-if="selectedSchool?.data"
        class="fr-col-12"
      >
        <AtomCallout>
          <p class="fr-text--bold">{{ selectedSchool.data.name }}</p>
          <ul>
            <li v-if="selectedSchool.data.address">
              <span class="fr-text--bold">Adresse :</span>
              {{ selectedSchool.data.address }},
              {{ selectedSchool.data.zipcode }} {{ selectedSchool.data.city }}
            </li>
            <li>
              <span class="fr-text--bold">Type :</span>
              {{ schoolTypeLabels[selectedSchool.data.type] }}
            </li>
            <li>
              <span class="fr-text--bold">Académie :</span>
              {{ selectedSchool.data.academy }}
            </li>
            <li v-if="selectedSchool.data.status !== SchoolStatus.OUVERT">
              <span class="fr-text--bold">Statut :</span>
              {{ schoolStatusLabels[selectedSchool.data.status] }}
            </li>
            <li v-if="selectedSchool.data.repClassification">
              <span class="fr-text--bold">REP :</span>
              <span class="fr-badge fr-badge--new fr-badge--no-icon fr-ml-1v">
                {{
                  repClassificationLabels[selectedSchool.data.repClassification]
                }}</span
              >
            </li>
            <li
              v-if="selectedSchool.data.qpvCode && selectedSchool.data.qpvName"
            >
              <span class="fr-text--bold">QPV :</span>
              {{ selectedSchool.data.qpvCode }} –
              {{ selectedSchool.data.qpvName }}
            </li>
          </ul>
        </AtomCallout>
      </div>
    </BeneficiaryFormSection>

    <BeneficiaryFormSection section-title="Informations professionnelles">
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
    BeneficiarySocioProfessionalCategory,
    RepClassification,
    SchoolStatus,
    SchoolType
  } from '@prisma/client'
  import {
    beneficiarySocioProfessionalCategoryKeys,
    beneficiarySchoolClassGroups,
    pensionOrganisationKeys,
    ministereDepartmentServiceAcKeys,
    ministereStructureKeys,
    ministereCategorieKeys,
    beneficiaryStudyLevelKeys
  } from '~/client/options'
  import { beneficiaryFieldLabels } from '~/client/labels/beneficiary.labels'
  import { routes } from '~/utils/routes'
  import {
    SEARCH_NUMBER_CHARACTERS,
    SEARCH_RESULTS_LIMIT
  } from '~/utils/constants'
  import type { DataEducationSchool } from './types'

  const props = defineProps<{
    initialSchool: DataEducationSchool | null
  }>()

  const { application } = usePermissions()
  const trpcClient = useTrpcClient()

  const { value: socioProfessionalCategory } =
    useField<BeneficiarySocioProfessionalCategory | null>(
      'socioProfessionalCategory'
    )

  const { value: pensionOrganisations } = useField<
    BeneficiaryPensionOrganisation[]
  >('pensionOrganisations')

  const hasOtherPensionOrganisations = computed(() =>
    (pensionOrganisations.value || []).includes(
      BeneficiaryPensionOrganisation.Other
    )
  )

  // School fields
  type SchoolCityOption = {
    label: string
    value: string
  }
  type SchoolOption = {
    label: string
    value: string
    disabled: boolean
    data?: DataEducationSchool
  }

  const schoolTypeLabels: Record<SchoolType, string> = {
    [SchoolType.Ecole]: 'École',
    [SchoolType.College]: 'Collège',
    [SchoolType.Lycee]: 'Lycée',
    [SchoolType.EREA]: 'EREA',
    [SchoolType.MedicoSocial]: 'Médico-social',
    [SchoolType.ServiceAdministratif]: 'Service administratif',
    [SchoolType.InformationOrientation]: 'Information et orientation',
    [SchoolType.Autre]: 'Autre'
  }

  const schoolStatusLabels: Record<SchoolStatus, string> = {
    [SchoolStatus.OUVERT]: 'Ouvert',
    [SchoolStatus.FERME]: 'Fermé',
    [SchoolStatus.AFERMER]: 'À fermer',
    [SchoolStatus.AOUVRIR]: 'À ouvrir'
  }

  const repClassificationLabels: Record<RepClassification, string> = {
    [RepClassification.Rep]: 'REP',
    [RepClassification.RepPlus]: 'REP+'
  }

  const getSchoolNameWithInfo = (school: DataEducationSchool) => {
    return `${school.name} – ${school.address}, ${school.zipcode} ${school.city} ${school.status === SchoolStatus.FERME ? '(établissement fermé)' : ''}`
  }

  const selectedCity = ref<(SchoolCityOption & { disabled: boolean }) | null>(
    props.initialSchool
      ? {
          disabled: false,
          value: props.initialSchool.citycode,
          label: `${props.initialSchool.city} (${props.initialSchool.zipcode})`
        }
      : null
  )
  const cityResults = ref<(SchoolCityOption & { disabled: boolean })[]>([])

  const selectedSchool = ref<(SchoolOption & { disabled: boolean }) | null>(
    props.initialSchool
      ? {
          disabled: false,
          value: props.initialSchool.uai,
          label: getSchoolNameWithInfo(props.initialSchool),
          data: props.initialSchool
        }
      : null
  )
  const schoolResults = ref<(SchoolOption & { disabled: boolean })[]>([])
  const { value: schoolUai } = useField<string | null>('schoolUai')
  schoolUai.value = props.initialSchool?.uai ?? null

  const tooManyResultsOption = {
    disabled: true,
    value: '',
    label: 'Plus de 20 résultats, veuillez affiner votre recherche.',
    data: undefined
  }

  const onSchoolCitySearch = async (value: string) => {
    if (value.length < SEARCH_NUMBER_CHARACTERS) {
      cityResults.value = []
      return
    }
    const schools = await trpcClient.dataEducation.searchSchoolCities.query({
      query: value.toLocaleLowerCase()
    })
    const options = schools.slice(0, SEARCH_RESULTS_LIMIT).map(school => ({
      disabled: false,
      value: school.citycode,
      label: `${school.city} (${school.zipcode})`
    }))
    if (schools.length > SEARCH_RESULTS_LIMIT) {
      options.push(tooManyResultsOption)
    }
    cityResults.value = options
  }

  const onCitySelect = (_option: SchoolCityOption) => {
    cityResults.value = []
    selectedSchool.value = null
    schoolUai.value = null
    schoolResults.value = []
  }

  const onSchoolSearch = async (value: string) => {
    if (!selectedCity.value || value.length < SEARCH_NUMBER_CHARACTERS) {
      schoolResults.value = []
      return
    }
    const schools = await trpcClient.dataEducation.searchSchools.query({
      query: value.toLocaleLowerCase(),
      citycode: selectedCity.value.value
    })
    const options: SchoolOption[] = schools
      .slice(0, SEARCH_RESULTS_LIMIT)
      .map(school => ({
        disabled: false,
        value: school.uai,
        label: getSchoolNameWithInfo(school),
        data: school
      }))
    if (schools.length > SEARCH_RESULTS_LIMIT) {
      options.push(tooManyResultsOption)
    }
    schoolResults.value = options
  }

  const onSchoolSelect = (option: SchoolOption) => {
    schoolUai.value = option.value
    schoolResults.value = []
  }

  watch(selectedSchool, newVal => {
    if (newVal === null) {
      schoolUai.value = null
      schoolResults.value = []
    }
  })
  watch(selectedCity, newVal => {
    if (newVal === null) {
      selectedSchool.value = null
      schoolUai.value = null
      schoolResults.value = []
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
</style>
