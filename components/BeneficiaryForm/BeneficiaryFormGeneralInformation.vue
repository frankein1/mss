<template>
  <div class="fr-p-3v">
    <h2 class="title-blue fr-mb-6v">Informations générales</h2>
    <BeneficiaryFormFileInformation
      :agents
      :permissions
      :beneficiary-referent-ids="beneficiaryReferentIds"
      :initial-beneficiary-status="initialBeneficiaryStatus"
      full
    />
    <BeneficiaryFormIdentity
      id="identity"
      :similar-beneficiary="similarBeneficiary"
      :initial-beneficiary="initialBeneficiary"
      @update="updateSimilarBeneficiary"
    />
    <BeneficiaryFormContactDetails id="contact-details" />
    <BeneficiaryFormAddress id="address" />
    <BeneficiaryFormMobility id="mobility" />
    <BeneficiaryFormAdditionalInformation id="additional-information" />
  </div>
</template>

<script setup lang="ts">
  import type {
    BeneficiaryIdentification,
    BeneficiaryReferent
  } from '~/types/beneficiary'
  import type { SimilarBeneficiary } from '~/server/trpc/routers'
  import type { BeneficiaryStatus } from '@prisma/client'
  import type { FamilyFilePermissions } from '~/server/security'

  const similarBeneficiary = ref<SimilarBeneficiary>(undefined)

  withDefaults(
    defineProps<{
      beneficiaryReferentIds: String[]
      agents: BeneficiaryReferent[]
      initialBeneficiary: BeneficiaryIdentification | null
      initialBeneficiaryStatus: BeneficiaryStatus | undefined
      permissions: FamilyFilePermissions
    }>(),
    {}
  )

  const emit = defineEmits<{
    update: [similarBeneficiary: SimilarBeneficiary]
  }>()

  const updateSimilarBeneficiary = (similarBeneficiary: SimilarBeneficiary) => {
    emit('update', similarBeneficiary)
  }
</script>
