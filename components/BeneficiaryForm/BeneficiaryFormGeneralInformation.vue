<template>
  <AccordionFieldset label="Informations générales">
    <div class="fr-container--fluid">
      <div class="fr-grid-row fr-grid-row--gutters form-grid">
        <AtomSelect
          v-model="status"
          name="status"
          class="fr-col-12"
          label="Statut du dossier"
          :options="beneficiaryStatusOptions"
          required
        />
        <AtomSelect
          name="title"
          label="Civilité"
          :options="withEmptyValue(beneficiaryTitleOptions)"
          :model-value="beneficiary.title || ''"
        />
        <AtomInput
          name="usualName"
          label="Nom usuel"
          :value="beneficiary.usualName || ''"
        />
        <AtomInput
          name="birthName"
          label="Nom de naissance"
          :value="beneficiary.birthName || ''"
        />
        <AtomInput
          name="firstName"
          label="Prénom(s)"
          :value="beneficiary.firstName || ''"
        />
        <AtomInput
          name="birthDate"
          label="Date de naissance"
          type="date"
          :value="beneficiary.birthDate || ''"
        />
        <AtomInput
          name="birthPlace"
          label="Lieu de naissance"
          :value="beneficiary.birthPlace || ''"
        />
        <AtomInput
          v-show="isDeceased"
          name="deathDate"
          label="Date de décès"
          type="date"
          :value="beneficiary.deathDate || ''"
        />
        <AtomSelect
          name="gender"
          label="Genre"
          :options="withEmptyValue(beneficiaryGenderOptions)"
          :model-value="beneficiary.gender || ''"
        />
        <AtomSelect
          :class="{
            'fr-col-offset-lg-4--right': !isDeceased && !isMinistryAgent
          }"
          name="nationality"
          label="Nationalité"
          :options="withEmptyValue(nationalityOptions)"
          :model-value="beneficiary.nationality || ''"
        />
        <AtomInput
          v-if="isMinistryAgent"
          name="numeroPegase"
          label="Numéro Pégase"
          :value="beneficiary.numeroPegase || ''"
        />
        <AtomSelect
          v-model="accommodationMode"
          class="fr-col-12"
          :class="{ 'fr-col-lg-6': isHosted }"
          name="accommodationMode"
          label="Mode d'hébergement"
          :options="withEmptyValue(beneficiaryAccomodationModeOptions)"
        />
        <AtomInput
          v-show="isHosted"
          class="fr-col-12 fr-col-lg-6"
          name="accommodationName"
          label="Dénomination"
          :value="beneficiary.accomodationName || ''"
        />
        <AtomInput
          class="fr-col-12"
          name="accommodationAdditionalInformation"
          label="Précisions hébergement"
          :value="beneficiary.accomodationAdditionalInformation || ''"
        />
        <AtomInput
          name="zip_code"
          label="Code postal"
          :value="zipcode"
          @change-value="zipcode = $event"
        />
        <AtomCityInput
          label="Ville"
          name="city"
          :value="city"
          :zip-code="zipcode"
          @city-selected="updateCity"
        />
        <AtomRegionInput
          label="Région"
          name="region"
          :value="region"
          @region-selected="region = $event"
        />
        <AtomSelect
          v-if="isMinistryAgent"
          class="fr-col-12"
          name="accommodation_zone"
          label="Zone d'hébergement"
          :model-value="beneficiary.accommodationZone || ''"
          :options="withEmptyValue(beneficiaryAccomodationZoneOptions)"
        />
        <AtomInput
          class="fr-col-12 fr-col-lg-2"
          name="street_number"
          label="Numéro"
          :value="beneficiary.streetNumber || ''"
        />
        <AtomAddressInput
          class="fr-col-12 fr-col-lg-10"
          name="street"
          label="Rue"
          :value="beneficiary.street || ''"
          :zip-code="zipcode"
          @address-selected="updateCity"
        />
        <AtomInput
          class="fr-col-12"
          name="address_complement"
          label="Complément d'adresse"
          :value="beneficiary.addressComplement || ''"
          hint="Bâtiment, immeuble, escalier et numéro d’appartement"
        />
        <AtomCheckbox
          v-model="noPhone"
          label="N'a pas de téléphone"
          name="noPhone"
        />
        <AtomInput
          v-show="!noPhone"
          name="phone_1"
          label="Téléphone 1"
          type="tel"
          :value="noPhone ? '' : phone1"
        />
        <AtomInput
          v-show="!noPhone"
          name="phone_2"
          label="Téléphone 2"
          type="tel"
          :value="noPhone ? '' : phone2"
        />
        <AtomInput
          name="email"
          label="Email"
          type="email"
          :value="beneficiary.email || ''"
        />
        <AtomCheckbox
          class="caregiver-checkbox"
          label="Aidant familial"
          name="caregiver"
          :model-value="beneficiary && beneficiary.caregiver"
        />
        <AtomSelect
          class="fr-col-12"
          name="mobility"
          label="Données mobilité"
          :model-value="beneficiary.mobility || ''"
          :options="withEmptyValue(beneficiaryMobilityOptions)"
        />
      </div>
    </div>
  </AccordionFieldset>
</template>

<script lang="ts" setup>
  import { Beneficiary, BeneficiaryStatus } from '@prisma/client'
  import {
    beneficiaryAccomodationModeOptions,
    beneficiaryAccomodationZoneOptions,
    beneficiaryGenderOptions,
    beneficiaryMobilityOptions,
    beneficiaryStatusOptions,
    beneficiaryTitleOptions
  } from '~/client/options/beneficiary'
  import { nationalityOptions } from '~/client/options/nationality'
  import { useAuthStore } from '~/store/auth'

  const props = defineProps<{
    beneficiary: Beneficiary
  }>()

  const authStore = useAuthStore()
  const isMinistryAgent = authStore.isMinistryAgent

  const accommodationMode = ref(props.beneficiary.accomodationMode)
  const zipcode = ref(props.beneficiary.zipcode)
  const city = ref(props.beneficiary.city)
  const status = ref(props.beneficiary.status)
  const noPhone = ref(props.beneficiary.noPhone)
  const phone1 = ref(props.beneficiary.phone1)
  const phone2 = ref(props.beneficiary.phone2)
  const region = ref(props.beneficiary.region)

  const isHosted = computed(() => accommodationMode.value)

  const isDeceased = computed(() => status.value === BeneficiaryStatus.Deceased)

  async function updateCity({
    zipCode: _zipcode,
    city: _city,
    codeRegion,
    region: _region
  }: {
    zipCode: string
    city: string
    codeRegion?: string
    region?: string
  }) {
    if (codeRegion) {
      region.value = await codeRegionToRegionName(codeRegion)
    }
    if (_region) {
      region.value = _region
    }
    zipcode.value = _zipcode
    city.value = _city
  }

  async function codeRegionToRegionName(codeRegion: string) {
    const res = await fetch(`https://geo.api.gouv.fr/regions/${codeRegion}`)

    if (res.status === 200) {
      const json = await res.json()
      return json.nom
    }
    throw new Error(`Error while fetchig regions with code ${codeRegion}`)
  }
</script>

<style scoped>
  .caregiver-checkbox {
    align-self: center;
  }
</style>
