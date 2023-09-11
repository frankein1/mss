<template>
  <div
    v-if="hasHealthSection"
    class="fr-container"
  >
    <div class="fr-grid-row">
      <div class="fr-col-6">
        <BeneficiaryInfoLabel
          label="GIR"
          :value="BeneficiaryGirKeys.value(beneficiary.gir)"
        />
        <BeneficiaryInfoLabel
          label="N de sécurité sociale"
          :value="beneficiary.socialSecurityNumber"
        />
      </div>
      <div class="fr-col-6">
        <BeneficiaryInfoLabel
          label="Médecin traitant"
          :value="beneficiary.doctor"
        />
        <BeneficiaryInfoLabel
          label="Mutuelle"
          :value="beneficiary.insurance"
        />
      </div>
      <div class="fr-col-12">
        <BeneficiaryInfoLabel
          label="Informations Complémentaires"
          :value="beneficiary.healthAdditionalInformation"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { GetBeneficiaryOutput } from '~/server/routers'
  import { useAuthStore } from '~/store/auth'
  import { canViewBeneficiaryNir } from '~/server/security/rules'
  import { BeneficiaryGirKeys } from '~/client/options/beneficiary'

  const props = defineProps<{
    beneficiary: GetBeneficiaryOutput
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

  const hasNirAccess = computed(() =>
    canViewBeneficiaryNir(authStore.userStructureType)
  )
</script>
