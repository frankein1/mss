<template>
  <BeneficiaryInfoSection
    v-if="hasHealthInfo"
    title="Santé"
    :edit-link="editLink"
  >
    <div class="fr-container">
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
  </BeneficiaryInfoSection>
</template>

<script lang="ts" setup>
  import type { GetBeneficiaryOutput } from '~/server/trpc/routers'
  import { useAuthStore } from '~/store/auth'
  import { canViewBeneficiaryNir } from '~/server/security/rules'
  import { BeneficiaryGirKeys } from '~/client/options/beneficiary'
  import { RoutePath } from '~/utils/routing'

  const props = defineProps<{
    beneficiary: GetBeneficiaryOutput
  }>()

  const authStore = useAuthStore()

  const hasNirAccess = computed(() =>
    canViewBeneficiaryNir(authStore.userStructureType)
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
~/server/trpc/routers
