<template>
  <fieldset
    class="fr-fieldset fr-grid-row fr-grid-row--gutters form-grid"
    aria-labelledby="structure-information-legend"
  >
    <legend
      id="structure-information-legend"
      class="fr-fieldset__legend fr-h4"
    >
      Typologie
    </legend>
    <div class="fr-fieldset__element">
      <VeeInput
        name="name"
        :label="structureFieldLabels.name"
        required
      />
    </div>
    <div class="fr-fieldset__element">
      <VeeInput
        name="zipcode"
        :label="structureFieldLabels.zipcode"
        required
        @change-value="zipCode = $event"
      />
    </div>
    <div class="fr-fieldset__element">
      <VeeCityInput
        name="city"
        :label="structureFieldLabels.city"
        :zip-code="zipCode"
        required
        @city-selected="onCitySelected"
      />
    </div>
    <div class="fr-fieldset__element fr-col-12 fr-col-lg-8">
      <VeeAddressInput
        name="address"
        :label="structureFieldLabels.address"
        :zip-code="zipCode"
        required
        @address-selected="onAddressSelected"
      />
    </div>
    <div class="fr-fieldset__element">
      <VeeInput
        name="phone"
        :label="structureFieldLabels.phone"
        type="tel"
        required
      />
    </div>
    <div class="fr-fieldset__element fr-col-12 fr-col-lg-8">
      <VeeInput
        name="email"
        :label="structureFieldLabels.email"
        required
      />
    </div>
  </fieldset>
</template>

<script lang="ts" setup>
  import type { Structure } from '@prisma/client'
  import type {
    CitySelected,
    AddressSelected
  } from '~/components/VeeForm/types'
  import { structureFieldLabels } from '~/client/labels/structure.labels'
  import type { EditCurrentUserStructureRawInput } from '~/server/schema'

  const props = defineProps<{
    structure: Structure
    setFieldValue: (
      field: keyof EditCurrentUserStructureRawInput,
      value: EditCurrentUserStructureRawInput[keyof EditCurrentUserStructureRawInput]
    ) => void
  }>()

  const zipCode = ref(props.structure.zipcode)
  const city = ref(props.structure.city)

  function onCitySelected(citySelected: CitySelected) {
    updateZipCodeAndCity(citySelected.zipCode, citySelected.city)
  }

  function onAddressSelected(address: AddressSelected) {
    updateZipCodeAndCity(address.zipCode, address.city)
  }

  function updateZipCodeAndCity(_zipCode: string, _city: string) {
    zipCode.value = _zipCode
    city.value = _city
    props.setFieldValue('zipcode', _zipCode)
    props.setFieldValue('city', _city)
  }
</script>
