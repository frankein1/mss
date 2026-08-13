<template>
  <div class="fr-container fr-p-2w">
    <div
      v-for="(item, index) in fields"
      :key="item.key"
      v-autofocus
      class="fr-grid-row fr-grid-row--gutters fr-mb-2w"
    >
      <div class="fr-col-12 fr-col-md-8">
        <VeeInput
          :name="`customs[${index}].name`"
          label="Intitulé de l’objet d’accompagnement (obligatoire)"
          hint="Choisissez un nom court et clair"
        />
      </div>

      <div class="fr-col-12 fr-col-md-4">
        <button
          class="fr-btn fr-btn--sm fr-btn--tertiary-no-outline fr-btn--icon-left fr-icon-delete-line"
          type="button"
          @click="remove(index)"
        >
          Supprimer l'objet
        </button>
      </div>
    </div>

    <div class="fr-grid-row fr-grid-row--gutters fr-mb-2w">
      <div class="fr-col-12">
        <button
          class="fr-btn fr-btn--sm fr-btn--tertiary-no-outline fr-btn--icon-left fr-icon-add-line"
          type="button"
          @click="push({ id: randomUUID() })"
        >
          Ajouter un autre objet
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const randomUUID = () => crypto.randomUUID()

  const { fields, push, remove } = useFieldArray('customs')
</script>

<style lang="scss" scoped>
  .fr-grid-row {
    align-items: flex-end;
  }
</style>
