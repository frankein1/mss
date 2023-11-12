<template>
  <div v-if="hasIdentityInformations(general)">
    <div class="fr-grid-row">
      <div class="fr-col-12 fr-pb-1w fr-text--bold">
        Identité du bénéficiaire
      </div>
    </div>
    <div class="fr-grid-row">
      <div class="fr-col-6 fr-pb-2w">
        <div class="field-value">
          {{ formatBeneficiaryName(general) }}
        </div>
        <div class="field-value">
          {{ formatBeneficiaryBirthInfo(general) }}
        </div>
      </div>
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.gender"
        :value="BeneficiaryGenderKeys.value(general.gender)"
        class="fr-col-6"
      />
    </div>
    <div class="fr-grid-row">
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.birthName"
        :value="general.birthName"
        class="fr-col-6"
      />
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.nationality"
        :value="NationalityKeys.value(general.nationality)"
        class="fr-col-6"
      />
    </div>
    <div class="fr-grid-row">
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.numeroPegase"
        :value="general.numeroPegase"
        class="fr-col-12"
        hint="Format attendu : A-00-000000"
      />
    </div>
  </div>

  <div v-if="hasAddressInformations(general)">
    <hr class="fr-col-12 fr-mt-5v" />

    <div class="fr-grid-row">
      <div class="fr-col-12 fr-pb-1w fr-text--bold">Adresse/Hébergement</div>
    </div>

    <div class="fr-grid-row">
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.accommodationMode"
        :value="
          BeneficiaryAccommodationModeKeys.value(general.accommodationMode)
        "
        class="fr-col-12"
      />
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.accommodationAdditionalInformation"
        :value="general.accommodationAdditionalInformation"
        class="fr-col-12"
      />
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.accommodationZone"
        :value="general.accommodationZone"
        class="fr-col-12"
      />
    </div>

    <div class="fr-grid-row">
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.street"
        :value="formatAddress(general)"
        class="fr-col-6"
      />
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.addressComplement"
        :value="general.addressComplement"
        class="fr-col-6"
      />
    </div>
  </div>

  <div
    v-if="general.mobility"
    class="fr-grid-row"
  >
    <hr class="fr-col-12 fr-mt-5v" />

    <div class="fr-col-12 fr-pb-1w">
      <div class="fr-text--bold">Mobilité</div>
    </div>

    <BeneficiaryInfoLabel
      :value="BeneficiaryMobilityKeys.value(general.mobility)"
      class="fr-col-12"
    />
  </div>

  <div
    v-if="general.additionalInformation"
    class="fr-grid-row"
  >
    <hr class="fr-col-12 fr-mt-5v" />
    <div class="fr-col-12 fr-pb-1w fr-text--bold">
      Informations complémentaires
    </div>
    <div class="field-value fr-col-12">
      {{ general.additionalInformation }}
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { GetBeneficiaryGeneral } from '~/types/beneficiary'
  import {
    BeneficiaryAccommodationModeKeys,
    BeneficiaryGenderKeys,
    BeneficiaryMobilityKeys
  } from '~/client/options/beneficiary'
  import { NationalityKeys } from '~/client/options/nationality'
  import {
    formatAddress,
    formatBeneficiaryBirthInfo,
    formatBeneficiaryName,
    hasIdentityInformations
  } from '~/utils/beneficiary'
  import { beneficiaryFieldLabels } from '~/client/labels/beneficiary.labels'

  defineProps<{
    general: GetBeneficiaryGeneral
  }>()
</script>
