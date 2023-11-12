<template>
  <BeneficiaryInfoSection
    v-if="health"
    title="Santé"
    :edit-link="editLink"
  >
    <div class="fr-container">
      <BeneficiaryInfoHealthContent :health="health" />
    </div>
  </BeneficiaryInfoSection>
</template>

<script lang="ts" setup>
  import { BeneficiaryPermissions } from '~/server/security'
  import { GetBeneficiaryHealth } from '~/types/beneficiary'
  import { RoutePath } from '~/utils/routing'

  const props = defineProps<{
    beneficiaryId: string
    health?: GetBeneficiaryHealth
    permissions: BeneficiaryPermissions
  }>()

  const editLink = computed(() =>
    RoutePath.AppBeneficiaryEditHealth(props.beneficiaryId)
  )
</script>
