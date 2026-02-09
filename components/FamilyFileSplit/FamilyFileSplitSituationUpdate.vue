<template>
  <div>
    <VeeSelect
      name="familySituation"
      :label="beneficiaryFieldLabels.familySituation"
      :options="withEmptyValue(beneficiaryFamilySituationKeys.options)"
    />

    <VeeInput
      v-if="showDivorceDate"
      name="divorceDate"
      :label="beneficiaryFieldLabels.divorceDate"
      type="date"
    />
  </div>
</template>

<script setup lang="ts">
  import type { BeneficiaryFamilySituation } from '~/prisma/generated/client'
  import { beneficiaryFieldLabels } from '~/client/labels'
  import { beneficiaryFamilySituationKeys } from '~/client/options'

  const { value } = useField<BeneficiaryFamilySituation>('familySituation')

  const showDivorceDate = computed(() => isSeparate(value.value))
</script>
