<template>
  <PageContainer no-max-width>
    <PageTitle :title="title" />

    <AtomAlert
      v-if="structuresError"
      :alert-type="AlertType.Error"
      message="La liste des structures n'a pas pu être chargée."
      class="fr-mb-4v"
    />

    <p
      v-else-if="structureOptions.length === 0"
      class="fr-mb-4v"
    >
      Aucune structure ne partage ses statistiques avec vous pour le moment. Une
      structure doit vous inviter depuis son espace de configuration.
    </p>

    <template v-else>
      <StatsDecisionMakerFilters
        v-model:filters="filters"
        :structure-options="structureOptions"
        :subject-options="subjectOptions"
      />

      <AtomRouteTabs
        :model-value="activeTab"
        class="fr-mt-3w"
        tab-list-name="Statistiques partagées"
        :tab-titles="tabTitles"
        :heading-level="2"
        @update:model-value="onTabChange"
      >
        <NuxtPage
          :key="route.path"
          :filters="filters"
          :structure-count="scopedStructureCount"
        />
      </AtomRouteTabs>
    </template>
  </PageContainer>
</template>

<script lang="ts" setup>
  import type { StatFilterInput } from '~~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { routes } from '~/utils/routes'

  const title = routes.decisionMaker.AppDecisionMakerStatistics.title
  useHead({ title })

  const route = useRoute()
  const trpcClient = useTrpcClient()

  /** Les filtres sont portés ici : ils s'appliquent aux trois onglets */
  const filters = ref<StatFilterInput>({})

  const { data: structures, error: structuresError } =
    await trpcClient.decisionMaker.getAuthorizedStructures.useQuery()

  const structureOptions = computed(
    () =>
      structures.value?.map(structure => ({
        label: structure.name,
        value: structure.id
      })) ?? []
  )

  // Objets d'accompagnement de toutes les structures autorisées, dédoublonnés
  // par nom : un même intitulé existe en une ligne par structure.
  const { data: subjectNames } =
    await trpcClient.decisionMaker.getSocialSupportSubjectNames.useQuery()

  const subjectOptions = computed(
    () => subjectNames.value?.map(name => ({ label: name, value: name })) ?? []
  )

  /** Nombre de structures réellement prises en compte par les chiffres */
  const scopedStructureCount = computed(() => {
    const selected = filters.value.structureIds
    return selected && selected.length > 0
      ? selected.length
      : structureOptions.value.length
  })

  const tabTitles = [
    {
      tabId: 'Beneficiaires',
      panelId: panelId('Beneficiaires'),
      title: 'Bénéficiaires',
      icon: 'fr-icon-user-line',
      to: routes.decisionMaker.AppDecisionMakerStatisticsBeneficiaries.path()
    },
    {
      tabId: 'Entretiens',
      panelId: panelId('Entretiens'),
      title: 'Entretiens',
      icon: 'fr-icon-draft-line',
      to: routes.decisionMaker.AppDecisionMakerStatisticsFollowups.path()
    },
    {
      tabId: 'Instructions',
      panelId: panelId('Instructions'),
      title: 'Instructions de dossiers',
      icon: 'fr-icon-questionnaire-line',
      to: routes.decisionMaker.AppDecisionMakerStatisticsFileInstructions.path()
    },
    {
      tabId: 'Ateliers',
      panelId: panelId('Ateliers'),
      title: 'Ateliers',
      icon: 'fr-icon-calendar-line',
      to: routes.decisionMaker.AppDecisionMakerStatisticsWorkshops.path()
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

<style scoped lang="scss">
  /* La hauteur des onglets ne tient pas compte du menu déroulant du
     multi-select ; une hauteur minimale évite qu'il soit tronqué. */
  :deep(.fr-tabs__panel) {
    min-height: 30rem;
  }
</style>
