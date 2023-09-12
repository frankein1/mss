<template>
  <div
    v-if="hasHealthSection"
    class="fr-container"
  >
    <div class="fr-grid-row">
      <BeneficiaryInfoLabel
        label="GIR"
        :value="BeneficiaryGirKeys.value(beneficiary.gir)"
        class="fr-col-6"
      />
      <BeneficiaryInfoLabel
        label="Médecin traitant"
        :value="beneficiary.doctor"
        class="fr-col-6"
      />
    </div>
    <div class="fr-grid-row">
      <BeneficiaryInfoLabel
        label="N de sécurité sociale"
        :value="beneficiary.socialSecurityNumber"
        class="fr-col-6"
      />
      <BeneficiaryInfoLabel
        label="Mutuelle"
        :value="beneficiary.insurance"
        class="fr-col-6"
      />
    </div>
    <div class="fr-grid-row">
      <BeneficiaryInfoLabel
        label="Informations Complémentaires"
        :value="beneficiary.healthAdditionalInformation"
        class="fr-col-12"
      />
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
