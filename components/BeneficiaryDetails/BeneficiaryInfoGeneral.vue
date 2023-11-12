<template>
  <BeneficiaryInfoSection
    v-if="general"
    id="general"
    title="Informations générales"
    :edit-link="editLink"
  >
    <div class="fr-container">
      <BeneficiaryInfoGeneralContent :general="general" />
    </div>
  </BeneficiaryInfoSection>
</template>

<script lang="ts" setup>
  import { GetBeneficiaryGeneral } from '~/types/beneficiary'
  import { RoutePath } from '~/utils/routing'

  const props = defineProps<{
    beneficiaryId: string
    general: GetBeneficiaryGeneral
  }>()

  const editLink = computed(() =>
    RoutePath.AppBeneficiaryEditInfo(props.beneficiaryId)
  )
</script>
