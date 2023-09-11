<template>
  <div class="fr-container">
    <div class="fr-grid-row">
      <div class="fr-col-12 fr-pb-1w">
        <div class="text-bold">Identité du bénéficiaire</div>
      </div>

      <div class="fr-col-6">
        <div class="field-label">{{ formatBeneficiaryName(beneficiary) }}</div>
        <div class="field-label">
          {{ formatBeneficiaryBirthInfo(beneficiary) }}
        </div>
        <BeneficiaryInfoLabel
          label="Nom de naissance"
          :value="beneficiary.birthName"
        />
      </div>
      <div class="fr-col-6">
        <BeneficiaryInfoLabel
          label="Genre"
          :value="BeneficiaryGenderKeys.value(beneficiary.gender)"
        />
        <BeneficiaryInfoLabel
          label="Nationalité"
          :value="NationalityKeys.value(beneficiary.nationality)"
        />
      </div>
    </div>

    <hr class="fr-col-12 fr-mt-5v" />

    <div class="fr-grid-row">
      <div class="fr-col-12 fr-pb-1w">
        <div class="text-bold">Adresse/Hébergement</div>
      </div>
      <div class="fr-col-12">
        <BeneficiaryInfoLabel
          label="Mode d'hébergement"
          :value="
            BeneficiaryAccommodationModeKeys.value(
              beneficiary.accommodationMode
            )
          "
        />
        <BeneficiaryInfoLabel
          label="Précision d'hébergement"
          :value="beneficiary.accommodationAdditionalInformation"
        />
      </div>
      <div class="fr-col-6">
        <BeneficiaryInfoLabel
          label="Adresse"
          :value="formatAddress(beneficiary)"
        />
      </div>
      <div class="fr-col-6">
        <BeneficiaryInfoLabel
          label="Complément d'adresse"
          :value="beneficiary.addressComplement"
        />
      </div>
    </div>

    <div
      v-if="beneficiary.mobility"
      class="fr-grid-row"
    >
      <hr class="fr-col-12 fr-mt-5v" />
      <div class="fr-col-12 fr-pb-1w">
        <div class="text-bold">Mobilité</div>
      </div>
      <div class="fr-col-12">
        <BeneficiaryInfoLabel
          label="Permis"
          :value="BeneficiaryMobilityKeys.value(beneficiary.mobility)"
        />
      </div>
    </div>

    <div
      v-if="beneficiary.additionalInformation"
      class="fr-grid-row"
    >
      <hr class="fr-col-12 fr-mt-5v" />
      <div class="fr-col-12 fr-pb-1w">
        <div class="text-bold">Informations complémentaires</div>
      </div>
      <div class="fr-col-12">
        <div class="field-value">{{ beneficiary.additionalInformation }}</div>
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
