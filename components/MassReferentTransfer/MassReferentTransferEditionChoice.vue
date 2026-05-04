<template>
  <form @submit.prevent>
    <fieldset
      id="familyfile-referent-choice"
      class="fr-fieldset"
      aria-labelledby="familyfile-referent-choice-legend familyfile-referent-choice-messages"
    >
      <legend
        id="familyfile-referent-choice-legend"
        class="fr-fieldset__legend--regular fr-fieldset__legend"
      >
        Sélectionner une option <span class="color-red">*</span>
      </legend>
      <div class="fr-fieldset__element fr-fieldset__element--inline">
        <div class="fr-radio-group">
          <input
            id="radio-delete"
            v-model="editionChoice"
            type="radio"
            name="familyfile-referent-choice"
            value="delete"
          />
          <label
            class="fr-label"
            for="radio-delete"
          >
            Retirer un agent
          </label>
        </div>
      </div>
      <div class="fr-fieldset__element fr-fieldset__element--inline">
        <div class="fr-radio-group">
          <input
            id="radio-add"
            v-model="editionChoice"
            type="radio"
            name="familyfile-referent-choice"
            value="add"
          />
          <label
            class="fr-label"
            for="radio-add"
          >
            Ajouter un agent
          </label>
        </div>
      </div>
      <div
        id="familyfile-referent-choice-messages"
        class="fr-messages-group"
        aria-live="polite"
      ></div>
    </fieldset>
    <MassReferentTransferStepButtons
      disable-previous
      :disable-next="editionChoice === null"
      @next="emit('next')"
    />
  </form>
</template>

<script setup lang="ts">
  const emit = defineEmits<{
    next: []
  }>()

  const { editionChoice } = useMassReferentTransferState()
</script>
