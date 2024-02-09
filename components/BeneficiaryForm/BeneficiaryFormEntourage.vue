<template>
  <BeneficiaryFormSection :section-title="`Proche ${index + 1}`">
    <template #titleAction>
      <button
        class="fr-btn fr-btn--secondary fr-btn--sm fr-btn--icon-left fr-icon-delete-line"
        type="button"
        @click="emit('removeEntourage')"
      >
        Supprimer ce proche
      </button>
    </template>

    <div class="fr-col-12 fr-col-lg-6">
      <VeeInput
        v-autofocus="'input'"
        :label="relativeFieldLabels.lastName"
        :name="`entourages[${index}].lastName`"
      />
    </div>
    <div class="fr-col-12 fr-col-lg-6">
      <VeeInput
        :label="relativeFieldLabels.firstName"
        :name="`entourages[${index}].firstName`"
      />
    </div>
    <div class="fr-col-12 fr-col-lg-6">
      <VeeInput
        :name="`entourages[${index}].phone`"
        :label="relativeFieldLabels.phone"
        type="tel"
      />
    </div>

    <div class="fr-col-12 fr-col-lg-6">
      <VeeInput
        :name="`entourages[${index}].email`"
        :label="relativeFieldLabels.email"
        type="email"
      />
    </div>
    <div class="fr-col-12">
      <VeeInput
        :name="`entourages[${index}].city`"
        :label="relativeFieldLabels.city"
      />
    </div>
    <div class="fr-col-12">
      <VeeSelect
        :name="`entourages[${index}].relationship`"
        :label="relativeFieldLabels.relationship"
        :options="withEmptyValue(entourageRelationshipOptions)"
      />
    </div>
    <div class="fr-col-12">
      <VeeCheckbox
        :name="`entourages[${index}].caregiver`"
        :label="relativeFieldLabels.caregiver"
      />
    </div>
    <div class="fr-col-12">
      <VeeTextarea
        :name="`entourages[${index}].additionalInformation`"
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
  import { entourageRelationshipOptions } from '~/client/options'
  import { relativeFieldLabels } from '~/client/labels'

  defineProps<{
    index: number
  }>()

  const emit = defineEmits<{
    removeEntourage: []
  }>()
</script>
