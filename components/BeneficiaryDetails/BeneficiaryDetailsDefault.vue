<template>
  <section class="beneficiary-details-section">
    <ul class="fr-grid-row fr-grid-row--gutters information-list">
      <li class="fr-col-6">
        <span class="information-label">Agent(s) référent(s)</span>
        {{ referentNames }}
      </li>
      <li
        v-if="beneficiary.aidantConnectAuthorized"
        class="fr-col-6 fr-icon-success-line"
      >
        Mandat Aidant Connect
      </li>
    </ul>
    <hr class="fr-col-12 fr-mt-5v" />
    <h2 class="fr-h6">Coordonnées du bénéficiaire</h2>
    <ul class="fr-grid-row fr-grid-row--gutters information-list">
      <li class="fr-col-6">
        <span class="information-label">Numéro de téléphone</span>
        {{ getBeneficiaryDisplayPhone(beneficiary) }}
      </li>
      <li
        v-if="beneficiary.email"
        class="fr-col-6"
      >
        <span class="information-label">Adresse électronique</span>
        {{ beneficiary.email }}
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
        <span class="information-label">Complément d’adresse</span>
        {{ beneficiary.addressComplement }}
      </li>
    </ul>
  </section>
</template>

<script lang="ts" setup>
  import type { GetBeneficiaryOutput } from '~/server/routers'
  import { getUserDisplayName } from '~/utils/user'

  const props = defineProps<{
    beneficiary: GetBeneficiaryOutput
  }>()

  const hasAddress =
    props.beneficiary.street ||
    props.beneficiary.zipcode ||
    props.beneficiary.city ||
    props.beneficiary.region

  const referentNames = computed(() =>
    props.beneficiary.referents
      .map(referent => getUserDisplayName(referent))
      .join(', ')
  )
</script>
