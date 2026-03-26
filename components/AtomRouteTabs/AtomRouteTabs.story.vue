<template>
  <div>
    <h3>AtomRouteTabs</h3>
    <p>
      Composant d'onglets contrôlé par v-model, destiné à la navigation par
      routes Nuxt.
    </p>

    <div class="fr-container--fluid">
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-12">
          <AtomRouteTabs
            v-model="activeTab"
            tab-list-name="Exemple de navigation par onglets"
            :tab-titles="tabTitles"
            :heading-level="2"
          >
            <div class="fr-p-4w">
              <p>
                Contenu de l'onglet actif :
                <strong>{{ tabTitles[activeTab]?.title }}</strong>
              </p>
              <p>Index : {{ activeTab }}</p>
            </div>
          </AtomRouteTabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const activeTab = ref(0)

  const tabTitles = [
    {
      tabId: 'Tab1',
      panelId: panelId('Tab1'),
      title: 'Premier onglet',
      icon: 'fr-icon-user-line'
    },
    {
      tabId: 'Tab2',
      panelId: panelId('Tab2'),
      title: 'Deuxième onglet',
      icon: 'fr-icon-draft-line'
    },
    {
      tabId: 'Tab3',
      panelId: panelId('Tab3'),
      title: 'Troisième onglet',
      icon: 'fr-icon-calendar-line'
    }
  ]
</script>
