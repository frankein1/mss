<template>
  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.protectionMeasure"
      :value="
        beneficiaryProtectionMeasureKeys.value(
          externalOrganisations.protectionMeasure
        )
      "
      class="fr-col-12 fr-col-md-6"
    />
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.representative"
      :value="externalOrganisations.representative"
      class="fr-col-12 fr-col-md-6"
    />
  </div>
  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.prescribingStructure"
      :value="externalOrganisations.prescribingStructure"
      class="fr-col-12 fr-col-md-6"
    />
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.orientationType"
      :value="
        beneficiaryOrientationTypeKeys.value(
          externalOrganisations.orientationType
        )
      "
      class="fr-col-12 fr-col-md-6"
    />
  </div>
  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.orientationStructure"
      :value="externalOrganisations.orientationStructure"
      class="fr-col-12 fr-col-md-6"
    />
  </div>

  <template v-if="externalOrganisations.supportPrograms.length">
    <div class="fr-mt-3w fr-mb-1w">
      <p class="fr-text--bold fr-text--uppercase">
        Prestations / Dispositifs d'accompagnement
      </p>
    </div>
    <div
      v-for="supportProgram in externalOrganisations.supportPrograms"
      :key="supportProgram.id"
      class="fr-grid-row fr-mb-2w"
    >
      <BeneficiaryInfoLabel
        label="Nom dispositif"
        :value="supportProgram.supportProgramName.name"
        class="fr-col-12 fr-col-md-6"
      />
      <BeneficiaryInfoLabel
        label="Organisme partenaire"
        :value="supportProgram.partnerOrganisation?.name"
        class="fr-col-12 fr-col-md-6"
      />
      <BeneficiaryInfoLabel
        label="Date d'entrée"
        :value="
          supportProgram.startDate
            ? formatDate(supportProgram.startDate)
            : undefined
        "
        class="fr-col-12 fr-col-md-6"
      />
      <BeneficiaryInfoLabel
        label="Date de sortie"
        :value="
          supportProgram.endDate
            ? formatDate(supportProgram.endDate)
            : undefined
        "
        class="fr-col-12 fr-col-md-6"
      />
      <BeneficiaryInfoLabel
        v-if="supportProgram.endDate"
        label="Motif de sortie"
        :value="supportProgram.exitReason ?? undefined"
        class="fr-col-12"
      />
      <BeneficiaryInfoLabel
        label="Précisions"
        :value="supportProgram.precisions"
        class="fr-col-12"
      />
    </div>
  </template>
</template>

<script setup lang="ts">
  import type { GetBeneficiaryExternalOrganisations } from '~/types/beneficiary'
  import {
    beneficiaryOrientationTypeKeys,
    beneficiaryProtectionMeasureKeys
  } from '~/client/options'
  import { beneficiaryFieldLabels } from '~/client/labels/beneficiary.labels'

  defineProps<{
    externalOrganisations: GetBeneficiaryExternalOrganisations
  }>()

  function formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR')
  }
</script>
