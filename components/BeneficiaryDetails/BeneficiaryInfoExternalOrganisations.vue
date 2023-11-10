<template>
  <BeneficiaryInfoSection
    v-if="externalOrganisations"
    id="externalOrganisations"
    title="Structures extérieures"
    :edit-link="editLink"
  >
    <div class="fr-container">
      <BeneficiaryInfoExternalOrganisationsContent
        :external-organisations="externalOrganisations"
      />
    </div>
  </BeneficiaryInfoSection>
</template>

<script setup lang="ts">
  import { GetBeneficiaryExternalOrganisations } from '~/server/route'
  import { RoutePath } from '~/utils/routing'

  const props = defineProps<{
    beneficiaryId: string
    externalOrganisations?: GetBeneficiaryExternalOrganisations
  }>()

  const editLink = computed(() =>
    RoutePath.AppBeneficiaryEditExternalOrganisations(props.beneficiaryId)
  )
</script>
