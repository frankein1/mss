<template>
  <div class="fr-p-3v">
    <h2 class="title-blue fr-mb-6v">Informations générales</h2>
    <BeneficiaryFormFileInformation
      :agents
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
  import {
    BeneficiaryIdentification,
    BeneficiaryReferent
  } from '~/types/beneficiary'
  import { SimilarBeneficiary } from '~/server/trpc/routers'
  import { BeneficiaryStatus } from '@prisma/client'

  const similarBeneficiary = ref<SimilarBeneficiary>(undefined)

  withDefaults(
    defineProps<{
      beneficiaryReferentIds: String[]
      agents: BeneficiaryReferent[]
      initialBeneficiary: BeneficiaryIdentification | null
      initialBeneficiaryStatus: BeneficiaryStatus | undefined
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
