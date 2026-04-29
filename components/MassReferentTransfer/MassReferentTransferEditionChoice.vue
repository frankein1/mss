<template>
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
          type="radio"
          name="familyfile-referent-choice"
          :checked="false"
          disabled
        />
        <label
          class="fr-label"
          for="radio-delete"
        >
          Retirer un agent (fonctionnalité à venir)
        </label>
      </div>
    </div>
    <div class="fr-fieldset__element fr-fieldset__element--inline">
      <div class="fr-radio-group">
        <input
          id="radio-add"
          type="radio"
          name="familyfile-referent-choice"
          checked
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
    @next="emit('next')"
  />
</template>

<script setup lang="ts">
  const emit = defineEmits<{
    next: []
  }>()
</script>
