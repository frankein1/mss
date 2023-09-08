<template>
  <section class="beneficiary-details-section">
    <template v-if="hasIdentitySection">
      <h2 class="fr-h6">Identité du bénéficiaire</h2>
      <ul class="fr-grid-row fr-grid-row--gutters information-list">
        <li
          v-if="
            beneficiary.title ||
            beneficiary.firstName ||
            beneficiary.usualName ||
            beneficiary.birthDate ||
            beneficiary.birthPlace
          "
          class="fr-col-6"
        >
          <span class="information-line">
            {{ getBeneficiaryIdentity(beneficiary) }}
          </span>
          <span
            v-if="beneficiary.birthDate || beneficiary.birthPlace"
            class="information-line"
          >
            Né·e<template v-if="beneficiary.birthDate">
              le {{ formatDate(beneficiary.birthDate) }}</template
            ><template v-if="beneficiary.birthPlace">
              à {{ beneficiary.birthPlace }}</template
            >
          </span>
        </li>
        <li
          v-if="beneficiary.gender"
          class="fr-col-6"
        >
          <span class="information-label">Genre</span>
          {{ beneficiaryGenderLabels[beneficiary.gender] }}
        </li>
        <li
          v-if="beneficiary.birthName"
          class="fr-col-6"
        >
          <span class="information-label">Nom de naissance</span>
          {{ beneficiary.birthName }}
        </li>
        <li
          v-if="beneficiary.nationality"
          class="fr-col-6"
        >
          <span class="information-label">Nationalité</span>
          {{ Nationalities[beneficiary.nationality] }}
        </li>
        <li
          v-if="beneficiary.deathDate"
          class="fr-col-6"
        >
          <span class="information-label">Date de décès</span>
          {{ formatDate(beneficiary.deathDate) }}
        </li>
        <li
          v-if="isMinistryAgent && beneficiary.numeroPegase"
          class="fr-col-6"
        >
          <span class="information-label">Numéro Pégase</span>
          {{ beneficiary.numeroPegase }}
        </li>
        <li
          v-if="beneficiary.caregiver"
          class="fr-icon-success-line fr-col-6"
        >
          Aidant familial
        </li>
      </ul>
    </template>
    <template v-if="hasAddressSection">
      <hr class="fr-col-12 fr-mt-5v" />
      <h2 class="fr-h6">Adresse/Hébergement</h2>
      <ul class="fr-grid-row fr-grid-row--gutters information-list">
        <li
          v-if="beneficiary.accommodationMode"
          class="fr-col-12"
        >
          <span :class="{ 'information-line': beneficiary.accommodationName }">
            <span class="information-label">Mode d'hébergement</span>
            {{
              beneficiaryAccommodationModeLabels[beneficiary.accommodationMode]
            }}
          </span>
          <span
            v-if="beneficiary.accommodationName"
            class="information-line"
          >
            {{ beneficiary.accommodationName }}
          </span>
        </li>
        <li
          v-if="beneficiary.accommodationAdditionalInformation"
          class="fr-col-12"
        >
          <span class="information-label">Précisions hébergement</span>
          {{ beneficiary.accommodationAdditionalInformation }}
        </li>
        <li
          v-if="isMinistryAgent && beneficiary.accommodationZone"
          class="fr-col-6"
        >
          <span class="information-label">Zone d'hébergement</span>
          {{
            beneficiaryAccommodationZoneLabels[beneficiary.accommodationZone]
          }}
        </li>
        <li
          v-if="hasAddress"
          class="fr-col-6"
        >
          <span class="information-label information-line">Adresse</span>
          <span
            v-if="beneficiary.street || beneficiary.zipcode || beneficiary.city"
            class="information-line"
          >
            <template v-if="beneficiary.streetNumber"
              >{{ beneficiary.streetNumber }}, </template
            >{{ beneficiary.street
            }}<template v-if="beneficiary.street && beneficiary.zipcode">
              - </template
            >{{ beneficiary.zipcode
            }}<template v-if="beneficiary.city"> - </template
            >{{ beneficiary.city }}
          </span>
        </li>
        <li
          v-if="beneficiary.addressComplement"
          class="fr-col-6"
        >
          <span class="information-label">Complément d'adresse</span>
          {{ beneficiary.addressComplement }}
        </li>
        <li
          v-if="beneficiary.region"
          class="fr-col-6"
        >
          <span class="information-label information-line">Région</span>
          <span
            v-if="beneficiary.street || beneficiary.zipcode || beneficiary.city"
            class="information-line"
          >
            {{ beneficiary.region }}
          </span>
        </li>
      </ul>
    </template>
    <template v-if="hasMobilitySection">
      <hr class="fr-col-12 fr-mt-5v" />
      <h2 class="fr-h6">Mobilité</h2>
      <ul class="fr-grid-row fr-grid-row--gutters information-list">
        <li
          v-if="beneficiary.mobility"
          class="fr-col-6"
        >
          {{ beneficiaryMobilityLabels[beneficiary.mobility] }}
        </li>
      </ul>
    </template>
    <template v-if="hasAdditionalSection">
      <hr class="fr-col-12 fr-mt-5v" />
      <h2 class="fr-h6">Informations complémentaires</h2>
      <p v-if="beneficiary.additionalInformation">
        {{ beneficiary.additionalInformation }}
      </p>
    </template>
  </section>
</template>

<script lang="ts" setup>
  import type { GetBeneficiaryOutput } from '~/server/routers'
  import {
    beneficiaryGenderLabels,
    beneficiaryMobilityLabels,
    beneficiaryAccommodationZoneLabels,
    beneficiaryAccommodationModeLabels
  } from '~/client/options/beneficiary'
  import { Nationalities } from '~/client/options/nationality'
  import {
    hasIdentityInformations,
    hasAddressInformations,
    hasMobilityInformations,
    hasAdditionalInformations
  } from '~/utils/beneficiary'

  const props = defineProps<{
    beneficiary: GetBeneficiaryOutput
  }>()

  const isMinistryAgent = useMinistryAgent()

  const hasIdentitySection = computed(() =>
    hasIdentityInformations(props.beneficiary)
  )

  const hasAddressSection = computed(() =>
    hasAddressInformations(props.beneficiary)
  )

  const hasAdditionalSection = computed(() =>
    hasAdditionalInformations(props.beneficiary)
  )

  const hasMobilitySection = computed(() =>
    hasMobilityInformations(props.beneficiary)
  )

  const hasAddress = computed(
    () =>
      props.beneficiary.street ||
      props.beneficiary.streetNumber ||
      props.beneficiary.zipcode ||
      props.beneficiary.city
  )
</script>
