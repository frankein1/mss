<template>
  <BeneficiaryFormSection>
    <div class="fr-col-12">
      <VeeSelect
        name="protectionMeasure"
        label="Mesures de protection"
        :options="withEmptyValue(beneficiaryProtectionMeasureOptions)"
      />
    </div>
    <div class="fr-col-12">
      <VeeInput
        name="representative"
        label="Nom, prénom, coordonnées du mandataire"
      />
    </div>
    <div class="fr-col-12">
      <VeeInput
        name="prescribingStructure"
        label="Organisme prescripteur"
      />
    </div>
    <div class="fr-col-12">
      <VeeSelect
        name="orientationType"
        label="Mode d'orientation"
        :options="withEmptyValue(beneficiaryOrientationTypeOptions)"
      />
    </div>
    <div class="fr-col-12">
      <VeeInput
        name="orientationStructure"
        label="Organisme d'orientation"
      />
    </div>
    <div class="fr-col-12">
      <VeeInput
        name="serviceProviders"
        label="Prestataires"
        placeholder="Repas à domicile, aide à domicile..."
      />
    </div>
    <div class="fr-col-12">
      <VeeInput
        name="involvedPartners"
        label="Partenaires intervenants"
      />
    </div>
  </BeneficiaryFormSection>
</template>

<script setup lang="ts">
  import {
    beneficiaryOrientationTypeOptions,
    beneficiaryProtectionMeasureOptions
  } from '~/client/options/beneficiary'
</script>
