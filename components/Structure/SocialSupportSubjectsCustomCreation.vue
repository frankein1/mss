<template>
  <section class="feature-section fr-accordion">
    <h3 class="fr-accordion__title">
      <button
        class="fr-accordion__btn fr-h4"
        aria-expanded="false"
        aria-controls="accordion-customization"
      >
        Créer un objet personnalisé
      </button>
    </h3>

    <div
      id="accordion-customization"
      class="fr-collapse"
    >
      <div
        v-for="(item, index) in fields"
        :key="item.key"
        class="fr-grid-row"
      >
        <div class="fr-col-6">
          <VeeInput
            :name="`customs[${index}].name`"
            label="Intitulé de l’objet d’accompagnement"
            hint="Choisissez un nom court et clair"
            required
          />
        </div>

        <div class="fr-col-6">
          <button
            class="fr-btn fr-btn--sm fr-btn--tertiary-no-outline fr-btn--icon-left fr-icon-add-line"
            type="button"
            @click="remove(index)"
          >
            Supprimer l'objet
          </button>
        </div>
      </div>

      <button
        class="fr-btn fr-btn--sm fr-btn--tertiary-no-outline fr-btn--icon-left fr-icon-add-line"
        type="button"
        @click="push({ id: v4() })"
      >
        Ajouter un autre objet
      </button>
    </div>
  </section>
</template>

<script lang="ts" setup>
  import { v4 } from 'uuid'

  const { fields, push, remove } = useFieldArray('customs')
</script>
