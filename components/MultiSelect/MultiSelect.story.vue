<template>
  <div class="fr-col-12">
    <h4>Multiselect défaut</h4>
    <MultiSelect
      name="county"
      label="Rechercher un département"
      is-searchable
      :options="allValues"
      :disabled-options="['d07', 'd02', 'd15', 'd03', 'd04']"
    />

    <h4>Multiselect avec bouton suite label</h4>
    <MultiSelect
      name="county"
      label="Rechercher un département"
      is-searchable
      :options="allValues"
      :disabled-options="['d07', 'd02', 'd15', 'd03', 'd04']"
    >
      <template #checkbox-after-label="{ option }">
        <DsfrButton
          :label="parseInt(option.value) % 2 === 0 ? 'Action' : 'Réaction'"
          type="button"
          size="sm"
          :icon="
            parseInt(option.value) % 2 === 0
              ? 'fr-icon-add-line'
              : 'fr-icon-check-line'
          "
        />
      </template>
    </MultiSelect>

    <h4>Multiselect dans modale</h4>
    <AtomModal />
    <DsfrButton
      label="Ouverture modale"
      data-fr-opened="false"
      aria-controls="global-modal"
      @click="
        modal.open(ModalStory, {
          title: 'Modale contenant multiselect',
          options: allValues.splice(0, 10)
        })
      "
    />

    <h4>Multiselect dans des tabs</h4>
    <AtomTabs
      tab-list-name="Onglets"
      :tab-titles="tabTitles"
    >
      <template #tab-content-0>
        <div
          class="fr-container"
          style="min-height: 500px"
        >
          <div class="fr-grid-row fr-grid-row--gutters">
            <div class="fr-col-4">
              <form
                ref="form"
                novalidate
                @submit.prevent="onSubmit"
              >
                <button type="submit">Valider</button>
                <MultiSelect
                  name="county"
                  label="Rechercher un département"
                  is-searchable
                  :options="allValues"
                />
              </form>
            </div>
          </div>
        </div>
      </template>
      <template #tab-content-1>
        <p>Rien</p>
      </template>
    </AtomTabs>
  </div>
</template>

