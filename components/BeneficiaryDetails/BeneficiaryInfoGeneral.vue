<template>
  <BeneficiaryInfoSection
    v-if="hasGeneralInfo"
    id="general"
    title="Informations générales"
    :edit-link="editLink"
  >
    <div class="fr-container">
      <BeneficiaryInfoGeneralContent :beneficiary="beneficiary" />
    </div>
  </BeneficiaryInfoSection>
</template>

<script lang="ts" setup>
  import type { GetBeneficiaryOutput } from '~/server/trpc/routers'
  import { hasIdentityInformations } from '~/utils/beneficiary'
  import { RoutePath } from '~/utils/routing'

  const props = defineProps<{
    beneficiary: GetBeneficiaryOutput
  }>()

  const hasGeneralInfo = computed(
    () =>
      hasIdentityInformations(props.beneficiary) ||
      hasAddressInformations(props.beneficiary) ||
      hasMobilityInformations(props.beneficiary) ||
      hasAdditionalInformations(props.beneficiary)
  )

  const editLink = computed(() =>
    RoutePath.AppBeneficiaryEditInfo(props.beneficiary.id)
  )
</script>
