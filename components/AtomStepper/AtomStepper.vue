<template>
  <div class="fr-stepper">
    <component
      :is="markup"
      class="fr-stepper__title"
    >
      {{ steps[currentStep - 1] }}
      <span class="fr-stepper__state">
        Étape {{ currentStep }} sur {{ steps.length }}
      </span>
    </component>
    <div
      class="fr-stepper__steps"
      :data-fr-current-step="currentStep"
      :data-fr-steps="steps.length"
    ></div>
    <p
      v-if="steps[currentStep]"
      class="fr-stepper__details"
    >
      <span class="fr-text--bold">Étape suivante :</span>
      {{ steps[currentStep] }}
    </p>
  </div>
</template>

<script lang="ts" setup>
  withDefaults(
    defineProps<{
      steps: string[]
      currentStep: number
      markup?: string
    }>(),
    { markup: 'h2' }
  )
</script>

<style lang="scss" scoped>
  @import '@gouvfr/dsfr/dist/component/stepper/stepper.min.css';
</style>
