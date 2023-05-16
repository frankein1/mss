<template>
  <fieldset class="fr-fieldset fr-container--fluid relative-fieldset">
    <legend class="fr-fieldset__legend--regular fr-fieldset__legend">
      <h3 class="fr-h5">
        {{ `Proche ${index + 1}` }}
      </h3>
    </legend>
    <div class="fr-grid-row fr-grid-row--gutters form-grid">
      <div class="fr-fieldset__element">
        <VeeInput
          label="Nom"
          :name="`entourage.entourages[${index}].lastName`"
        />
      </div>
      <div class="fr-fieldset__element">
        <VeeInput
          label="Prénom"
          :name="`entourage.entourages[${index}].firstName`"
        />
      </div>
      <div class="fr-fieldset__element">
        <VeeSelect
          :name="`entourage.entourages[${index}].relationship`"
          label="Statut"
          :options="withEmptyValue(entourageRelationshipOptions)"
        />
      </div>
      <div class="fr-fieldset__element">
        <VeeInput
          :name="`entourage.entourages[${index}].city`"
          label="Ville"
        />
      </div>
      <div class="fr-fieldset__element">
        <VeeInput
          :name="`entourage.entourages[${index}].email`"
          label="Email"
          type="email"
        />
      </div>
      <div class="fr-fieldset__element">
        <VeeInput
          :name="`entourage.entourages[${index}].phone`"
          label="Téléphone"
          type="tel"
        />
      </div>
      <div class="fr-fieldset__element">
        <VeeCheckbox
          :name="`entourage.entourages[${index}].caregiver`"
          label="Aidant familial"
        />
      </div>
      <div class="fr-fieldset__element">
        <VeeInput
          class="fr-col-12"
          :name="`entourage.entourages[${index}].additionalInformation`"
          label="Informations complémentaires"
        />
      </div>
    </div>

    <button
      class="fr-btn fr-btn--secondary fr-btn--sm fr-btn--icon-left fr-icon-delete-line fr-mt-2w delete-relative-btn"
      type="button"
      @click="emit('removeEntourage')"
    >
      Supprimer ce proche
    </button>
  </fieldset>
</template>

<script lang="ts" setup>
  import { FieldEntry } from 'vee-validate'
  import { entourageRelationshipOptions } from '~/client/options/beneficiary'
  import { CreateOrUpdateEntourageInput } from '~/server/schema'

  defineProps<{
    entourage: FieldEntry<CreateOrUpdateEntourageInput>
    index: number
  }>()

  const emit = defineEmits<{
    (e: 'removeEntourage'): void
  }>()
</script>

<style scoped>
  .relative-fieldset {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .delete-relative-btn {
    box-shadow: inset 0 0 0 1px var(--border-plain-error);
    color: var(--border-plain-error);
  }
</style>
