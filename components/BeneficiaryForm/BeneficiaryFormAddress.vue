<template>
  <div
    class="fr-grid-row fr-grid-row--center fr-grid-row--bottom fr-grid-row--gutters feature-section fr-mb-3w"
  >
    <h3 class="fr-h4 fr-col-12 fr-mb-0">Adresse/Hébergement</h3>
    <div class="fr-col-12">
      <VeeSelect
        name="accommodationMode"
        :label="beneficiaryFieldLabels.accommodationMode"
        :options="withEmptyValue(beneficiaryAccommodationModeOptions)"
      />
    </div>
    <div
      v-if="isHosted"
      class="fr-col-12"
    >
      <VeeInput
        name="accommodationName"
        :label="accommodationNameLabel"
      />
    </div>
    <div class="fr-col-12">
      <VeeInput
        name="accommodationAdditionalInformation"
        :label="beneficiaryFieldLabels.accommodationAdditionalInformation"
      />
    </div>
    <div class="fr-col-12">
      <VeeAddressInput
        name="street"
        :label="beneficiaryFieldLabels.street"
        :zip-code="zipcode"
        hint="Numéro et voie"
        @address-selected="onAddressSelected"
      />
    </div>
    <div class="fr-col-12">
      <VeeInput
        name="addressComplement"
        :label="beneficiaryFieldLabels.addressComplement"
        hint="Bâtiment, immeuble, escalier et numéro d'appartement"
      />
    </div>
    <div class="fr-col-12">
      <VeeInput
        name="postOfficeBox"
        :label="beneficiaryFieldLabels.postOfficeBox"
      />
    </div>
    <div class="fr-col-12 fr-col-md-3">
      <VeeInput
        name="zipcode"
        :label="beneficiaryFieldLabels.zipcode"
        @change-value="setZipcodeValue($event)"
      />
    </div>
    <div class="fr-col-12 fr-col-md-9">
      <VeeCityInput
        name="city"
        :label="beneficiaryFieldLabels.city"
        :zip-code="zipcode"
        @city-selected="onCitySelected"
      />
    </div>
    <div class="fr-col-12">
      <VeeRegionInput
        name="region"
        :label="beneficiaryFieldLabels.region"
        @region-selected="setRegionvalue($event)"
      />
    </div>
    <div
      v-if="isMinistryAgent"
      class="fr-col-12"
    >
      <VeeSelect
        name="accommodationZone"
        :label="beneficiaryFieldLabels.accommodationZone"
        :options="withEmptyValue(beneficiaryAccommodationZoneOptions)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { BeneficiaryAccommodationMode } from '@prisma/client'
  import {
    AddressSelected,
    CitySelected,
    GeoApiGouvFrRegion
  } from '../VeeForm/types'
  import { beneficiaryFieldLabels } from '~/client/labels'
  import {
    HostedAccommodationMode,
    OrganisationAccommodationModes,
    ThirdPartyAccommodationModes,
    beneficiaryAccommodationModeOptions,
    beneficiaryAccommodationZoneOptions
  } from '~/client/options/beneficiary'

  const isMinistryAgent = useMinistryAgent()

  const { value: accommodationMode } =
    useField<BeneficiaryAccommodationMode>('accommodationMode')
  const { setValue: setZipcodeValue, value: zipcode } =
    useField<string>('zipcode')
  const { setValue: setCityValue } = useField<string>('city')
  const { setValue: setRegionvalue } = useField<string>('region')

  const isHosted = computed(() =>
    HostedAccommodationMode.includes(accommodationMode.value)
  )

  const accommodationNameLabel = computed(() => {
    if (!accommodationMode.value) {
      return ''
    }
    if (OrganisationAccommodationModes.includes(accommodationMode.value)) {
      return 'Dénomination de la structure'
    }
    if (ThirdPartyAccommodationModes.includes(accommodationMode.value)) {
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
      setRegionvalue(await codeRegionToRegionName(selection.codeRegion))
    }
    if ('region' in selection && selection.region) {
      setRegionvalue(selection.region)
    }
    setZipcodeValue(selection.zipCode)
    setCityValue(selection.city)
  }

  async function codeRegionToRegionName(codeRegion: string) {
    const { nom } = await $fetch<GeoApiGouvFrRegion>(
      `https://geo.api.gouv.fr/regions/${codeRegion}`
    )

    return nom
  }
</script>
