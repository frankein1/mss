<template>
  <PageContainer no-max-width>
    <AtomBreadcrumb :links="breadcrumbs.file.AppHistory()" />
    <PageTitle :title="title" />
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12">
        <AtomRouteTabs
          :model-value="activeTab"
          tab-list-name="Accompagnements"
          :tab-titles="tabTitles"
          :heading-level="2"
          @update:model-value="onTabChange"
        >
          <NuxtPage />
        </AtomRouteTabs>
      </div>
    </div>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { routes } from '~/utils/routes'
  import { breadcrumbs } from '~/utils/breadcrumbs'

  const title = routes.file.AppHistory.title

  useHead({ title })

  const route = useRoute()

  const tabTitles = [
    {
      tabId: 'Followups',
      panelId: panelId('Followups'),
      title: 'Entretiens',
      icon: 'fr-icon-draft-line',
      to: routes.file.AppHistoryFollowups.path()
    },
    {
      tabId: 'FileInstructions',
      panelId: panelId('FileInstructions'),
      title: "Dossiers d'instruction",
      icon: 'fr-icon-questionnaire-line',
      to: routes.file.AppHistoryFileInstructions.path()
    }
  ]

  const activeTab = computed(() =>
    Math.max(
      0,
      tabTitles.findIndex(tab => route.path === tab.to)
    )
  )

  async function onTabChange(index: number) {
    if (!tabTitles[index]) {
      return
    }
    await navigateTo(tabTitles[index].to ?? tabTitles?.[0]?.to)
    await nextTick()
    document.getElementById(tabTitles[index].tabId)?.focus()
  }
</script>

<style scoped>
  #followups-tab {
    color: var(--color-followup);
  }

  #followups-tab[aria-selected='true'] {
    border-color: var(--color-followup);
  }

  #help-requests-tab {
    color: var(--color-help-request);
  }

  #help-requests-tab[aria-selected='true'] {
    border-color: var(--color-help-request);
  }
</style>
