<template>
  <PageContainer>
    <PageTitle :title="title" />

    <AtomRouteTabs
      :model-value="activeTab"
      tab-list-name="Configuration de mon compte"
      :tab-titles="tabTitles"
      :heading-level="2"
      @update:model-value="onTabChange"
    >
      <NuxtPage :key="route.path" />
    </AtomRouteTabs>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { routes } from '~/utils/routes'

  const title = routes.decisionMaker.AppDecisionMakerConfiguration.title
  useHead({ title })

  const route = useRoute()

  const tabTitles = [
    {
      tabId: 'InfosCompte',
      panelId: panelId('InfosCompte'),
      title: routes.decisionMaker.AppDecisionMakerConfigurationAccount.title,
      icon: 'fr-icon-account-line',
      to: routes.decisionMaker.AppDecisionMakerConfigurationAccount.path()
    },
    {
      tabId: 'StructuresAssociees',
      panelId: panelId('StructuresAssociees'),
      title: routes.decisionMaker.AppDecisionMakerConfigurationStructures.title,
      icon: 'fr-icon-building-line',
      to: routes.decisionMaker.AppDecisionMakerConfigurationStructures.path()
    }
  ]

  const activeTab = computed(() =>
    Math.max(
      0,
      tabTitles.findIndex(tab => route.path === tab.to)
    )
  )

  async function onTabChange(index: number) {
    const tab = tabTitles[index]
    if (!tab) {
      return
    }
    await navigateTo(tab.to)
    await nextTick()
    document.getElementById(tab.tabId)?.focus()
  }
</script>
