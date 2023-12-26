<template>
  <BeneficiaryFormSection section-title="Adresse/Hébergement">
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
        hint="Bâtiment, escalier, numéro d'appartement, lieu-dit, etc."
      />
    </div>
    <div class="fr-col-12">
      <VeeDepartmentInput
        name="department"
        :label="beneficiaryFieldLabels.department"
        @department-selected="setDepartmentValue($event)"
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
      v-if="permissions.set.accommodationZone"
      class="fr-col-12"
    >
      <VeeSelect
        name="accommodationZone"
        :label="beneficiaryFieldLabels.accommodationZone"
        :options="withEmptyValue(beneficiaryAccommodationZoneOptions)"
      />
    </div>
  </BeneficiaryFormSection>
</template>

<script setup lang="ts">
  import { BeneficiaryAccommodationMode } from '@prisma/client'
  import {
    AddressSelected,
    CitySelected,
    GeoApiGouvFrRegion,
    GeoApiGouvFrDepartment
  } from '../VeeForm/types'
  import { beneficiaryFieldLabels } from '~/client/labels'
  import {
    HostedAccommodationMode,
    OrganisationAccommodationModes,
    ThirdPartyAccommodationModes,
    beneficiaryAccommodationModeOptions,
    beneficiaryAccommodationZoneOptions
  } from '~/client/options/beneficiary'
  import { BeneficiaryPermissions } from '~/server/security'

  defineProps<{
    permissions: BeneficiaryPermissions
  }>()

  const { value: accommodationMode } =
    useField<BeneficiaryAccommodationMode>('accommodationMode')
  const { setValue: setZipcodeValue, value: zipcode } =
    useField<string>('zipcode')
  const { setValue: setCityValue } = useField<string>('city')
  const { setValue: setDepartmentValue } = useField<string>('department')
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
    if ('codeDepartement' in selection && selection.codeDepartement) {
      setDepartmentValue(
        await codeDepartementToDepartmentName(selection.codeDepartement)
      )
    }
    if ('departement' in selection && selection.departement) {
      setDepartmentValue(selection.departement)
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

  async function codeDepartementToDepartmentName(codeDepartement: string) {
    const { nom } = await $fetch<GeoApiGouvFrDepartment>(
      `https://geo.api.gouv.fr/departements/${codeDepartement}`
    )

    return nom
  }
</script>
