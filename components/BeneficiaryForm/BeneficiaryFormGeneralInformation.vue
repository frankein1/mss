<template>
  <div class="fr-p-3v">
    <BeneficiaryFormFileInformation
      :agents="agents"
      :beneficiary-referent-ids="beneficiaryReferentIds"
      :permissions="permissions"
      full
    />
    <h2 class="title-blue fr-grid-row fr-grid-row--gutters fr-mb-6v fr-mt-3w">
      Informations générales
    </h2>
    <BeneficiaryFormIdentity
      id="identity"
      :similar-beneficiary="similarBeneficiary"
      @update:similar-beneficiaries="emit('update:similarBeneficiary', $event)"
    />
    <BeneficiaryFormContactDetails id="contact-details" />
    <BeneficiaryFormAddress id="address" />
    <BeneficiaryFormMobility id="mobility" />
    <BeneficiaryFormAdditionalInformation id="additional-information" />
  </div>
</template>

<script setup lang="ts">
  import { BeneficiaryReferent } from '~/types/beneficiary'
  import { FamilyFilePermissions } from '~/server/security'
  import { SimilarBeneficiary } from '~/server/trpc/routers'

  withDefaults(
    defineProps<{
      beneficiaryReferentIds: String[]
      agents: BeneficiaryReferent[]
      permissions: FamilyFilePermissions
      similarBeneficiary?: SimilarBeneficiary
    }>(),
    { beneficiary: undefined, similarBeneficiary: undefined }
  )

  const emit = defineEmits<{
    'update:similarBeneficiary': [SimilarBeneficiary]
  }>()
</script>
