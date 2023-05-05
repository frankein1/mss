<template>
  <AccordionFieldset label="Structures extérieures">
    <div class="fr-container--fluid">
      <div class="fr-grid-row fr-grid-row--gutters form-grid">
        <AtomSelect
          name="protectionMeasure"
          label="Mesures de protection"
          :options="withEmptyValue(beneficiaryProtectionMeasureOptions)"
          :model-value="beneficiary?.protectionMeasure || ''"
        />
        <AtomInput
          name="representative"
          label="Nom, prénom, coordonées du mandataire"
          :value="beneficiary?.representative || ''"
        />
        <AtomInput
          name="prescribingStructure"
          label="Organisme prescripteur"
          :value="beneficiary?.prescribingStructure || ''"
        />
        <AtomSelect
          name="orientation_type"
          label="Mode d'orientation"
          :options="withEmptyValue(beneficiaryOrientationTypeOptions)"
          :model-value="beneficiary?.orientationType || ''"
        />
        <AtomInput
          name="orientationStructure"
          label="Organisme d'orientation"
          :value="beneficiary?.orientationStructure || ''"
        />
        <AtomInput
          name="serviceProviders"
          label="Prestataires"
          placeholder="Repas à domicile, aide à domicile..."
          :value="beneficiary?.serviceProviders || ''"
        />
        <AtomInput
          name="involvedPartners"
          label="Partenaires intervenants"
          :value="beneficiary?.involvedPartners || ''"
        />
      </div>
    </div>
  </AccordionFieldset>
</template>

<script setup lang="ts">
  import { Beneficiary } from '@prisma/client'

  import {
    beneficiaryOrientationTypeOptions,
    beneficiaryProtectionMeasureOptions
  } from '~/client/options/beneficiary'

  defineProps<{
    beneficiary: Beneficiary
  }>()
</script>
