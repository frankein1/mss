<template>
  <PageContainer v-if="isTabRoute">
    <AtomBreadcrumb :links="breadcrumbs.structure.AppStructure()" />
    <PageTitle :title="title" />
    <AtomRouteTabs
      :model-value="activeTab"
      class="structure-tabs"
      tab-list-name="Configuration de la structure"
      :tab-titles="tabTitles"
      :heading-level="2"
      @update:model-value="onTabChange"
    >
      <NuxtPage />
    </AtomRouteTabs>
  </PageContainer>
  <NuxtPage v-else />
</template>

<script lang="ts" setup>
  import { routes } from '~/utils/routes'
  import { breadcrumbs } from '~/utils/breadcrumbs'

  const title = routes.structure.AppStructure.title
  useHead({ title })

  const route = useRoute()
  const { application } = usePermissions()

  const tabTitles = computed(() => {
    const tabs = [] as Array<{
      tabId: string
      panelId: string
      title: string
      icon: string
      to: string
    }>
    if (application.value.module.users) {
      tabs.push({
        tabId: 'Utilisateurs',
        panelId: panelId('Utilisateurs'),
        title: 'Utilisateurs',
        icon: 'fr-icon-group-line',
        to: routes.structure.AppStructureUsers.path()
      })
    }
    tabs.push(
      {
        tabId: 'Infos structure',
        panelId: panelId('Infos structure'),
        title: 'Infos structure',
        icon: 'fr-icon-home-4-line',
        to: routes.structure.AppStructureInfo.path()
      },
      {
        tabId: 'Objets d’accompagnement',
        panelId: panelId('Objets d’accompagnement'),
        title: 'Objets d’accompagnement',
        icon: 'fr-icon-checkbox-circle-line',
        to: routes.structure.AppStructureCustomObjects.path()
      }
    )
    return tabs
  })

  const isTabRoute = computed(() =>
    tabTitles.value.some(tab => route.path === tab.to)
  )

  const activeTab = computed(() =>
    Math.max(
      0,
      tabTitles.value.findIndex(tab => route.path === tab.to)
    )
  )

  async function onTabChange(index: number) {
    const tab = tabTitles.value[index]
    if (!tab) {
      return
    }
    await navigateTo(tab.to)
    await nextTick()
    document.getElementById(tab.tabId)?.focus()
  }
</script>

<style lang="scss" scoped>
  :deep(.fr-tabs__panel) {
    padding-top: 2rem !important;
  }
</style>
