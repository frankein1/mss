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
        v-if="beneficiary.meta.aidantConnectAuthorized"
        class="fr-col-6"
      >
        <div class="fr-icon-success-line field-value">
          Mandat Aidant Connect
        </div>
      </div>
    </div>

    <div v-if="hasCoordinatesInformations(beneficiary.general)">
      <hr class="fr-col-12 fr-mt-5v no-print" />

      <div class="fr-grid-row">
        <div class="fr-col-12">
          <div class="fr-pb-2w fr-text--bold">Coordonnées du bénéficiaire</div>
        </div>
      </div>
      <div class="fr-grid-row">
        <div class="fr-col-6">
          <BeneficiaryInfoLabel
            label="Numéro de téléphone"
            :value="phoneLabel"
          />
          <BeneficiaryInfoLabel
            label="Adresse"
            :value="formatAddress(beneficiary.general)"
          />
        </div>
        <div class="fr-col-6">
          <BeneficiaryInfoLabel
            label="Email"
            :value="beneficiary.general.email"
          />
          <BeneficiaryInfoLabel
            label="Complément d'adresse"
            :value="beneficiary.general.addressComplement"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { GetBeneficiaryOutput } from '~/types/beneficiary'
  import { formatUserDisplayName } from '~/utils/user'
  import {
    formatAddress,
    hasCoordinatesInformations
  } from '~/utils/beneficiary'

  const props = defineProps<{
    beneficiary: GetBeneficiaryOutput
  }>()

  const referentNames = computed(() =>
    props.beneficiary.meta.referents
      .map(referent => formatUserDisplayName(referent))
      .join(', ')
  )

  const phoneLabel = computed(() => {
    if (props.beneficiary.general.noPhone) {
      return "N'a pas de téléphone"
    }
    if (props.beneficiary.general.phone1) {
      const phones = [props.beneficiary.general.phone1]
      if (props.beneficiary.general.phone2) {
        phones.push(props.beneficiary.general.phone2)
      }
      return phones.join(', ')
    }
    return undefined
  })
</script>
