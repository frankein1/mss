<template>
  <BeneficiaryForm
    :beneficiary="beneficiary"
    :is-submitting="isSubmitting"
    :agents="agents"
    @save-beneficiary="emit('saveBeneficiary', $event)"
  />
</template>

<script setup lang="ts">
  import { BeneficiaryReferent } from '~/types/beneficiary'
  import { UpdateBeneficiaryInput } from '~/server/schema/beneficiary.schema'
  import type { GetBeneficiaryOutput } from '~/server/routers'

  defineProps<{
    beneficiary: GetBeneficiaryOutput
    isSubmitting: boolean
    agents: BeneficiaryReferent[]
  }>()

  const emit = defineEmits<{
    saveBeneficiary: [beneficiary: UpdateBeneficiaryInput]
  }>()
</script>
