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
      <AtomInput
        name="name"
        :label="structureFieldLabels.name"
        :value="structure.name"
        required
      />
    </div>
    <div class="fr-fieldset__element">
      <AtomInput
        name="zipcode"
        :label="structureFieldLabels.zipcode"
        :value="zipCode"
        required
        @change-value="zipCode = $event"
      />
    </div>
    <div class="fr-fieldset__element">
      <AtomCityInput
        name="city"
        :label="structureFieldLabels.city"
        :value="city"
        :zip-code="zipCode"
        required
        @city-selected="onCitySelected"
      />
    </div>
    <div class="fr-fieldset__element fr-col-12 fr-col-lg-8">
      <AtomAddressInput
        name="address"
        :label="structureFieldLabels.address"
        :value="structure.address"
        :zip-code="zipCode"
        required
        @address-selected="onAddressSelected"
      />
    </div>
    <div class="fr-fieldset__element">
      <AtomInput
        name="phone"
        :label="structureFieldLabels.phone"
        type="tel"
        :value="structure.phone"
        required
      />
    </div>
    <div class="fr-fieldset__element fr-col-12 fr-col-lg-8">
      <AtomInput
        name="email"
        :label="structureFieldLabels.email"
        :value="structure.email"
        required
      />
    </div>
  </fieldset>
</template>

<script lang="ts" setup>
  import type { Structure } from '@prisma/client'
  import type { CitySelected } from '~/components/AtomCityInput/types'
  import type { AddressSelected } from '~/components/AtomAddressInput/types'
  import { structureFieldLabels } from '~/client/labels/structure.labels'

  const props = defineProps<{
    structure: Structure
  }>()

  const zipCode = ref(props.structure.zipcode)
  const city = ref(props.structure.city)

  function onCitySelected(citySelected: CitySelected) {
    zipCode.value = citySelected.zipCode
    city.value = citySelected.city
  }

  function onAddressSelected(address: AddressSelected) {
    zipCode.value = address.zipCode
    city.value = address.city
  }
</script>
