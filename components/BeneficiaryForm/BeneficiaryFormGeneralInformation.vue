<template>
  <div class="fr-container--fluid">
    <div class="fr-grid-row fr-grid-row--gutters form-grid">
      <VeeSelect
        name="general.status"
        class="fr-col-12"
        :label="beneficiaryFieldLabels.status"
        :options="beneficiaryStatusOptions"
        required
      />
      <VeeSelect
        name="general.title"
        :label="beneficiaryFieldLabels.title"
        :options="withEmptyValue(beneficiaryTitleOptions)"
      />
      <VeeInput
        name="general.usualName"
        :label="beneficiaryFieldLabels.usualName"
      />
      <VeeInput
        name="general.birthName"
        :label="beneficiaryFieldLabels.birthName"
      />
      <VeeInput
        name="general.firstName"
        :label="beneficiaryFieldLabels.firstName"
      />
      <VeeInput
        name="general.birthDate"
        :label="beneficiaryFieldLabels.birthDate"
        type="date"
      />
      <VeeInput
        name="general.birthPlace"
        :label="beneficiaryFieldLabels.birthPlace"
      />
      <VeeInput
        v-if="isDeceased"
        name="general.deathDate"
        :label="beneficiaryFieldLabels.deathDate"
        type="date"
      />
      <VeeSelect
        name="general.gender"
        :label="beneficiaryFieldLabels.gender"
        :options="withEmptyValue(beneficiaryGenderOptions)"
      />
      <VeeSelect
        :class="{
          'fr-col-offset-lg-4--right': !isDeceased && !isMinistryAgent
        }"
        name="general.nationality"
        :label="beneficiaryFieldLabels.nationality"
        :options="withEmptyValue(nationalityOptions)"
      />
      <VeeInput
        v-if="isMinistryAgent"
        name="general.numeroPegase"
        :label="beneficiaryFieldLabels.numeroPegase"
      />
      <VeeSelect
        class="fr-col-12"
        :class="{ 'fr-col-lg-6': isHosted }"
        name="general.accommodationMode"
        :label="beneficiaryFieldLabels.accommodationMode"
        :options="withEmptyValue(beneficiaryAccommodationModeOptions)"
      />
      <VeeInput
        v-if="isHosted"
        class="fr-col-12 fr-col-lg-6"
        name="general.accommodationName"
        :label="accommodationNameLabel"
      />
      <VeeInput
        class="fr-col-12"
        name="general.accommodationAdditionalInformation"
        :label="beneficiaryFieldLabels.accommodationAdditionalInformation"
      />
      <VeeInput
        name="general.zipcode"
        :label="beneficiaryFieldLabels.zipcode"
        @change-value="zipcode = $event"
      />
      <VeeCityInput
        name="general.city"
        :label="beneficiaryFieldLabels.city"
        :zip-code="zipcode"
        @city-selected="onCitySelected"
      />
      <VeeRegionInput
        name="general.region"
        :label="beneficiaryFieldLabels.region"
        @region-selected="region = $event"
      />
      <VeeSelect
        v-if="isMinistryAgent"
        class="fr-col-12"
        name="general.accommodationZone"
        :label="beneficiaryFieldLabels.accommodationZone"
        :options="withEmptyValue(beneficiaryAccommodationZoneOptions)"
      />
      <VeeInput
        class="fr-col-12 fr-col-lg-2"
        name="general.streetNumber"
        :label="beneficiaryFieldLabels.streetNumber"
      />
      <VeeAddressInput
        class="fr-col-12 fr-col-lg-10"
        name="general.street"
        :label="beneficiaryFieldLabels.street"
        :zip-code="zipcode"
        @address-selected="onAddressSelected"
      />
      <VeeInput
        class="fr-col-12"
        name="general.addressComplement"
        :label="beneficiaryFieldLabels.addressComplement"
        hint="Bâtiment, immeuble, escalier et numéro d'appartement"
      />
      <VeeCheckbox
        name="general.noPhone"
        :label="beneficiaryFieldLabels.noPhone"
      />
      <template v-if="!noPhone">
        <VeeInput
          name="general.phone1"
          :label="beneficiaryFieldLabels.phone1"
          type="tel"
        />
        <VeeInput
          name="general.phone2"
          :label="beneficiaryFieldLabels.phone2"
          type="tel"
        />
      </template>
      <VeeInput
        name="general.email"
        :label="beneficiaryFieldLabels.email"
        type="email"
      />
      <VeeCheckbox
        class="caregiver-checkbox"
        :label="beneficiaryFieldLabels.caregiver"
        name="general.caregiver"
      />
      <VeeSelect
        class="fr-col-12"
        name="general.mobility"
        :label="beneficiaryFieldLabels.mobility"
        :options="withEmptyValue(beneficiaryMobilityOptions)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import {
    BeneficiaryStatus,
    BeneficiaryAccommodationMode
  } from '@prisma/client'
  import {
    beneficiaryAccommodationZoneOptions,
    beneficiaryGenderOptions,
    beneficiaryMobilityOptions,
    beneficiaryStatusOptions,
    beneficiaryTitleOptions,
    beneficiaryAccommodationModeOptions,
    OrganisationAccommodationModes,
    ThirdPartyAccommodationMode
  } from '~/client/options/beneficiary'
  import { nationalityOptions } from '~/client/options/nationality'
  import { useAuthStore } from '~/store/auth'
  import type {
    CitySelected,
    AddressSelected,
    GeoApiGouvFrRegion
  } from '~/components/VeeForm/types'
  import { beneficiaryFieldLabels } from '~/client/labels/beneficiary.labels'
  import { UpdateBeneficiaryInput } from '~/server/schema'

  const props = defineProps<{
    values: UpdateBeneficiaryInput
  }>()

  const authStore = useAuthStore()
  const isMinistryAgent = authStore.isMinistryAgent

  const { setValue: setZipcodeValue } = useField<string>('general.zipcode')
  const { setValue: setCityValue } = useField<string>('general.city')
  const { setValue: setRegionvalue } = useField<string>('general.region')
  const { value: accommodationMode } = useField<BeneficiaryAccommodationMode>(
    'general.accommodationMode'
  )

  const status = computed(() => props.values?.general.status)
  const noPhone = computed(() => props.values?.general.noPhone)

  const zipcode = ref(props.values.general.zipcode)
  const city = ref(props.values.general.city)
  const region = ref(props.values.general.region)

  const isHosted = computed(() => accommodationMode.value)

  const isDeceased = computed(() => status.value === BeneficiaryStatus.Deceased)

  const accommodationNameLabel = computed(() => {
    if (!accommodationMode.value) {
      return ''
    }
    if (OrganisationAccommodationModes.includes(accommodationMode.value)) {
      return 'Dénomination de la structure'
    }
    if (ThirdPartyAccommodationMode.includes(accommodationMode.value)) {
      return 'Nom et prénom du tiers'
    }
    return ''
  })

  function onCitySelected(citySelected: CitySelected) {
    updateAddressInformation(citySelected)
  }

  function onAddressSelected(address: AddressSelected) {
    updateAddressInformation(address)
  }

  async function updateAddressInformation(
    selection: CitySelected | AddressSelected
  ) {
    if ('codeRegion' in selection && selection.codeRegion) {
      setRegion(await codeRegionToRegionName(selection.codeRegion))
    }
    if ('region' in selection && selection.region) {
      setRegion(selection.region)
    }
    zipcode.value = selection.zipCode
    city.value = selection.city
    setZipcodeValue(selection.zipCode)
    setCityValue(selection.city)
  }

  function setRegion(_region: string) {
    region.value = _region
    setRegionvalue(_region)
  }

  async function codeRegionToRegionName(codeRegion: string) {
    const { nom } = await $fetch<GeoApiGouvFrRegion>(
      `https://geo.api.gouv.fr/regions/${codeRegion}`
    )

    return nom
  }
</script>

<style scoped>
  .caregiver-checkbox {
    align-self: center;
  }
</style>
