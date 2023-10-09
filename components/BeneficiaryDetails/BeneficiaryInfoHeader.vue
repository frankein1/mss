<template>
  <div class="fr-container">
    <div class="fr-grid-row">
      <div class="fr-col-6">
        <BeneficiaryInfoLabel
          label="Agent(s) référent(s)"
          :value="referentNames"
        />
      </div>
      <div
        v-if="beneficiary.aidantConnectAuthorized"
        class="fr-col-6"
      >
        <div class="fr-icon-success-line field-value">
          Mandat Aidant Connect
        </div>
      </div>
    </div>

    <div v-if="hasCoordinatesInformations(beneficiary)">
      <hr class="fr-col-12 fr-mt-5v" />

      <div class="fr-grid-row">
        <div class="fr-col-12">
          <div class="fr-pb-2w fr-text--bold">Coordonnées du bénéficiaire</div>
        </div>
      </div>
      <div class="fr-grid-row">
        <div class="fr-col-6">
          <BeneficiaryInfoLabel
            label="Numéro de téléphone"
            default-value="Pas de téléphone"
            :value="phoneLabel"
          />
          <BeneficiaryInfoLabel
            label="Adresse"
            :value="formatAddress(beneficiary)"
          />
        </div>
        <div class="fr-col-6">
          <BeneficiaryInfoLabel
            label="Email"
            :value="beneficiary.email"
          />
          <BeneficiaryInfoLabel
            label="Complément d'adresse"
            :value="beneficiary.addressComplement"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { GetBeneficiaryOutput } from '~/server/route'
  import { getUserDisplayName } from '~/utils/user'
  import {
    formatAddress,
    hasCoordinatesInformations
  } from '~/utils/beneficiary'

  const props = defineProps<{
    beneficiary: GetBeneficiaryOutput
  }>()

  const referentNames = computed(() =>
    props.beneficiary.referents
      .map(referent => getUserDisplayName(referent))
      .join(', ')
  )

  const phoneLabel = computed(() => {
    if (props.beneficiary.noPhone) {
      return "N'a pas de téléphone"
    }
    return props.beneficiary.phone1 || props.beneficiary.phone2
  })
</script>
