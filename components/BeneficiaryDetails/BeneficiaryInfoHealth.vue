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
  import { BeneficiaryEditPermission } from '~/server/security'
  import { GetBeneficiaryHealth } from '~/server/route'
  import { RoutePath } from '~/utils/routing'

  const props = defineProps<{
    beneficiaryId: string
    health?: GetBeneficiaryHealth
    permissions: BeneficiaryEditPermission
  }>()

  const editLink = computed(() =>
    RoutePath.AppBeneficiaryEditHealth(props.beneficiaryId)
  )
</script>
