<template>
  <BeneficiaryInfoExternalOrganisationsLegacyAlert
    :external-organisations="externalOrganisations"
  />
  <div class="fr-grid-row fr-grid-row--gutters">
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
  </div>
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
  <div
    v-if="
      externalOrganisations.contributingPartners &&
      externalOrganisations.contributingPartners.length > 0
    "
  >
    <h5 class="fr-text--bold fr-mt-3v fr-mb-1v fr-h6">
      Partenaires intervenants
    </h5>
    <ul class="fr-raw-list">
      <li
        v-for="partner in externalOrganisations.contributingPartners || []"
        :key="partner.id"
        class="fr-grid-row fr-grid-row--gutters"
      >
        <BeneficiaryInfoLabel
          :label="
            beneficiaryContributingPartnerFieldLabels.partnerOrganizationId
          "
          :value="partner.partnerOrganization.name"
          class="fr-col-12 fr-col-lg-4"
        />
        <BeneficiaryInfoLabel
          :label="
            beneficiaryContributingPartnerFieldLabels.partnerOrganizationContactId
          "
          :value="partner.partnerOrganizationContact?.name"
          class="fr-col-12 fr-col-lg-4"
        />
        <BeneficiaryInfoLabel
          :label="beneficiaryContributingPartnerFieldLabels.precisions"
          :value="partner.precisions"
          class="fr-col-12 fr-col-lg-4"
        />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import type { GetBeneficiaryExternalOrganisations } from '~/types/beneficiary'
  import { beneficiaryProtectionMeasureKeys } from '~/client/options'
  import {
    beneficiaryFieldLabels,
    beneficiaryContributingPartnerFieldLabels
  } from '~/client/labels/beneficiary.labels'

  defineProps<{
    externalOrganisations: GetBeneficiaryExternalOrganisations
  }>()
</script>
