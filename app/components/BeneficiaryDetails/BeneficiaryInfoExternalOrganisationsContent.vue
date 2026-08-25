<template>
  <div class="fr-grid-row fr-grid-row--gutters">
    <BeneficiaryInfoExternalOrganisationsLegacyAlert
      :external-organisations="externalOrganisations"
    />
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.prescribingOrganizationId"
      :value="externalOrganisations.prescribingOrganization?.name"
      class="fr-col-12 fr-col-lg-6"
    />
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.prescribingOrganizationContactId"
      :value="externalOrganisations.prescribingOrganizationContact?.name"
      class="fr-col-12 fr-col-lg-6"
    />

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
    <template
      v-if="
        externalOrganisations.contributingPartners &&
        externalOrganisations.contributingPartners.length > 0
      "
    >
      <div class="fr-col-12">
        <h5 class="fr-text--md fr-mb-0">Partenaires intervenants</h5>
      </div>
      <div class="fr-col-12">
        <ul class="fr-raw-list">
          <li
            v-for="(
              partner, index
            ) in externalOrganisations.contributingPartners"
            :key="partner.id"
            class="fr-grid-row fr-grid-row--gutters"
          >
            <div class="fr-col-12">
              <h6 class="fr-mb-1w fr-text--md">
                {{ index + 1 }}. {{ partner.partnerOrganization.name }}
              </h6>
            </div>

            <BeneficiaryInfoLabel
              :label="
                beneficiaryContributingPartnerFieldLabels.partnerOrganizationContactId
              "
              :value="partner.partnerOrganizationContact?.name"
              class="fr-col-12 fr-col-lg-6"
            />
            <BeneficiaryInfoLabel
              :label="beneficiaryContributingPartnerFieldLabels.precisions"
              :value="partner.precisions"
              class="fr-col-12 fr-col-lg-6"
            />
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import type { GetBeneficiaryExternalOrganisations } from '~~/types/beneficiary'
  import {
    beneficiaryProtectionMeasureKeys,
    beneficiaryOrientationTypeKeys
  } from '~~/client/options'
  import {
    beneficiaryFieldLabels,
    beneficiaryContributingPartnerFieldLabels
  } from '~~/client/labels/beneficiary.labels'

  defineProps<{
    externalOrganisations: GetBeneficiaryExternalOrganisations
  }>()
</script>
