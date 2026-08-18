<template>
  <AtomAlert
    v-if="hasLegacyData && !closed"
    :alert-type="AlertType.Warning"
    message="Des données historiques existent pour ce bénéficiaire et doivent être reportées dans les nouveaux champs."
    closeable
    class="fr-mb-6v"
    @close="closed = true"
  >
    <template #detailedMessage>
      <ul class="fr-mb-0">
        <li v-if="externalOrganisations.prescribingStructure">
          {{ beneficiaryFieldLabels.prescribingStructure }} :
          {{ externalOrganisations.prescribingStructure }}
        </li>
        <li v-if="externalOrganisations.serviceProviders">
          {{ beneficiaryFieldLabels.serviceProviders }} :
          {{ externalOrganisations.serviceProviders }}
        </li>
        <li v-if="externalOrganisations.involvedPartners">
          {{ beneficiaryFieldLabels.involvedPartners }} :
          {{ externalOrganisations.involvedPartners }}
        </li>
      </ul>
    </template>
  </AtomAlert>
</template>

<script setup lang="ts">
  import { beneficiaryFieldLabels } from '~/client/labels/beneficiary.labels'
  import type { GetBeneficiaryExternalOrganisations } from '~/types/beneficiary'
  import { AlertType } from '~/utils/constants/alert'

  const props = defineProps<{
    externalOrganisations: GetBeneficiaryExternalOrganisations
  }>()

  const closed = ref(false)

  const hasLegacyData = computed(
    () =>
      props.externalOrganisations.prescribingStructure ||
      props.externalOrganisations.serviceProviders ||
      props.externalOrganisations.involvedPartners
  )
</script>
