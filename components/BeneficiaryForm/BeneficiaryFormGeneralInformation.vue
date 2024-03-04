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
      :similar-beneficiary="similarBeneficiary"
      @update:similar-beneficiaries="emit('update:similarBeneficiary', $event)"
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
  import { SimilarBeneficiary } from '~/server/trpc/routers'

  withDefaults(
    defineProps<{
      beneficiary?: SaveBeneficiaryGeneralInformationInput
      agents: BeneficiaryReferent[]
      permissions: BeneficiaryPermissions
      similarBeneficiary?: SimilarBeneficiary
    }>(),
    { beneficiary: undefined, similarBeneficiary: undefined }
  )

  const emit = defineEmits<{
    'update:similarBeneficiary': [SimilarBeneficiary]
  }>()
</script>
