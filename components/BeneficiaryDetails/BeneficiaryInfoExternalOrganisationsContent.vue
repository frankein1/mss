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
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.involvedPartners"
      :value="externalOrganisations.involvedPartners"
      class="fr-col-12 fr-col-lg-6"
    />

    <template v-if="externalOrganisations.supportPrograms.length">
      <div class="fr-col-12">
        <hr />

        <h5 class="fr-text--md fr-mb-0">
          Prestations / Dispositifs d'accompagnement
        </h5>
      </div>

      <ul class="information-list fr-col-12">
        <li
          v-for="(
            supportProgram, index
          ) in externalOrganisations.supportPrograms"
          :key="supportProgram.id"
        >
          <h6 class="fr-mb-1w fr-text--md">
            {{ index + 1 }}. {{ supportProgram.supportProgramName.name }}
          </h6>
          <p class="fr-mb-1w">
            <span
              class="fr-badge fr-badge--sm"
              :class="supportProgramStatusBadgeClass(supportProgram)"
            >
              {{ supportProgramStatus(supportProgram) }}
            </span>
            <span
              v-if="supportProgram.startDate || supportProgram.endDate"
              class="fr-ml-1w"
            >
              {{ formatSupportProgramDateRange(supportProgram) }}
            </span>
          </p>
          <BeneficiaryInfoLabel
            :label="supportProgramFieldLabels.partnerOrganisationId"
            :value="supportProgram.partnerOrganisation?.name"
          />
          <BeneficiaryInfoLabel
            v-if="supportProgram.endDate"
            :label="supportProgramFieldLabels.exitReason"
            :value="supportProgram.exitReason ?? undefined"
          />
          <BeneficiaryInfoLabel
            :label="supportProgramFieldLabels.precisions"
            :value="supportProgram.precisions"
          />
        </li>
      </ul>
    </template>
  </div>
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
      return 'fr-badge--success fr-badge--no-icon'
    }
    if (status === 'À venir') {
      return 'fr-badge--info fr-badge--no-icon'
    }
    return ''
  }
</script>
