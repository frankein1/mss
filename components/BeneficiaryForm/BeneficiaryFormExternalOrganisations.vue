<template>
  <div class="fr-container--fluid">
    <div class="fr-grid-row fr-grid-row--gutters form-grid">
      <VeeSelect
        name="external.protectionMeasure"
        label="Mesures de protection"
        :options="withEmptyValue(beneficiaryProtectionMeasureOptions)"
      />
      <VeeInput
        name="external.representative"
        label="Nom, prénom, coordonnées du mandataire"
      />
      <VeeInput
        name="external.prescribingStructure"
        label="Organisme prescripteur"
      />
      <VeeSelect
        name="external.orientation_type"
        label="Mode d'orientation"
        :options="withEmptyValue(beneficiaryOrientationTypeOptions)"
      />
      <VeeInput
        name="external.orientationStructure"
        label="Organisme d'orientation"
      />
      <VeeInput
        name="external.serviceProviders"
        label="Prestataires"
        placeholder="Repas à domicile, aide à domicile..."
      />
      <VeeInput
        name="external.involvedPartners"
        label="Partenaires intervenants"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import {
    beneficiaryOrientationTypeOptions,
    beneficiaryProtectionMeasureOptions
  } from '~/client/options/beneficiary'
</script>
