<template>
  <div class="fr-container--fluid">
    <div class="fr-grid-row fr-grid-row--gutters form-grid">
      <VeeSelect
        name="health.gir"
        label="GIR"
        :options="beneficiaryGirOptions"
      />
      <VeeInput
        class="fr-col-offset-lg-4--right"
        name="health.doctor"
        label="Médecin traitant"
      />
      <VeeInput
        class="fr-col-12"
        name="health.healthAdditionalInformation"
        label="Informations complémentaires"
      />
      <VeeInput
        v-if="hasNirAccess"
        name="health.socialSecurityNumber"
        label="N° Sécurité Sociale"
      />
      <VeeInput
        name="health.insurance"
        label="Mutuelle"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { beneficiaryGirOptions } from '~/client/options/beneficiary'
  import { useAuthStore } from '~/store/auth'

  const authStore = useAuthStore()
  const isMinistryAgent = useMinistryAgent()

  const hasNirAccess = computed(
    () => !isMinistryAgent.value && !authStore.isAssociationAgent
  )
</script>
