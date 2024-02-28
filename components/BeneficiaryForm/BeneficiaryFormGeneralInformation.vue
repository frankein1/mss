<template>
  <div class="fr-p-3v">
    <BeneficiaryFormFileInformation
      :agents="agents"
      :beneficiary="beneficiary"
      :permissions="permissions"
    />
    <h2 class="title-blue fr-grid-row fr-grid-row--gutters fr-mb-6v fr-mt-3w">
      Informations générales
    </h2>
    <BeneficiaryFormIdentity
      id="identity"
      :permissions="permissions"
      :similar-beneficiaries="similarBeneficiaries"
      @update:similar-beneficiaries="
        emit('update:similarBeneficiaries', $event)
      "
    />
    <BeneficiaryFormContactDetails id="contact-details" />
    <BeneficiaryFormAddress
      id="address"
      :permissions="permissions"
    />
    <BeneficiaryFormMobility id="mobility" />
    <BeneficiaryFormAdditionalInformation id="additional-information" />
  </div>
</template>

<script setup lang="ts">
  import { SaveBeneficiaryGeneralInformationInput } from '~/server/schema'
  import { BeneficiaryReferent } from '~/types/beneficiary'
  import { BeneficiaryPermissions } from '~/server/security'
  import { SimilarBeneficiaries } from '~/server/trpc/routers'

  withDefaults(
    defineProps<{
      beneficiary?: SaveBeneficiaryGeneralInformationInput
      agents: BeneficiaryReferent[]
      permissions: BeneficiaryPermissions
      similarBeneficiaries?: SimilarBeneficiaries
    }>(),
    { beneficiary: undefined, similarBeneficiaries: undefined }
  )

  const emit = defineEmits<{
    'update:similarBeneficiaries': [SimilarBeneficiaries]
  }>()
</script>
