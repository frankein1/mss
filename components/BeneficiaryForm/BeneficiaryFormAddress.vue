<template>
  <BeneficiaryFormSection section-title="Adresse/Hébergement">
    <template v-if="showSuggestions">
      <div
        v-for="member in membersWithAccommodation"
        :key="member.id"
        class="fr-col-12"
      >
        <div
          class="fr-alert fr-alert--info fr-alert--sm fr-mb-2w"
          role="alert"
        >
          <p class="fr-alert__title">
            Informations d'hébergement de {{ member.firstName }}
            {{ member.usualName ?? member.birthName }} disponibles
          </p>
          <button
            type="button"
            class="fr-btn fr-btn--sm fr-btn--secondary"
            @click="applyAccommodation(member)"
          >
            Utiliser ces informations
          </button>
        </div>
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

  const props = withDefaults(
    defineProps<{
      membersAccommodation?: MemberAccommodation[]
    }>(),
    {
      membersAccommodation: () => []
    }
  )

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

  const route = useRoute()
  const currentBeneficiaryId = route.params['id'] as string

  const membersWithAccommodation = computed(() =>
    props.membersAccommodation.filter(
      m =>
        m.id !== currentBeneficiaryId &&
        (m.accommodationMode || m.street || m.city || m.zipcode)
    )
  )

  const { values, setFieldValue } = useFormContext()

  const sectionIsEmpty = computed(
    () =>
      !values.accommodationMode &&
      !values.street &&
      !values.city &&
      !values.zipcode
  )

  const showSuggestions = computed(
    () => sectionIsEmpty.value && membersWithAccommodation.value.length > 0
  )

  function applyAccommodation(member: MemberAccommodation) {
    setFieldValue('accommodationMode', member.accommodationMode ?? null)
    setFieldValue('accommodationName', member.accommodationName ?? '')
    setFieldValue(
      'accommodationAdditionalInformation',
      member.accommodationAdditionalInformation ?? ''
    )
    setFieldValue('street', member.street ?? '')
    setFieldValue('addressComplement', member.addressComplement ?? '')
    setFieldValue('zipcode', member.zipcode ?? '')
    setFieldValue('city', member.city ?? '')
    setFieldValue('department', member.department ?? '')
    setFieldValue('region', member.region ?? '')
    setFieldValue('qpv', member.qpv ?? false)
    setFieldValue('accommodationZone', member.accommodationZone ?? null)
  }
</script>
