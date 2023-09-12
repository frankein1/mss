<template>
  <div class="fr-container">
    <div class="fr-grid-row">
      <div class="fr-col-12 fr-pb-1w text-bold">Identité du bénéficiaire</div>
    </div>
    <div class="fr-grid-row">
      <div class="fr-col-6 fr-pb-2w">
        <div class="field-value">{{ formatBeneficiaryName(beneficiary) }}</div>
        <div class="field-value">
          {{ formatBeneficiaryBirthInfo(beneficiary) }}
        </div>
      </div>
      <BeneficiaryInfoLabel
        label="Genre"
        :value="BeneficiaryGenderKeys.value(beneficiary.gender)"
        class="fr-col-6"
      />
    </div>
    <div class="fr-grid-row">
      <BeneficiaryInfoLabel
        label="Nom de naissance"
        :value="beneficiary.birthName"
        class="fr-col-6"
      />
      <BeneficiaryInfoLabel
        label="Nationalité"
        :value="NationalityKeys.value(beneficiary.nationality)"
        class="fr-col-6"
      />
    </div>

    <hr class="fr-col-12 fr-mt-5v" />

    <div class="fr-grid-row">
      <div class="fr-col-12 fr-pb-1w text-bold">Adresse/Hébergement</div>
    </div>

    <div class="fr-grid-row">
      <BeneficiaryInfoLabel
        label="Mode d'hébergement"
        :value="
          BeneficiaryAccommodationModeKeys.value(beneficiary.accommodationMode)
        "
        class="fr-col-12"
      />
      <BeneficiaryInfoLabel
        label="Précision d'hébergement"
        :value="beneficiary.accommodationAdditionalInformation"
        class="fr-col-12"
      />
    </div>

    <div class="fr-grid-row">
      <BeneficiaryInfoLabel
        label="Adresse"
        :value="formatAddress(beneficiary)"
        class="fr-col-6"
      />
      <BeneficiaryInfoLabel
        label="Complément d'adresse"
        :value="beneficiary.addressComplement"
        class="fr-col-6"
      />
    </div>

    <div
      v-if="beneficiary.mobility"
      class="fr-grid-row"
    >
      <hr class="fr-col-12 fr-mt-5v" />

      <div class="fr-col-12 fr-pb-1w">
        <div class="text-bold">Mobilité</div>
      </div>

      <BeneficiaryInfoLabel
        label="Permis"
        :value="BeneficiaryMobilityKeys.value(beneficiary.mobility)"
        class="fr-col-12"
      />
    </div>

    <div
      v-if="beneficiary.additionalInformation"
      class="fr-grid-row"
    >
      <hr class="fr-col-12 fr-mt-5v" />
      <div class="fr-col-12 fr-pb-1w text-bold">
        Informations complémentaires
      </div>
      <div class="field-value fr-col-12">
        {{ beneficiary.additionalInformation }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { GetBeneficiaryOutput } from '~/server/routers'
  import {
    BeneficiaryAccommodationModeKeys,
    BeneficiaryGenderKeys,
    BeneficiaryMobilityKeys
  } from '~/client/options/beneficiary'
  import { NationalityKeys } from '~/client/options/nationality'
  import {
    formatAddress,
    formatBeneficiaryBirthInfo,
    formatBeneficiaryName
  } from '~/utils/beneficiary'

  defineProps<{
    beneficiary: GetBeneficiaryOutput
  }>()
</script>
