<template>
  <BeneficiaryFormSection>
    <div class="fr-col-12">
      <VeeSelect
        name="gir"
        :label="beneficiaryFieldLabels.gir"
        :options="withEmptyValue(beneficiaryGirOptions)"
      />
    </div>
    <div class="fr-col-12">
      <VeeInput
        name="doctor"
        :label="beneficiaryFieldLabels.doctor"
      />
    </div>
    <div class="fr-col-12">
      <VeeInput
        v-if="hasNirAccess"
        name="socialSecurityNumber"
        :label="beneficiaryFieldLabels.socialSecurityNumber"
        type="social-security-number"
      />
    </div>
    <div class="fr-col-12">
      <VeeInput
        name="insurance"
        :label="beneficiaryFieldLabels.insurance"
      />
    </div>
    <div class="fr-col-12">
      <VeeTextarea
        name="healthAdditionalInformation"
        :label="beneficiaryFieldLabels.healthAdditionalInformation"
      >
        <template #hint>
          Il est fortement recommandé de ne stocker que les informations utiles
          au suivi du bénéficiaire et d'éviter le recueil d'informations
          sensibles (données de santé, mots de passe, etc).
        </template>
      </VeeTextarea>
    </div>
  </BeneficiaryFormSection>
</template>

<script lang="ts" setup>
  import { beneficiaryGirOptions } from '~/client/options/beneficiary'
  import { useAuthStore } from '~/store/auth'
  import { canSetBeneficiaryNir } from '~/server/security/rules'
  import { beneficiaryFieldLabels } from '~/client/labels/beneficiary.labels'

  const authStore = useAuthStore()

  const hasNirAccess = computed(() =>
    canSetBeneficiaryNir(authStore.userStructureType)
  )
</script>