<script setup lang="ts">
  import type { Options } from '~/utils/options'
  import { useForm } from 'vee-validate'
  import ModalStory from '~/components/MultiSelect/modal.story.vue'

  const form = useTemplateRef('form')
  const modal = useModal()

  const tabTitles = [
    {
      tabId: 'Onglet 1',
      panelId: 'tab-content-0',
      title: 'Onglet 1',
      icon: 'fr-icon-draft-fill'
    },
    {
      tabId: 'Onglet 2',
      panelId: 'tab-content-1',
      title: 'Onglet 2',
      icon: 'fr-icon-questionnaire-fill'
    }
  ]

  const allValues: Options = [
    { value: 'd01', label: 'Ain' },
    { value: 'd02', label: 'Aisne' },
    { value: 'd03', label: 'Allier' },
    { value: 'd04', label: 'Alpes-de-Haute-Provence' },
    { value: 'd05', label: 'Hautes-Alpes' },
    { value: 'd06', label: 'Alpes-Maritimes' },
    { value: 'd07', label: 'Ardèche' },
    { value: 'd08', label: 'Ardennes' },
    { value: 'd09', label: 'Ariège' },
    { value: 'd10', label: 'Aube' },
    { value: 'd11', label: 'Aude' },
    { value: 'd12', label: 'Aveyron' },
    { value: 'd13', label: 'Bouches-du-Rhône' },
    { value: 'd14', label: 'Calvados' },
    { value: 'd15', label: 'Cantal' },
    { value: 'd16', label: 'Charente' },
    { value: 'd17', label: 'Charente-Maritime' },
    { value: 'd18', label: 'Cher' },
    { value: 'd19', label: 'Corrèze' },
    { value: 'd21', label: "Côte-d'Or" },
    { value: 'd22', label: "Côtes-d'Armor" },
    { value: 'd23', label: 'Creuse' },
    { value: 'd24', label: 'Dordogne' },
    { value: 'd25', label: 'Doubs' },
    { value: 'd26', label: 'Drôme' },
    { value: 'd27', label: 'Eure' },
    { value: 'd28', label: 'Eure-et-Loir' },
    { value: 'd29', label: 'Finistère' },
    { value: 'd30', label: 'Gard' },
    { value: 'd31', label: 'Haute-Garonne' },
    { value: 'd32', label: 'Gers' },
    { value: 'd33', label: 'Gironde' },
    { value: 'd34', label: 'Hérault' },
    { value: 'd35', label: 'Ille-et-Vilaine' },
    { value: 'd36', label: 'Indre' },
    { value: 'd37', label: 'Indre-et-Loire' },
    { value: 'd38', label: 'Isère' },
    { value: 'd39', label: 'Jura' },
    { value: 'd40', label: 'Landes' },
    { value: 'd41', label: 'Loir-et-Cher' },
    { value: 'd42', label: 'Loire' },
    { value: 'd43', label: 'Haute-Loire' },
    { value: 'd44', label: 'Loire-Atlantique' },
    { value: 'd45', label: 'Loiret' },
    { value: 'd46', label: 'Lot' },
    { value: 'd47', label: 'Lot-et-Garonne' },
    { value: 'd48', label: 'Lozère' },
    { value: 'd49', label: 'Maine-et-Loire' },
    { value: 'd50', label: 'Manche' },
    { value: 'd51', label: 'Marne' },
    { value: 'd52', label: 'Haute-Marne' },
    { value: 'd53', label: 'Mayenne' },
    { value: 'd54', label: 'Meurthe-et-Moselle' },
    { value: 'd55', label: 'Meuse' },
    { value: 'd56', label: 'Morbihan' },
    { value: 'd57', label: 'Moselle' },
    { value: 'd58', label: 'Nièvre' },
    { value: 'd59', label: 'Nord' },
    { value: 'd60', label: 'Oise' },
    { value: 'd61', label: 'Orne' },
    { value: 'd62', label: 'Pas-de-Calais' },
    { value: 'd63', label: 'Puy-de-Dôme' },
    { value: 'd64', label: 'Pyrénées-Atlantiques' },
    { value: 'd65', label: 'Hautes-Pyrénées' },
    { value: 'd66', label: 'Pyrénées-Orientales' },
    { value: 'd67', label: 'Bas-Rhin' },
    { value: 'd68', label: 'Haut-Rhin' },
    { value: 'd69', label: 'Rhône' },
    { value: 'd70', label: 'Haute-Saône' },
    { value: 'd71', label: 'Saône-et-Loire' },
    { value: 'd72', label: 'Sarthe' },
    { value: 'd73', label: 'Savoie' },
    { value: 'd74', label: 'Haute-Savoie' },
    { value: 'd75', label: 'Paris' },
    { value: 'd76', label: 'Seine-Maritime' },
    { value: 'd77', label: 'Seine-et-Marne' },
    { value: 'd78', label: 'Yvelines' },
    { value: 'd79', label: 'Deux-Sèvres' },
    { value: 'd80', label: 'Somme' },
    { value: 'd81', label: 'Tarn' },
    { value: 'd82', label: 'Tarn-et-Garonne' },
    { value: 'd83', label: 'Var' },
    { value: 'd84', label: 'Vaucluse' },
    { value: 'd85', label: 'Vendée' },
    { value: 'd86', label: 'Vienne' },
    { value: 'd87', label: 'Haute-Vienne' },
    { value: 'd88', label: 'Vosges' },
    { value: 'd89', label: 'Yonne' },
    { value: 'd90', label: 'Territoire de Belfort' },
    { value: 'd91', label: 'Essonne' },
    { value: 'd92', label: 'Hauts-de-Seine' },
    { value: 'd93', label: 'Seine-Saint-Denis' },
    { value: 'd94', label: 'Val-de-Marne' },
    { value: 'd95', label: "Val-d'Oise" },
    { value: 'd971', label: 'Guadeloupe' },
    { value: 'd972', label: 'Martinique' },
    { value: 'd973', label: 'Guyane' },
    { value: 'd974', label: 'La Réunion' },
    { value: 'd976', label: 'Mayotte' }
  ]

  const { handleSubmit } = useForm<{ county: string[] }>({
    validationSchema: null,
    initialValues: {
      county: ['d26', 'd93']
    }
  })

  const { onSubmit } = useCatchFormErrors(handleSubmit, values => {
    console.log(values)
  })
</script>
