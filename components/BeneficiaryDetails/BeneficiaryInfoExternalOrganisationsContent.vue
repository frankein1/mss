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
    <h5 class="fr-text--lead fr-my-2w">Partenaires intervenants</h5>
    <ul class="fr-raw-list">
      <li
        v-for="(partner, index) in externalOrganisations.contributingPartners"
        :key="partner.id"
        class="fr-grid-row fr-grid-row--gutters"
      >
        <h6 class="fr-col-12 fr-text--md fr-mb-0 fr-pb-0">
          {{ index + 1 }}. {{ partner.partnerOrganization.name }}
        </h6>

        <BeneficiaryInfoLabel
          :label="
            beneficiaryContributingPartnerFieldLabels.partnerOrganizationContactId
          "
          :value="partner.partnerOrganizationContact?.name"
          class="fr-col-12"
        />
        <BeneficiaryInfoLabel
          :label="beneficiaryContributingPartnerFieldLabels.precisions"
          :value="partner.precisions"
          class="fr-col-12"
        />
      </li>
    </ul>

    <hr />
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
