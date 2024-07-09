<template>
  <BeneficiaryFormSection>
    <div class="fr-col-12">
      <VeeSelect
        name="gir"
        :label="beneficiaryFieldLabels.gir"
        :options="withEmptyValue(beneficiaryGirKeys.options)"
      />
    </div>
    <div class="fr-col-12">
      <VeeInput
        name="doctor"
        :label="beneficiaryFieldLabels.doctor"
      />
    </div>
    <div
      v-if="application.edit.health.nir"
      class="fr-col-12"
    >
      <VeeInput
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
  import { beneficiaryGirKeys } from '~/client/options'
  import { beneficiaryFieldLabels } from '~/client/labels/beneficiary.labels'

  const { application } = usePermissions()
</script>
