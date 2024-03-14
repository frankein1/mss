<template>
  <BeneficiaryFormSection section-title="Adresse/Hébergement">
    <div class="fr-col-12">
      <VeeSelect
        name="accommodationMode"
        :label="beneficiaryFieldLabels.accommodationMode"
        :options="withEmptyValue(beneficiaryAccommodationModeKeys.options)"
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
        @region-selected="setRegionValue($event)"
      />
    </div>
    <div
      v-if="application.module.ministere"
      class="fr-col-12"
    >
      <VeeSelect
        name="accommodationZone"
        :label="beneficiaryFieldLabels.accommodationZone"
        :options="withEmptyValue(beneficiaryAccommodationZoneKeys.options)"
      />
    </div>
  </BeneficiaryFormSection>
</template>

<script setup lang="ts">
  import { BeneficiaryAccommodationMode } from '@prisma/client'
  import { beneficiaryFieldLabels } from '~/client/labels'
  import {
    HostedAccommodationMode,
    OrganisationAccommodationModes,
    ThirdPartyAccommodationModes,
    beneficiaryAccommodationModeKeys,
    beneficiaryAccommodationZoneKeys
  } from '~/client/options'

  const { application } = usePermissions()

  const { value: accommodationMode } =
    useField<BeneficiaryAccommodationMode>('accommodationMode')
  const { setValue: setZipcodeValue, value: zipcode } =
    useField<string>('zipcode')
  const { setValue: setCityValue } = useField<string>('city')
  const { setValue: setDepartmentValue } = useField<string>('department')
  const { setValue: setRegionValue } = useField<string>('region')

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

  const { onCitySelected, onAddressSelected } = useAddressFields({
    setCityValue,
    setZipcodeValue,
    setRegionValue,
    setDepartmentValue
  })
</script>
