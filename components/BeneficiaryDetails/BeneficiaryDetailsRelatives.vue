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
            v-if="household && relative.linkedBeneficiary"
            :to="`${RoutePath.Beneficiary(relative.linkedBeneficiary.id)}`"
            class="fr-link fr-icon-links-line fr-link--icon-left"
            target="_self"
            >{{
              getBeneficiaryDisplayName(relative.linkedBeneficiary)
            }}</NuxtLink
          >
          <template v-else>{{
            getBeneficiaryDisplayName(names(relative))
          }}</template>
          <template v-if="relative.relationship">-</template>
          {{ relationshipLabel(relative) }}
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
  import { BeneficiaryRelative } from '@prisma/client'
  import { relativeRelationshipLabels } from '~/client/options/beneficiary'
  import { familySituationLabels } from '~/client/options/familySituation'
  import { BeneficiaryRelativeWithLinkedBeneficiary } from '~/types/relative'
  import { RoutePath } from '~/utils/routing'
  import type { GetBeneficiaryOutput } from '~/server/routers'

  const props = withDefaults(
    defineProps<{
      beneficiary: GetBeneficiaryOutput
      relatives: BeneficiaryRelativeWithLinkedBeneficiary[]
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

  function relationshipLabel({
    relationship
  }: Pick<BeneficiaryRelative, 'relationship'>) {
    if (!relationship) {
      return ''
    }
    return relativeRelationshipLabels[relationship] || relationship
  }

  function hasCity(relative: BeneficiaryRelativeWithLinkedBeneficiary) {
    if (relative.linkedBeneficiary) {
      return false
    }
    return relative.city
  }

  function hasPhone(relative: BeneficiaryRelativeWithLinkedBeneficiary) {
    if (relative.linkedBeneficiary) {
      return (
        relative.linkedBeneficiary?.phone1 || relative.linkedBeneficiary?.phone2
      )
    }
    return relative.phone
  }

  function hasEmail(relative: BeneficiaryRelativeWithLinkedBeneficiary) {
    if (relative.linkedBeneficiary) {
      return relative.linkedBeneficiary.email
    }
    return relative.email
  }

  function relativeContact(relative: BeneficiaryRelativeWithLinkedBeneficiary) {
    const { city, phone, email, linkedBeneficiary } = relative
    let contact = ''
    const relativePhone =
      (linkedBeneficiary &&
        (linkedBeneficiary.phone1 || linkedBeneficiary.phone2)) ||
      (!linkedBeneficiary && phone)
    const relativeEmail =
      (linkedBeneficiary && linkedBeneficiary.email) ||
      (!linkedBeneficiary && email)

    if (!linkedBeneficiary && city) {
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
