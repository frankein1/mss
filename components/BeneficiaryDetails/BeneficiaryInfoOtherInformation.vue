<template>
  <BeneficiaryInfoSection
    v-if="hasOtherInformationSection"
    title="Structures extérieures"
    :edit-link="editLink"
  >
    <div class="fr-container">
      <div class="fr-grid-row">
        <BeneficiaryInfoLabel
          label="Mesure de protection"
          :value="
            BeneficiaryProtectionMeasureKeys.value(
              beneficiary.protectionMeasure
            )
          "
          class="fr-col-6"
        />
        <BeneficiaryInfoLabel
          label="Nom, prénom, coordonées du mandataire"
          :value="beneficiary.representative"
          class="fr-col-6"
        />
      </div>
      <div class="fr-grid-row">
        <BeneficiaryInfoLabel
          label="Organisme prescripteur"
          :value="beneficiary.prescribingStructure"
          class="fr-col-6"
        />
        <BeneficiaryInfoLabel
          label="Mode d'orientation"
          :value="
            BeneficiaryOrientationTypeKeys.value(beneficiary.orientationType)
          "
          class="fr-col-6"
        />
      </div>
      <div class="fr-grid-row">
        <BeneficiaryInfoLabel
          label="Organisme d'orientation"
          :value="beneficiary.orientationStructure"
          class="fr-col-6"
        />
        <BeneficiaryInfoLabel
          label="Prestataires"
          :value="beneficiary.serviceProviders"
          class="fr-col-6"
        />
      </div>
      <div class="fr-grid-row">
        <BeneficiaryInfoLabel
          label="Partenaires intervenants"
          :value="beneficiary.involvedPartners"
          class="fr-col-6"
        />
      </div>
    </div>
  </BeneficiaryInfoSection>
</template>

<script setup lang="ts">
  import type { GetBeneficiaryOutput } from '~/server/trpc/routers'
  import {
    BeneficiaryOrientationTypeKeys,
    BeneficiaryProtectionMeasureKeys
  } from '~/client/options/beneficiary'
  import { RoutePath } from '~/utils/routing'

  const props = defineProps<{
    beneficiary: GetBeneficiaryOutput
  }>()

  const editLink = computed(
    () => RoutePath.AppBeneficiaryEditInfo(props.beneficiary.id) // TODO: Update path
  )

  const hasOtherInformationSection = computed(
    () =>
      props.beneficiary.protectionMeasure ||
      props.beneficiary.representative ||
      props.beneficiary.prescribingStructure ||
      props.beneficiary.orientationType ||
      props.beneficiary.orientationStructure ||
      props.beneficiary.serviceProviders ||
      props.beneficiary.involvedPartners
  )
</script>
~/server/trpc/routers
