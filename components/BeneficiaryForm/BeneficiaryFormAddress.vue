<template>
  <BeneficiaryFormSection section-title="Adresse/Hébergement">
    <template v-if="showAccomodationSuggestion">
      <div
        v-for="member in membersAccommodation"
        :key="member.id"
        class="fr-col-12"
      >
        <AtomAlert
          :alert-type="AlertType.Info"
          :message="`Informations d'hébergement de ${formatBeneficiaryDisplayName(member)} disponibles`"
        >
          <template #detailedMessage>
            <DsfrButton @click="applyAccommodation(member)"
              >Utiliser ces informations</DsfrButton
            >
          </template>
        </AtomAlert>
      </div>
    </template>
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
    <div class="fr-col-12">
      <VeeAddressInput
        name="street"
        :label="beneficiaryFieldLabels.street"
        :zip-code="zipcode"
        hint="Numéro et voie"
        @address-selected="onAddressSelected"
      />
    </div>
    <div class="fr-col-12 fr-col-lg-4">
      <VeeInput
        name="zipcode"
        :label="beneficiaryFieldLabels.zipcode"
        @change-value="setZipcodeValue($event)"
      />
    </div>
    <div class="fr-col-12 fr-col-lg-8">
      <VeeCityInput
        name="city"
        :label="beneficiaryFieldLabels.city"
        :zip-code="zipcode"
        @city-selected="onCitySelected"
      />
    </div>
    <div class="fr-col-12">
      <VeeInput
        name="addressComplement"
        :label="beneficiaryFieldLabels.addressComplement"
        hint="Bâtiment, escalier, numéro d'appartement, lieu-dit, etc."
      />
    </div>
    <div class="fr-col-12 fr-col-lg-6">
      <VeeDepartmentInput
        name="department"
        :label="beneficiaryFieldLabels.department"
        @department-selected="setDepartmentValue($event)"
      />
    </div>
    <div class="fr-col-12 fr-col-lg-6">
      <VeeRegionInput
        name="region"
        :label="beneficiaryFieldLabels.region"
        @region-selected="setRegionValue($event)"
      />
    </div>
    <div class="fr-col-12">
      <VeeCheckbox
        name="qpv"
        :label="beneficiaryFieldLabels.qpv"
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
  import type { BeneficiaryAccommodationMode } from '@prisma/client'
  import { beneficiaryFieldLabels } from '~/client/labels'
  import {
    HostedAccommodationMode,
    OrganisationAccommodationModes,
    ThirdPartyAccommodationModes,
    beneficiaryAccommodationModeKeys,
    beneficiaryAccommodationZoneKeys
  } from '~/client/options'
  import VeeCheckbox from '../VeeForm/VeeCheckbox.vue'
  import type { MemberAccommodation } from './types'
  import { AlertType } from '~/utils/constants/alert'

  const { membersAccommodation = [] } = defineProps<{
    membersAccommodation?: MemberAccommodation[]
  }>()

  const { application } = usePermissions()
  const { values, setValues } = useFormContext()

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

  const sectionIsEmpty = computed(
    () =>
      !values.accommodationMode &&
      !values.street &&
      !values.city &&
      !values.zipcode
  )

  const showAccomodationSuggestion = computed(
    () => sectionIsEmpty.value && membersAccommodation.length > 0
  )

  function applyAccommodation(member: MemberAccommodation) {
    setValues({
      accommodationMode: member.accommodationMode ?? null,
      accommodationName: member.accommodationName ?? '',
      accommodationZone: member.accommodationZone ?? null,
      accommodationAdditionalInformation:
        member.accommodationAdditionalInformation ?? '',
      street: member.street ?? '',
      addressComplement: member.addressComplement ?? '',
      zipcode: member.zipcode ?? '',
      department: member.department ?? '',
      region: member.region ?? '',
      qpv: member.qpv ?? false
    })
  }
</script>
