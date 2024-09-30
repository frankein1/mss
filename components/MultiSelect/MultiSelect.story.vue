<template>
  <div class="fr-col-12">
    <MultiSelect
      name="Séléctionner des départements"
      legend="départements"
      :options="allValues"
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
        <div class="fr-container">
          <div class="fr-grid-row fr-grid-row--gutters">
            <div class="fr-col-4">
              <MultiSelect
                name="Séléctionner des départements"
                legend="départements"
                :options="allValues"
                @change-value="changeFilter($event)"
              />
            </div>
            <div class="fr-col-8">
              <MultiSelect
                name="Recherche 3"
                legend="départements"
                :options="allValues"
              />
            </div>
          </div>
        </div>
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

  const allValues: Options = [
    { value: '01', label: 'Ain' },
    { value: '02', label: 'Aisne' },
    { value: '03', label: 'Allier' },
    { value: '04', label: 'Alpes-de-Haute-Provence' },
    { value: '05', label: 'Hautes-Alpes' },
    { value: '06', label: 'Alpes-Maritimes' },
    { value: '07', label: 'Ardèche' },
    { value: '08', label: 'Ardennes' },
    { value: '09', label: 'Ariège' },
    { value: '10', label: 'Aube' },
    { value: '11', label: 'Aude' },
    { value: '12', label: 'Aveyron' },
    { value: '13', label: 'Bouches-du-Rhône' },
    { value: '14', label: 'Calvados' },
    { value: '15', label: 'Cantal' },
    { value: '16', label: 'Charente' },
    { value: '17', label: 'Charente-Maritime' },
    { value: '18', label: 'Cher' },
    { value: '19', label: 'Corrèze' },
    { value: '21', label: "Côte-d'Or" }
  ]

  const changeFilter = (event: any) => {
    console.log(event)
  }
</script>
