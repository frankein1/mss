<template>
  <div class="fr-p-3v">
    <h2 class="title-blue fr-mb-6v">Informations générales</h2>
    <BeneficiaryFormFileInformation
      :agents="agents"
      :beneficiary-referent-ids="beneficiaryReferentIds"
      :permissions="permissions"
      full
    />
    <BeneficiaryFormIdentity
      id="identity"
      :similar-beneficiary="similarBeneficiary"
      @update:similar-beneficiary="updateSimilarBeneficiary"
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

  const similarBeneficiary = ref<SimilarBeneficiary>(undefined)

  withDefaults(
    defineProps<{
      beneficiaryReferentIds: String[]
      agents: BeneficiaryReferent[]
      permissions: FamilyFilePermissions
    }>(),
    {}
  )

  const emit = defineEmits<{
    'update:similarBeneficiary': [SimilarBeneficiary]
  }>()

  const updateSimilarBeneficiary = () => {
    emit('update:similarBeneficiary', similarBeneficiary.value)
  }
</script>
