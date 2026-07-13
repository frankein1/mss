<template>
  <template v-if="hasIdentityInformations(general)">
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12 fr-pb-1w">
        <h5 class="fr-text--md fr-mb-0">Identité du bénéficiaire</h5>
      </div>
    </div>
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12 fr-col-lg-6 fr-pb-2w">
        <p class="field-value fr-mb-0">
          {{ formatBeneficiaryName(general) }}
        </p>
        <p class="field-value fr-mb-0">
          {{ formatBeneficiaryBirthInfo(general) }}
        </p>
        <p
          v-if="isDeceased && !!general.deathDate"
          class="field-value fr-mb-0"
        >
          Décédé(e) le {{ formatDate(general.deathDate) }}
        </p>
      </div>
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.gender"
        :value="beneficiaryGenderKeys.value(general.gender)"
        class="fr-col-12 fr-col-lg-6"
      />
    </div>
    <div class="fr-grid-row fr-grid-row--gutters">
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.birthName"
        :value="general.birthName"
        class="fr-col-12 fr-col-lg-6"
      />
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.nationality"
        :value="nationalityKeys.value(general.nationality)"
        class="fr-col-12 fr-col-lg-6"
      />
    </div>
    <div class="fr-grid-row fr-grid-row--gutters">
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.numeroPegase"
        :value="general.numeroPegase"
        class="fr-col-12"
        hint="Format attendu : A-00-000000"
      />
    </div>
  </template>

  <template v-if="hasAddressInformations(general)">
    <hr class="fr-col-12 fr-mt-5v" />

    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12 fr-pb-1w">
        <h5 class="fr-text--md fr-mb-0">Adresse/Hébergement</h5>
      </div>
    </div>

    <div class="fr-grid-row fr-grid-row--gutters">
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.accommodationMode"
        :value="
          beneficiaryAccommodationModeKeys.value(general.accommodationMode)
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

    <div class="fr-grid-row fr-grid-row--gutters">
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.street"
        :value="formatAddress(general)"
        class="fr-col-12 fr-col-lg-6"
      />
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.addressComplement"
        :value="general.addressComplement"
        class="fr-col-12 fr-col-lg-6"
      />
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.department"
        :value="general.department"
        class="fr-col-12 fr-col-lg-6"
      />
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.district"
        :value="general.district"
        class="fr-col-12 fr-col-lg-6"
      />
      <BeneficiaryInfoLabel
        v-if="general.qpv != null"
        :label="beneficiaryFieldLabels.qpv"
        :value="general.qpv ? 'Oui' : 'Non'"
        class="fr-col-12 fr-col-lg-6"
      />
    </div>
  </template>

  <div
    v-if="general.mobility"
    class="fr-grid-row fr-grid-row--gutters"
  >
    <hr class="fr-col-12 fr-mt-5v" />

    <div class="fr-col-12 fr-pb-1w">
      <h5 class="fr-text--md fr-mb-0">Mobilité</h5>
    </div>

    <BeneficiaryInfoLabel
      :value="beneficiaryMobilityKeys.value(general.mobility)"
      class="fr-col-12"
    />
  </div>

  <div
    v-if="general.additionalInformation"
    class="fr-grid-row fr-grid-row--gutters"
  >
    <hr class="fr-col-12 fr-mt-5v" />
    <div class="fr-col-12 fr-pb-1w">
      <h5 class="fr-text--md fr-mb-0">Informations complémentaires</h5>
    </div>
    <div class="fr-col-12 fr-pb-1w">
      <p class="field-value fr-mb-0">
        {{ general.additionalInformation }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { GetBeneficiaryGeneral } from '~/types/beneficiary'
  import {
    beneficiaryAccommodationModeKeys,
    beneficiaryGenderKeys,
    beneficiaryMobilityKeys,
    nationalityKeys
  } from '~/client/options'
  import {
    formatAddress,
    formatBeneficiaryBirthInfo,
    formatBeneficiaryName,
    hasIdentityInformations
  } from '~/utils/beneficiary'
  import { beneficiaryFieldLabels } from '~/client/labels/beneficiary.labels'
  import { BeneficiaryStatus } from '@prisma/client'

  const props = defineProps<{
    general: GetBeneficiaryGeneral
  }>()

  const isDeceased = computed(
    () => props.general.status === BeneficiaryStatus.Deceased
  )
</script>
