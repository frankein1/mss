<template>
  <div>
    <h3>Select avec groupes d'options - Vee Select Option Group</h3>

    <form
      ref="form"
      novalidate
      class="fr-container--fluid"
    >
      <h4>Sélection avec groupes</h4>
      <div id="vee-select-option-group-default">
        <VeeSelectOptionGroup
          label="Classe"
          name="schoolClass"
          :groups="schoolClassGroups"
        />
      </div>

      <h4>Champ requis</h4>
      <div id="vee-select-option-group-required">
        <VeeSelectOptionGroup
          label="Classe"
          name="schoolClassRequired"
          required
          :groups="schoolClassGroups"
        />
      </div>

      <h4>Champ désactivé</h4>
      <div id="vee-select-option-group-disabled">
        <VeeSelectOptionGroup
          label="Classe"
          name="schoolClassDisabled"
          disabled
          :groups="schoolClassGroups"
        />
      </div>
    </form>

    <div>Valeurs sélectionnées : {{ values }}</div>
  </div>
</template>

<script setup lang="ts">
  import VeeSelectOptionGroup from './VeeSelectOptionGroup.vue'
  import type { OptionGroups } from '~/utils/options'

  const { values } = useForm({
    validationSchema: null
  })

  const schoolClassGroups: OptionGroups = [
    {
      label: 'Maternelle',
      options: [
        { value: 'ToutesPetiteSection', label: 'Toute Petite Section' },
        { value: 'PetiteSection', label: 'Petite Section' },
        { value: 'MoyenneSection', label: 'Moyenne Section' },
        { value: 'GrandeSection', label: 'Grande Section' }
      ]
    },
    {
      label: 'Élémentaire',
      options: [
        { value: 'CP', label: 'CP' },
        { value: 'CE1', label: 'CE1' },
        { value: 'CE2', label: 'CE2' },
        { value: 'CM1', label: 'CM1' },
        { value: 'CM2', label: 'CM2' }
      ]
    },
    {
      label: 'Collège',
      options: [
        { value: 'Sixieme', label: '6ème' },
        { value: 'Cinquieme', label: '5ème' },
        { value: 'Quatrieme', label: '4ème' },
        { value: 'Troisieme', label: '3ème' }
      ]
    }
  ]
</script>
