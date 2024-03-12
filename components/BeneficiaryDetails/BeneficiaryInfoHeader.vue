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
      <div
        v-if="beneficiary.vulnerablePerson"
        class="fr-col-6"
      >
        <div class="fr-icon-success-line field-value">Personne vulnérable</div>
        <div class="field-value">
          {{
            BeneficiaryVulnerablePersonTypeKeys.value(
              beneficiary.vulnerablePersonType
            )
          }}
        </div>
      </div>
    </div>

    <template v-if="hasCoordinatesInformations(beneficiary.general)">
      <hr class="fr-col-12 fr-mt-5v fr-no-print" />

      <div class="fr-grid-row">
        <div class="fr-col-12">
          <div class="fr-pb-2w fr-text--bold">Coordonnées du bénéficiaire</div>
        </div>
      </div>
      <div class="fr-grid-row">
        <div
          v-if="hasPhoneOrAddress(beneficiary.general)"
          class="fr-col-6"
        >
          <BeneficiaryInfoLabel
            label="Numéro de téléphone"
            :value="phoneLabel"
          />
          <BeneficiaryInfoLabel
            label="Adresse"
            :value="formatAddress(beneficiary.general)"
          />
        </div>
        <div
          v-if="hasEmailOrAddressComplement(beneficiary.general)"
          class="fr-col-6"
        >
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
    </template>
  </div>
</template>

<script lang="ts" setup>
  import type { GetBeneficiaryOutput } from '~/types/beneficiary'
  import { formatUserDisplayName } from '~/utils/user'
  import {
    formatAddress,
    hasCoordinatesInformations,
    hasPhoneOrAddress,
    hasEmailOrAddressComplement
  } from '~/utils/beneficiary'
  import { BeneficiaryVulnerablePersonTypeKeys } from '~/client/options'

  const props = defineProps<{
    beneficiary: GetBeneficiaryOutput
  }>()

  const referentNames = computed(() =>
    props.beneficiary.referents
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
