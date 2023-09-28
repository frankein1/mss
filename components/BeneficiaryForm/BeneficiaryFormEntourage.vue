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

    <div class="fr-col-12">
      <VeeInput
        label="Nom"
        :name="`entourages[${index}].lastName`"
      />
    </div>
    <div class="fr-col-12">
      <VeeInput
        label="Prénom"
        :name="`entourages[${index}].firstName`"
      />
    </div>
    <div class="fr-col-12">
      <VeeSelect
        :name="`entourages[${index}].relationship`"
        label="Statut"
        :options="withEmptyValue(entourageRelationshipOptions)"
      />
    </div>
    <div class="fr-col-12">
      <VeeCheckbox
        :name="`entourages[${index}].caregiver`"
        label="Aidant familial"
      />
    </div>
    <div class="fr-col-12">
      <VeeInput
        :name="`entourages[${index}].city`"
        label="Ville"
      />
    </div>
    <div class="fr-col-12">
      <VeeInput
        :name="`entourages[${index}].email`"
        label="Email"
        type="email"
      />
    </div>
    <div class="fr-col-12">
      <VeeInput
        :name="`entourages[${index}].phone`"
        label="Téléphone"
        type="tel"
      />
    </div>
    <div class="fr-col-12">
      <VeeTextarea
        :name="`entourages[${index}].additionalInformation`"
        label="Informations complémentaires"
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
  import { entourageRelationshipOptions } from '~/client/options/beneficiary'

  defineProps<{
    index: number
  }>()

  const emit = defineEmits<{
    removeEntourage: []
  }>()
</script>
