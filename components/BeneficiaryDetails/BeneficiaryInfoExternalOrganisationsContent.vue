<template>
  <div class="fr-grid-row fr-grid-row--gutters">
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.protectionMeasure"
      :value="
        beneficiaryProtectionMeasureKeys.value(
          externalOrganisations.protectionMeasure
        )
      "
      class="fr-col-12 fr-col-lg-6"
    />
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.representative"
      :value="externalOrganisations.representative"
      class="fr-col-12 fr-col-lg-6"
    />
  </div>
  <div class="fr-grid-row fr-grid-row--gutters">
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.prescribingStructure"
      :value="externalOrganisations.prescribingStructure"
      class="fr-col-12 fr-col-lg-6"
    />
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.orientationType"
      :value="
        beneficiaryOrientationTypeKeys.value(
          externalOrganisations.orientationType
        )
      "
      class="fr-col-12 fr-col-lg-6"
    />
  </div>
  <div class="fr-grid-row fr-grid-row--gutters">
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.orientationStructure"
      :value="externalOrganisations.orientationStructure"
      class="fr-col-12 fr-col-lg-6"
    />
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.serviceProviders"
      :value="externalOrganisations.serviceProviders"
      class="fr-col-12 fr-col-lg-6"
    />
  </div>
  <div class="fr-grid-row fr-grid-row--gutters">
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.involvedPartners"
      :value="externalOrganisations.involvedPartners"
      class="fr-col-12 fr-col-lg-6"
    />
  </div>

  <template v-if="externalOrganisations.supportPrograms.length">
    <div class="fr-mt-3w fr-mb-1w">
      <h5 class="fr-text--md">Prestations / Dispositifs d'accompagnement</h5>
    </div>
    <div
      v-for="(supportProgram, index) in externalOrganisations.supportPrograms"
      :key="supportProgram.id"
    >
      <hr
        v-if="index > 0"
        class="fr-mt-3w"
      />
      <h6 class="fr-mb-2w fr-text--md">
        {{ supportProgram.supportProgramName.name }}
      </h6>
      <div class="fr-mb-2w">
        <p
          class="fr-badge fr-badge--sm"
          :class="supportProgramStatusBadgeClass(supportProgram)"
        >
          {{ supportProgramStatus(supportProgram) }}
        </p>
        <span
          v-if="supportProgram.startDate"
          class="fr-ml-1w"
        >
          {{ formatSupportProgramDateRange(supportProgram) }}
        </span>
      </div>
      <div class="fr-grid-row fr-grid-row--gutters">
        <BeneficiaryInfoLabel
          :label="supportProgramFieldLabels.partnerOrganisationId"
          :value="supportProgram.partnerOrganisation?.name"
          class="fr-col-12 fr-col-lg-6"
        />
        <BeneficiaryInfoLabel
          v-if="supportProgram.endDate"
          :label="supportProgramFieldLabels.exitReason"
          :value="supportProgram.exitReason ?? undefined"
          class="fr-col-12 fr-col-lg-6"
        />
        <BeneficiaryInfoLabel
          :label="supportProgramFieldLabels.precisions"
          :value="supportProgram.precisions"
          class="fr-col-12 fr-col-lg-6"
        />
      </div>
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
  import { supportProgramFieldLabels } from '~/client/labels'
  import {
    supportProgramStatus,
    formatSupportProgramDateRange
  } from '~/utils/beneficiary/supportProgramStatus'

  defineProps<{
    externalOrganisations: GetBeneficiaryExternalOrganisations
  }>()

  type SupportProgram =
    GetBeneficiaryExternalOrganisations['supportPrograms'][number]

  function supportProgramStatusBadgeClass(program: SupportProgram) {
    const status = supportProgramStatus(program)
    if (status === 'En cours') {
      return 'fr-badge--success'
    }
    if (status === 'À venir') {
      return 'fr-badge--info'
    }
    return ''
  }
</script>
