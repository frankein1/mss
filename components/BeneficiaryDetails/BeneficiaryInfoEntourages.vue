<template>
  <BeneficiaryInfoSection
    v-if="hasEntourages"
    title="Entourage"
    :beneficiary-id="beneficiary.id"
  >
    <div class="fr-container">
      <div class="fr-grid-row">
        <div
          v-for="(entourage, index) in entourages"
          :key="entourage.id"
          class="fr-col-12"
        >
          <hr
            v-if="index > 0"
            class="fr-col-12 fr-mt-5v"
          />
          <BeneficiaryInfoRelative :relative="entourage" />
        </div>
      </div>
    </div>
  </BeneficiaryInfoSection>
</template>

<script setup lang="ts">
  import { GetBeneficiaryOutput } from '~/server/routers'
  import { BeneficiaryRelativeWithLinkedBeneficiary } from '~/types/relative'

  const props = defineProps<{
    beneficiary: GetBeneficiaryOutput
    entourages: BeneficiaryRelativeWithLinkedBeneficiary[]
  }>()

  const hasEntourages = props.entourages?.length > 0
</script>
