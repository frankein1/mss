<template>
  <BeneficiaryInfoSection
    v-if="hasHealthInfo"
    id="health"
    title="Santé"
    :edit-link="editLink"
  >
    <div class="fr-container">
      <BeneficiaryInfoHealthContent :beneficiary="beneficiary" />
    </div>
  </BeneficiaryInfoSection>
</template>

<script lang="ts" setup>
  import { hasAccessBeneficiaryField } from '~/security/permission'
  import type { GetBeneficiaryOutput } from '~/server/trpc/routers'
  import { useAuthStore } from '~/store/auth'
  import { RoutePath } from '~/utils/routing'

  const props = defineProps<{
    beneficiary: GetBeneficiaryOutput
  }>()

  const authStore = useAuthStore()

  const hasNirAccess = computed(() =>
    hasAccessBeneficiaryField(authStore.userStructureType, 'nir')
  )

  const hasHealthInfo = computed(() => {
    const beneficiary = props.beneficiary
    return (
      beneficiary.gir ||
      beneficiary.doctor ||
      beneficiary.healthAdditionalInformation ||
      (hasNirAccess.value && beneficiary.socialSecurityNumber) ||
      beneficiary.insurance
    )
  })

  const editLink = computed(() =>
    RoutePath.AppBeneficiaryEditHealth(props.beneficiary.id)
  )
</script>
