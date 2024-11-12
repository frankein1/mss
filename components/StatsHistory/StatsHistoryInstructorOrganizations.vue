<template>
  <AtomLoader
    v-if="pending"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques de la répartion des organismes instructeurs n'ont pas pu être chargées."
  />
  <p>
    Pourcentage calculé sur le nombre total de dossiers instruits en externe
  </p>
  <StatsList
    v-if="instructorOrganizationStats.length"
    :total-count="totalCount"
    :stats="instructorOrganizationStats"
    :not-filled-route="
      routes.file.AppHistory.path({
        notFilled: FilterFileInstructionNotFilled.InstructorOrganization,
        tab: HistoryTab.FileInstructions
      })
    "
  />
  <p v-else>
    Commencez à créer des instructions de dossier instruites en externe dans les
    fiches de bénéficiaires pour voir apparaître les statistiques de la
    répartition des organismes instructeurs.
  </p>
</template>

<script lang="ts" setup>
  import { StatFilterInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { SupportColor } from '~/client/colors/support'
  import { FilterFileInstructionNotFilled } from '~/utils/constants/filters'
  import { HistoryTab } from '~/utils/constants/history'
  import { routes } from '~/utils/routes'

  const props = defineProps<{
    totalCount: number
    filters: StatFilterInput
  }>()

  const {
    data: instructorOrganizationCounts,
    pending,
    error
  } = await useTrpcClient().stat.getInstructorOrganizationStats.useQuery(
    props.filters
  )

  const instructorOrganizationStats = computed(
    () =>
      instructorOrganizationCounts.value?.map(
        ({ _count, instructorOrganization, instructorOrganizationId }) => ({
          key: instructorOrganizationId,
          label: instructorOrganization,
          color: SupportColor.helpRequests,
          count: _count
        })
      ) || []
  )
</script>
