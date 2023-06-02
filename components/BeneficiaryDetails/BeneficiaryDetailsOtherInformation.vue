<template>
  <section class="beneficiary-details-section">
    <h2 class="fr-h6">Autres informations</h2>
    <ul class="information-list">
      <li v-if="beneficiary.protectionMeasure">
        <span class="information-label">Mesure de protection :</span>
        {{ beneficiaryProtectionMeasureLabels[beneficiary.protectionMeasure] }}
      </li>
      <li v-if="beneficiary.representative">
        <span class="information-label information-line">
          Nom, prénom, coordonées du mandataire :
        </span>
        <span class="information-line">
          {{ beneficiary.representative }}
        </span>
      </li>
      <li v-if="beneficiary.prescribingStructure">
        <span class="information-label">Organisme prescripteur :</span>
        {{ beneficiary.prescribingStructure }}
      </li>
      <li v-if="beneficiary.orientationType">
        <span class="information-label">Mode d'orientation :</span>
        {{ beneficiaryOrientationTypeLabels[beneficiary.orientationType] }}
      </li>
      <li v-if="beneficiary.orientationStructure">
        <span class="information-label">Organisme d'orientation :</span>
        {{ beneficiary.orientationStructure }}
      </li>
      <li v-if="beneficiary.serviceProviders">
        <span class="information-label">Prestataires :</span>
        {{ beneficiary.serviceProviders }}
      </li>
      <li v-if="beneficiary.involvedPartners">
        <span class="information-label">Partenaires intervenants :</span>
        {{ beneficiary.involvedPartners }}
      </li>
      <li v-if="beneficiary.additionalInformation">
        <span class="information-label"> Informations complémentaires : </span>
        {{ beneficiary.additionalInformation }}
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
  import { Beneficiary } from '@prisma/client'
  import {
    beneficiaryOrientationTypeLabels,
    beneficiaryProtectionMeasureLabels
  } from '~/client/options/beneficiary'

  defineProps<{
    beneficiary: Beneficiary
  }>()
</script>
