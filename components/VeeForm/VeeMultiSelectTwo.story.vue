<template>
  <div class="fr-col-12">
    <h4>Multiselect</h4>
    <VeeMultiSelectTwo
      label="test"
      name="test"
      :dropdown="true"
      :options="options"
    />
  </div>

  <div class="fr-col-12">
    <h4>Multiselect dans des tabs</h4>
    <AtomTabs tab-list-name="Onglets">
      <AtomTab
        tab-id="Onglet 1"
        title="Onglet 1"
        selected
        icon="fr-icon-draft-fill"
      >
        <VeeMultiSelectThree :options="options" />
        <VeeMultiSelectTwo
          label="test"
          name="test"
          :dropdown="true"
          :options="options"
        />
      </AtomTab>
      <AtomTab
        tab-id="Onglet 2"
        title="Onglet 2"
        icon="fr-icon-questionnaire-fill"
      >
        <p>Rien</p>
      </AtomTab>
    </AtomTabs>
  </div>
</template>

<script setup lang="ts">
  import type { Options } from '~/utils/options'

  const options: Options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
    { value: 'option4', label: 'Option 4' },
    { value: 'option5', label: 'Option 5' },
    { value: 'option6', label: 'Option 6' },
    { value: 'option7', label: 'Option 7' },
    { value: 'option8', label: 'Option 8' },
    { value: 'option9', label: 'Option 9' },
    { value: 'option10', label: 'Option 10' },
    { value: 'option11', label: 'Option 11' },
    { value: 'option12', label: 'Option 12' },
    { value: 'option13', label: 'Option 13' },
    { value: 'option14', label: 'Option 14' },
    { value: 'option15', label: 'Option 15' },
    { value: 'option16', label: 'Option 16' },
    { value: 'option17', label: 'Option 17' },
    { value: 'option18', label: 'Option 18' },
    { value: 'option19', label: 'Option 19' },
    { value: 'option20', label: 'Option 20' },
    { value: 'option21', label: 'Option 21' },
    { value: 'option22', label: 'Option 22' }
  ]
</script>
