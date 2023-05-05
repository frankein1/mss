<template>
  <AccordionFieldset label="Santé">
    <div class="fr-container--fluid">
      <div class="fr-grid-row fr-grid-row--gutters form-grid">
        <AtomSelect
          name="gir"
          label="GIR"
          :options="beneficiaryGirOptions"
          :model-value="beneficiary?.gir || ''"
        />
        <AtomInput
          class="fr-col-offset-lg-4--right"
          name="doctor"
          label="Médecin traitant"
          :value="beneficiary?.doctor || ''"
        />
        <AtomInput
          class="fr-col-12"
          name="health_additional_information"
          label="Informations complémentaires"
          :value="beneficiary?.healthAdditionalInformation || ''"
        />
        <AtomInput
          v-if="hasNirAccess"
          name="social_security_number"
          label="N° Sécurité Sociale"
          :value="beneficiary?.socialSecurityNumber || ''"
          type="social-security-number"
        />
        <AtomInput
          name="insurance"
          label="Mutuelle"
          :value="beneficiary?.insurance || ''"
        />
      </div>
    </div>
  </AccordionFieldset>
</template>

<script lang="ts" setup>
  import { Beneficiary } from '@prisma/client'
  import { beneficiaryGirOptions } from '~/client/options/beneficiary'
  import { useAuthStore } from '~/store/auth'

  const authStore = useAuthStore()
  const isMinistryAgent = useMinistryAgent()

  defineProps<{
    beneficiary: Beneficiary
  }>()

  const hasNirAccess = computed(
    () => !isMinistryAgent.value && !authStore.isAssociationAgent
  )
</script>
