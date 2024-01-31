<template>
  <BeneficiaryFormSection :section-title="`Membre du foyer ${index + 1}`">
    <template #titleAction>
      <button
        class="fr-btn fr-btn--secondary fr-btn--sm fr-btn--icon-left fr-icon-delete-line"
        type="button"
        @click="emit('removeTaxHousehold')"
      >
        Supprimer ce membre du foyer
      </button>
    </template>

    <div class="fr-col-12 fr-col-lg-6">
      <VeeInput
        :label="relativeFieldLabels.lastName"
        :name="`taxHouseholds[${index}].lastName`"
      />
    </div>
    <div class="fr-col-12 fr-col-lg-6">
      <VeeInput
        :name="`taxHouseholds[${index}].firstName`"
        :label="relativeFieldLabels.firstName"
      />
    </div>
    <div class="fr-col-12 fr-col-lg-6">
      <VeeInput
        :name="`taxHouseholds[${index}].phone`"
        :label="relativeFieldLabels.phone"
        type="tel"
      />
    </div>
    <div class="fr-col-12 fr-col-lg-6">
      <VeeInput
        :name="`taxHouseholds[${index}].email`"
        :label="relativeFieldLabels.email"
        type="email"
      />
    </div>
    <div class="fr-col-12 fr-col-lg-6 fr-col-offset-lg-6--right">
      <VeeInput
        :name="`taxHouseholds[${index}].birthDate`"
        :label="relativeFieldLabels.birthDate"
        type="date"
      />
    </div>
    <div class="fr-col-12">
      <VeeSelect
        :name="`taxHouseholds[${index}].relationship`"
        :label="relativeFieldLabels.relationship"
        :options="withEmptyValue(taxHouseHoldRelationshipOptions)"
      />
    </div>
    <div class="fr-col-12">
      <VeeCheckbox
        :name="`taxHouseholds[${index}].caregiver`"
        :label="relativeFieldLabels.caregiver"
      />
    </div>
    <div class="fr-col-12">
      <VeeTextarea
        :name="`taxHouseholds[${index}].additionalInformation`"
        :label="relativeFieldLabels.additionalInformation"
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
  import { taxHouseHoldRelationshipOptions } from '~/client/options/beneficiary'
  import { relativeFieldLabels } from '~/client/labels'

  defineProps<{
    index: number
  }>()

  const emit = defineEmits<{
    removeTaxHousehold: []
  }>()
</script>
