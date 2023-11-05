<template>
  <BeneficiaryInfoSection
    v-if="hasEntourages"
    id="entourages"
    title="Entourage"
    :edit-link="editLink"
  >
    <div class="fr-container">
      <BeneficiaryInfoEntouragesContent :entourages="entourages" />
    </div>
  </BeneficiaryInfoSection>
</template>

<script setup lang="ts">
  import { GetBeneficiaryOutput } from '~/server/trpc/routers'
  import { BeneficiaryRelativeWithLinkedBeneficiary } from '~/types/relative'
  import { RoutePath } from '~/utils/routing'

  const props = defineProps<{
    beneficiary: GetBeneficiaryOutput
    entourages: BeneficiaryRelativeWithLinkedBeneficiary[]
  }>()

  const hasEntourages = computed(() => props.entourages.length > 0)

  const editLink = computed(() =>
    RoutePath.AppBeneficiaryEditEntourage(props.beneficiary.id)
  )
</script>
