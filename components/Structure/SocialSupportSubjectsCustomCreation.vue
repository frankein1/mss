<template>
  <div class="fr-container">
    <div
      v-for="(item, index) in fields"
      :key="item.key"
      class="fr-grid-row fr-mb-2w"
    >
      <div class="fr-col-8">
        <VeeInput
          :name="`customs[${index}].name`"
          label="Intitulé de l’objet d’accompagnement (obligatoire)"
          hint="Choisissez un nom court et clair"
        />
      </div>
      <div class="fr-col-3 delete-sss">
        <button
          class="fr-btn fr-btn--sm fr-btn--tertiary-no-outline fr-btn--icon-left fr-icon-delete-line"
          type="button"
          @click="remove(index)"
        >
          Supprimer l'objet
        </button>
      </div>
    </div>
    <div class="fr-grid-row">
      <button
        class="fr-btn fr-btn--sm fr-btn--tertiary-no-outline fr-btn--icon-left fr-icon-add-line"
        type="button"
        @click="push({ id: v4() })"
      >
        Ajouter un autre objet
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { v4 } from 'uuid'

  const { fields, push, remove } = useFieldArray('customs')
</script>

<style lang="scss" scoped>
  .delete-sss {
    display: flex;
    flex-direction: column-reverse;
    align-items: flex-start;
    margin-left: 1.5rem;
  }
</style>
