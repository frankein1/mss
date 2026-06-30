<template>
  <div class="fr-grid-row fr-grid-row--gutters">
    <div class="fr-col-12 fr-col-lg-6">
      <BeneficiaryInfoLabel
        label="Agent(s) référent(s)"
        :value="referentNames"
      />
    </div>
    <div class="fr-col-12 fr-col-lg-6">
      <p class="fr-mb-1w">Dossier N°&nbsp;{{ beneficiary.fileNumber }}</p>
      <p class="fr-mb-1w">
        <BeneficiaryStatusBadge :status="beneficiary.status" />
      </p>
      <p
        v-if="beneficiary.aidantConnectAuthorized"
        class="fr-mb-2v"
      >
        <span
          class="fr-icon-success-line"
          aria-hidden="true"
        ></span>
        Mandat Aidants Connect
      </p>
      <p
        v-if="
          application.module.vulnerablePerson && beneficiary.vulnerablePerson
        "
        class="fr-mb-2v"
      >
        <span
          class="fr-icon-success-line"
          aria-hidden="true"
        ></span>
        {{ beneficiaryFieldLabels.vulnerablePerson }}
      </p>
    </div>
  </div>

  <template v-if="hasCoordinatesInformations(beneficiary.general)">
    <hr class="fr-col-12 fr-mt-5v fr-no-print" />

    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12">
        <h5 class="fr-text--md fr-mb-0">Coordonnées du bénéficiaire</h5>
      </div>
    </div>
    <div class="fr-grid-row fr-grid-row--gutters">
      <div
        v-if="hasPhoneOrAddress(beneficiary.general)"
        class="fr-col-12 fr-col-lg-6"
      >
        <BeneficiaryInfoLabel
          label="Numéro de téléphone"
          :value="phoneLabel"
        />
        <BeneficiaryInfoLabel
          label="Adresse"
          :value="formatAddress(beneficiary.general)"
        />
        <BeneficiaryInfoLabel
          v-if="beneficiary.general.qpv != null"
          :label="beneficiaryFieldLabels.qpv"
          :value="beneficiary.general.qpv ? 'Oui' : 'Non'"
        />
      </div>
      <div
        v-if="hasEmailOrAddressComplement(beneficiary.general)"
        class="fr-col-12 fr-col-lg-6"
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
  import { beneficiaryFieldLabels } from '~/client/labels/beneficiary.labels'

  const props = defineProps<{
    beneficiary: GetBeneficiaryOutput
  }>()

  const { application } = usePermissions()

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

<style scoped>
  .beneficiaryinfoheader__section {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
</style>
