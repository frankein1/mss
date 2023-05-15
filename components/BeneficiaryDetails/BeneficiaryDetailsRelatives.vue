<template>
  <section class="beneficiary-details-section">
    <h2 class="fr-h6">{{ sectionTitle }}</h2>
    <ul class="information-list">
      <template v-if="household">
        <li v-if="beneficiary?.familySituation">
          <span class="information-label">Situation familiale :</span>
          {{ familySituationLabels[beneficiary?.familySituation] }}
        </li>
        <li v-if="beneficiary?.minorChildren">
          {{ beneficiary?.minorChildren }}
          <span class="information-label">{{ minorChildrenLabel }}</span>
        </li>
        <li v-if="beneficiary?.majorChildren">
          {{ beneficiary?.majorChildren }}
          <span class="information-label">{{ majorChildrenLabel }}</span>
        </li>
      </template>
      <li
        v-for="relative in relatives"
        :key="relative.id"
      >
        <span class="information-line">
          <NuxtLink
            v-if="household && relative.beneficiary"
            :to="`${Routes.Beneficiary(relative.beneficiary.id)}`"
            class="fr-link fr-icon-links-line fr-link--icon-left"
            target="_self"
            >{{ getBeneficiaryDisplayName(relative.beneficiary) }}</NuxtLink
          >
          <template v-else>{{
            getBeneficiaryDisplayName(names(relative))
          }}</template>
          -
          {{ typeLabel(relative) }}
        </span>
        <span
          v-if="hasCity(relative) || hasPhone(relative) || hasEmail(relative)"
          class="information-line"
        >
          {{ relativeContact(relative) }}
        </span>
        <span
          v-if="relative.caregiver"
          class="information-line fr-icon-success-line"
        >
          Aidant familial
        </span>
        <span
          v-if="relative.additionalInformation"
          class="information-line"
        >
          {{ relative.additionalInformation }}
        </span>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
  import { Beneficiary, BeneficiaryRelative } from '@prisma/client'
  import { relativeRelationshipLabels } from '~/client/options/beneficiary'
  import { familySituationLabels } from '~/client/options/familySituation'
  import { BeneficiaryRelativeWithBeneficiary } from '~/utils/beneficiary'
  import { Routes } from '~/utils/routing/routes'

  const props = withDefaults(
    defineProps<{
      beneficiary: Beneficiary
      relatives: BeneficiaryRelativeWithBeneficiary[]
      household?: boolean
    }>(),
    {
      pending: false,
      error: null,
      household: false
    }
  )

  const minorChildrenLabel = computed(() =>
    props.beneficiary.minorChildren || 0 > 1
      ? `enfants mineurs`
      : `enfant mineur`
  )

  const majorChildrenLabel = computed(() =>
    props.beneficiary.majorChildren || 0 > 1
      ? `enfants majeurs`
      : `enfant majeur`
  )

  const sectionTitle = computed(() =>
    props.household ? 'Foyer fiscal' : 'Entourage'
  )

  function names({
    firstName,
    lastName
  }: Pick<BeneficiaryRelative, 'firstName' | 'lastName'>) {
    return {
      firstName: firstName || '',
      usualName: lastName || '',
      birthName: null
    }
  }

  function typeLabel({
    relationship
  }: Pick<BeneficiaryRelative, 'relationship'>) {
    if (!relationship) {
      return ''
    }
    return relativeRelationshipLabels[relationship] || relationship
  }

  function hasCity(relative: BeneficiaryRelativeWithBeneficiary) {
    if (relative.beneficiary) {
      return false
    }
    return relative.city
  }

  function hasPhone(relative: BeneficiaryRelativeWithBeneficiary) {
    if (relative.beneficiary) {
      return relative.beneficiary?.phone1 || relative.beneficiary?.phone2
    }
    return relative.phone
  }

  function hasEmail(relative: BeneficiaryRelativeWithBeneficiary) {
    if (relative.beneficiary) {
      return relative.beneficiary.email
    }
    return relative.email
  }

  function relativeContact(relative: BeneficiaryRelativeWithBeneficiary) {
    const { city, phone, email, beneficiary } = relative
    let contact = ''
    const relativePhone =
      (beneficiary && (beneficiary.phone_1 || beneficiary.phone_2)) ||
      (!beneficiary && phone)
    const relativeEmail =
      (beneficiary && beneficiary.email) || (!beneficiary && email)

    if (!beneficiary && city) {
      contact += city
      if (relativePhone || relativeEmail) {
        contact += ' / '
      }
    }
    if (relativePhone) {
      contact += relativePhone
      if (relativeEmail) {
        contact += ' / '
      }
    }
    if (relativeEmail) {
      contact += relativeEmail
    }

    return contact
  }
</script>
