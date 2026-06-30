<template>
  <div class="fr-col-12">
    <ComboBox
      ref="city-combobox"
      v-slot="{ option }"
      v-model="selectedCity"
      label="Commune de l'établissement"
      hint="Rechercher par nom de commune ou par code postal."
      :loading="citySearchStatus === 'pending'"
      :options="cityResults"
      :format-display-value="(opt: SchoolCityOption) => opt.label"
      @input="onSchoolCitySearch"
      @select="onCitySelect"
    >
      <span>{{ option.label }}</span>
    </ComboBox>
  </div>

  <div class="fr-col-12">
    <ComboBox
      ref="school-combobox"
      v-slot="{ option }"
      v-model="selectedSchool"
      :disabled="!selectedCity"
      :loading="schoolSearchStatus === 'pending'"
      :label="beneficiaryFieldLabels.schoolUai"
      hint="Selectionner d'abord une commune avant de rechercher un établissement scolaire."
      :options="schoolResults"
      :format-display-value="(opt: SchoolOption) => opt.label"
      @input="onSchoolSearch"
      @select="onSchoolSelect"
    >
      <span>{{ option.label }}</span>
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
          {{ selectedSchool.data.address }}, {{ selectedSchool.data.zipcode }}
          {{ selectedSchool.data.city }}
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
            {{ repClassificationLabels[selectedSchool.data.repClassification] }}
          </span>
        </li>
        <li v-if="selectedSchool.data.qpvCode && selectedSchool.data.qpvName">
          <span class="fr-text--bold">QPV :</span>
          {{ selectedSchool.data.qpvCode }} – {{ selectedSchool.data.qpvName }}
        </li>
      </ul>
    </AtomCallout>
  </div>
</template>

<script lang="ts" setup>
  import { SchoolStatus } from '@prisma/client'
  import { beneficiaryFieldLabels } from '~/client/labels/beneficiary.labels'
  import {
    repClassificationLabels,
    schoolStatusLabels,
    schoolTypeLabels
  } from '~/client/labels/school.labels'
  import {
    SEARCH_NUMBER_CHARACTERS,
    SCHOOL_REQUEST_LIMIT_DEFAULT
  } from '~/utils/constants'
  import type { DataEducationSchool } from './types'

  const props = defineProps<{
    initialSchool: DataEducationSchool | null
  }>()

  const trpcClient = useTrpcClient()

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

  const getSchoolNameWithInfo = (school: DataEducationSchool) => {
    return `${school.name} – ${school.address}, ${school.zipcode} ${school.city}${school.status === SchoolStatus.FERME ? ' (établissement fermé)' : ''}`
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

  const citySearchInput = ref({ query: '' })
  const {
    data: citySearchData,
    status: citySearchStatus,
    refresh: refreshCitySearch
  } = trpcClient.dataEducation.searchSchoolCities.useQuery(citySearchInput, {
    lazy: true,
    immediate: false,
    watch: false
  })

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

  const schoolSearchInput = ref({ query: '', citycode: '' })
  const {
    data: schoolSearchData,
    status: schoolSearchStatus,
    refresh: refreshSchoolSearch
  } = trpcClient.dataEducation.searchSchools.useQuery(schoolSearchInput, {
    lazy: true,
    immediate: false,
    watch: false
  })

  const { value: schoolUai } = useField<string | null>('schoolUai')
  schoolUai.value = props.initialSchool?.uai ?? null

  const tooManyResultsOption = {
    disabled: true,
    value: '',
    label: `Plus de ${SCHOOL_REQUEST_LIMIT_DEFAULT} résultats, veuillez affiner votre recherche.`,
    data: undefined
  }

  const onSchoolCitySearch = async (value: string) => {
    if (value.length < SEARCH_NUMBER_CHARACTERS) {
      cityResults.value = []
      return
    }
    citySearchInput.value = { query: value.toLocaleLowerCase() }
    await refreshCitySearch()
    const results = citySearchData.value ?? []
    const options = results
      .slice(0, SCHOOL_REQUEST_LIMIT_DEFAULT)
      .map(school => ({
        disabled: false,
        value: school.citycode,
        label: `${school.city} (${school.zipcode})`
      }))
    if (results.length > SCHOOL_REQUEST_LIMIT_DEFAULT) {
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
    schoolSearchInput.value = {
      query: value.toLocaleLowerCase(),
      citycode: selectedCity.value.value
    }
    await refreshSchoolSearch()
    const results = schoolSearchData.value ?? []
    const options: SchoolOption[] = results
      .slice(0, SCHOOL_REQUEST_LIMIT_DEFAULT)
      .map(school => ({
        disabled: false,
        value: school.uai,
        label: getSchoolNameWithInfo(school),
        data: school
      }))
    if (results.length > SCHOOL_REQUEST_LIMIT_DEFAULT) {
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
