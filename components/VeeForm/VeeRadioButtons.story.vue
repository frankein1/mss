<template>
  <hr />
  <form
    ref="form"
    novalidate
    @submit.prevent
  >
    <h3>Boutons radio - Vee Input</h3>
    <h4>En ligne (par défaut)</h4>
    <VeeRadioButtons
      :options
      :label
      :name
    />
    <h4>En ligne - small</h4>
    <VeeRadioButtons
      :options
      :label
      :name
      :small="true"
    />
    <h4>En colonne</h4>
    <VeeRadioButtons
      :options
      :inline="false"
      :label
      :name
    />
    <h4>En colonne - small</h4>
    <VeeRadioButtons
      :options
      :inline="false"
      :small="true"
      :label
      :name
    />
    <h4>Rich</h4>
    <VeeRadioButtons
      :options
      :rich="true"
      :label
      :name
    />
    <h4>Picto</h4>
    <VeeRadioButtons
      :options
      :pictos="archivePictos"
      :label
      :name
    />
    <h4>Picto + rich</h4>
    <VeeRadioButtons
      :options
      :rich="true"
      :pictos="archivePictos"
      :label
      :name
    />
    <h4>As tag</h4>
    <VeeRadioButtons
      :options
      :as-tag="true"
      :label
      :name
    />
  </form>
</template>

<script setup lang="ts">
  const form = useTemplateRef('form')
  const options = [
    { value: 'optionOne', label: 'Option 1', disabled: false },
    { value: 'optionTwo', label: 'Option 2', disabled: false },
    { value: 'optionThree', label: 'Option 3', disabled: false },
    { value: 'optionFour', label: 'Option 4', disabled: true }
  ]
  const label = 'Choisiez une option :'
  const name = 'option'
  const archivePictos = {
    optionOne: '/pictograms/supprimer.svg',
    optionTwo: '/pictograms/archive.svg',
    optionThree: '/pictograms/document.svg',
    optionFour: '/pictograms/annuaire.svg'
  }
</script>
