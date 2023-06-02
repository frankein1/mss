<template>
  <section
    v-if="hasHealthSection"
    class="beneficiary-details-section"
  >
    <h2 class="fr-h6">Santé</h2>
    <ul class="information-list">
      <li v-if="beneficiary.gir">
        <span class="information-label">GIR :</span>
        {{ beneficiaryGirLabels[beneficiary.gir] }}
      </li>
      <li v-if="beneficiary.doctor">
        <span class="information-label">Médecin traitant :</span>
        {{ beneficiary.doctor }}
      </li>
      <li v-if="beneficiary.healthAdditionalInformation">
        <span class="information-label">Informations complémentaires :</span>
        {{ beneficiary.healthAdditionalInformation }}
      </li>
      <li v-if="hasNirAccess && beneficiary.socialSecurityNumber">
        <span class="information-label">N° Sécurité Sociale :</span>
        {{ beneficiary.socialSecurityNumber }}
      </li>
      <li v-if="beneficiary.insurance">
        <span class="information-label">Mutuelle :</span>
        {{ beneficiary.insurance }}
      </li>
    </ul>
  </section>
</template>

<script lang="ts" setup>
  import { Beneficiary } from '@prisma/client'
  import { beneficiaryGirLabels } from '~/client/options/beneficiary'
  import { useAuthStore } from '~/store/auth'

  const props = defineProps<{
    beneficiary: Beneficiary
  }>()

  const authStore = useAuthStore()

  const hasHealthSection = computed(() => {
    const beneficiary = props.beneficiary
    return (
      beneficiary.gir ||
      beneficiary.doctor ||
      beneficiary.healthAdditionalInformation ||
      (hasNirAccess.value && beneficiary.socialSecurityNumber) ||
      beneficiary.insurance
    )
  })

  const hasNirAccess = computed(
    () => !authStore.isMinistryAgent && !authStore.isAssociationAgent
  )
</script>
