<!-- NOTE: When updating the beneficiary details, make sure to also update the printable version. -->

<template>
  <section class="beneficiary-details-section">
    <h2 class="fr-h6">Bénéficiaire</h2>
    <ul class="information-list">
      <li v-if="beneficiary.title">
        <span class="information-label">Civilité :</span>
        {{ beneficiaryTitleLabels[beneficiary.title] }}
      </li>
      <li>
        <span class="information-label">Nom usuel :</span>
        {{ beneficiary.usualName }}
      </li>
      <li v-if="beneficiary.birthName">
        <span class="information-label">Nom de naissance :</span>
        {{ beneficiary.birthName }}
      </li>
      <li>
        <span class="information-label">Prénom(s) :</span>
        {{ nameOrEmpty(beneficiary.firstName) }}
      </li>
      <li v-if="beneficiary.birthDate">
        <span class="information-label">Date de naissance :</span>
        {{ formatDate(beneficiary.birthDate) }} ({{
          calculateAge(beneficiary.birthDate)
        }}
        ans)
      </li>
      <li v-if="beneficiary.birthPlace">
        <span class="information-label">Ville de naissance :</span>
        {{ beneficiary.birthPlace }}
      </li>
      <li v-if="beneficiary.deathDate">
        <span class="information-label">Date de décès :</span>
        {{ formatDate(beneficiary.deathDate) }}
      </li>
      <li v-if="beneficiary.gender">
        <span class="information-label">Genre :</span>
        {{ beneficiaryGenderLabels[beneficiary.gender] }}
      </li>
      <li v-if="beneficiary.nationality">
        <span class="information-label">Nationalité :</span>
        {{ Nationalities[beneficiary.nationality] }}
      </li>
      <li v-if="isMinistryAgent && beneficiary.numeroPegase">
        <span class="information-label">Numéro Pégase :</span>
        {{ beneficiary.numeroPegase }}
      </li>
      <li v-if="beneficiary.accomodationMode">
        <span :class="{ 'information-line': beneficiary.accomodationName }">
          <span class="information-label">Hébergement :</span>
          {{ beneficiaryAccomodationModeLabels[beneficiary.accomodationMode] }}
        </span>
        <span
          v-if="beneficiary.accomodationName"
          class="information-line"
        >
          {{ beneficiary.accomodationName }}
        </span>
      </li>
      <li v-if="isMinistryAgent && beneficiary.accommodationZone">
        <span class="information-label">Zone d'hébergement :</span>
        {{ beneficiaryAccomodationZoneLabels[beneficiary.accommodationZone] }}
      </li>
      <li v-if="beneficiary.accomodationAdditionalInformation">
        <span class="information-label">Précisions hébergement :</span>
        {{ beneficiary.accomodationAdditionalInformation }}
      </li>
      <li v-if="hasAddress">
        <span class="information-label information-line">Adresse :</span>
        <span
          v-if="beneficiary.street"
          class="information-line"
        >
          {{ beneficiary.streetNumber }} {{ beneficiary.street }}
        </span>
        <span
          v-if="beneficiary.addressComplement"
          class="information-line"
        >
          {{ beneficiary.addressComplement }}
        </span>
        <span
          v-if="beneficiary.zipcode || beneficiary.city"
          class="information-line"
        >
          {{ beneficiary.zipcode }} {{ beneficiary.city }}
        </span>
        <span
          v-if="beneficiary.region"
          class="information-line"
        >
          {{ beneficiary.region }}
        </span>
      </li>
      <li
        v-if="beneficiary.noPhone"
        class="fr-icon-close-circle-line"
      >
        N'a pas de téléphone
      </li>
      <li v-if="!beneficiary.noPhone && beneficiary.phone1">
        <span class="information-label">Téléphone :</span> {{ displayPhone }}
      </li>
      <li v-if="beneficiary.email">
        <span class="information-label">Email :</span>
        {{ beneficiary.email }}
      </li>
      <li
        v-if="beneficiary.caregiver"
        class="fr-icon-success-line"
      >
        Aidant familial
      </li>
      <li v-if="beneficiary.mobility">
        <span class="information-label">Données mobilité :</span>
        {{ beneficiaryMobilityLabels[beneficiary.mobility] }}
      </li>
      <li v-if="beneficiary.administration">
        <span class="information-label">Administration :</span>
        {{ beneficiary.administration }}
      </li>
      <li v-if="beneficiary.minister">
        <span class="information-label">Ministre :</span>
        {{ beneficiary.minister }}
      </li>
    </ul>
  </section>
</template>

<script lang="ts" setup>
  import { Beneficiary } from '@prisma/client'
  import {
    beneficiaryTitleLabels,
    beneficiaryGenderLabels,
    beneficiaryAccomodationModeLabels,
    beneficiaryMobilityLabels,
    beneficiaryAccomodationZoneLabels
  } from '~/client/options/beneficiary'
  import { Nationalities } from '~/client/options/nationality'
  import { useAuthStore } from '~/store/auth'

  const props = defineProps<{
    beneficiary: Beneficiary
  }>()

  const isMinistryAgent = useAuthStore().isMinistryAgent

  const hasAddress =
    props.beneficiary.street ||
    props.beneficiary.zipcode ||
    props.beneficiary.city ||
    props.beneficiary.region
</script>
