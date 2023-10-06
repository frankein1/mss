<template>
  <BeneficiaryInfoSection
    v-if="hasGeneralInfo"
    title="Informations générales"
    :edit-link="editLink"
  >
    <div class="fr-container">
      <div v-if="hasIdentityInformations(beneficiary)">
        <div class="fr-grid-row">
          <div class="fr-col-12 fr-pb-1w fr-text--bold">
            Identité du bénéficiaire
          </div>
        </div>
        <div class="fr-grid-row">
          <div class="fr-col-6 fr-pb-2w">
            <div class="field-value">
              {{ formatBeneficiaryName(beneficiary) }}
            </div>
            <div class="field-value">
              {{ formatBeneficiaryBirthInfo(beneficiary) }}
            </div>
          </div>
          <BeneficiaryInfoLabel
            :label="beneficiaryFieldLabels.gender"
            :value="BeneficiaryGenderKeys.value(beneficiary.gender)"
            class="fr-col-6"
          />
        </div>
        <div class="fr-grid-row">
          <BeneficiaryInfoLabel
            :label="beneficiaryFieldLabels.birthName"
            :value="beneficiary.birthName"
            class="fr-col-6"
          />
          <BeneficiaryInfoLabel
            :label="beneficiaryFieldLabels.nationality"
            :value="NationalityKeys.value(beneficiary.nationality)"
            class="fr-col-6"
          />
        </div>
        <div
          v-if="isMinistryAgent"
          class="fr-grid-row"
        >
          <BeneficiaryInfoLabel
            :label="beneficiaryFieldLabels.numeroPegase"
            :value="beneficiary.numeroPegase"
            class="fr-col-12"
          />
        </div>
      </div>

      <div v-if="hasCoordinatesInformations(beneficiary)">
        <hr class="fr-col-12 fr-mt-5v" />

        <div class="fr-grid-row">
          <div class="fr-col-12 fr-pb-1w fr-text--bold">
            Adresse/Hébergement
          </div>
        </div>

        <div class="fr-grid-row">
          <BeneficiaryInfoLabel
            :label="beneficiaryFieldLabels.accommodationMode"
            :value="
              BeneficiaryAccommodationModeKeys.value(
                beneficiary.accommodationMode
              )
            "
            class="fr-col-12"
          />
          <BeneficiaryInfoLabel
            :label="beneficiaryFieldLabels.accommodationAdditionalInformation"
            :value="beneficiary.accommodationAdditionalInformation"
            class="fr-col-12"
          />
        </div>

        <div class="fr-grid-row">
          <BeneficiaryInfoLabel
            :label="beneficiaryFieldLabels.street"
            :value="formatAddress(beneficiary)"
            class="fr-col-6"
          />
          <BeneficiaryInfoLabel
            :label="beneficiaryFieldLabels.addressComplement"
            :value="beneficiary.addressComplement"
            class="fr-col-6"
          />
        </div>
      </div>

      <div
        v-if="beneficiary.mobility"
        class="fr-grid-row"
      >
        <hr class="fr-col-12 fr-mt-5v" />

        <div class="fr-col-12 fr-pb-1w">
          <div class="fr-text--bold">Mobilité</div>
        </div>

        <BeneficiaryInfoLabel
          :value="BeneficiaryMobilityKeys.value(beneficiary.mobility)"
          class="fr-col-12"
        />
      </div>

      <div
        v-if="beneficiary.additionalInformation"
        class="fr-grid-row"
      >
        <hr class="fr-col-12 fr-mt-5v" />
        <div class="fr-col-12 fr-pb-1w fr-text--bold">
          Informations complémentaires
        </div>
        <div class="field-value fr-col-12">
          {{ beneficiary.additionalInformation }}
        </div>
      </div>
    </div>
  </BeneficiaryInfoSection>
</template>

<script lang="ts" setup>
  import type { GetBeneficiaryOutput } from '~/server/trpc/routers'
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
    hasIdentityInformations,
    hasCoordinatesInformations
  } from '~/utils/beneficiary'
  import { RoutePath } from '~/utils/routing'
  import { beneficiaryFieldLabels } from '~/client/labels/beneficiary.labels'

  const props = defineProps<{
    beneficiary: GetBeneficiaryOutput
  }>()

  const isMinistryAgent = useMinistryAgent()

  const hasGeneralInfo = computed(
    () =>
      hasIdentityInformations(props.beneficiary) ||
      hasAddressInformations(props.beneficiary) ||
      hasMobilityInformations(props.beneficiary) ||
      hasAdditionalInformations(props.beneficiary)
  )

  const editLink = computed(() =>
    RoutePath.AppBeneficiaryEditInfo(props.beneficiary.id)
  )
</script>
~/server/trpc/routers
