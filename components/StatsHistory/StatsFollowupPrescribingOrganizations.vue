<template>
  <AtomLoader
    v-if="pending"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques de la répartion des organismes prescripteurs n'ont pas pu être chargées."
  />
  <p>Pourcentage calculé sur le nombre total de synthèses d'entretien</p>
  <StatsList
    v-if="prescribingOrganizationStats.length"
    :total-count="totalCount"
    :stats="prescribingOrganizationStats"
    :not-filled-route="
      routes.file.AppHistory.path({
        notFilled: FilterFollowupNotFilled.PrescribingOrganization,
        tab: HistoryTab.Followups
      })
    "
  />
  <p v-else>
    Commencez à créer des synthèses d'entretien dans les fiches de bénéficiaires
    pour voir apparaître les statistiques de la répartition des organismes
    prescripteurs.
  </p>
</template>

<script lang="ts" setup>
  import { StatFilterInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { SupportColor } from '~/client/colors/support'
  import { FilterFollowupNotFilled } from '~/utils/constants/filters'
  import { HistoryTab } from '~/utils/constants/history'
  import { routes } from '~/utils/routes'

  const trpcClient = useTrpcClient()

  const props = defineProps<{
    totalCount: number
    filters: StatFilterInput
  }>()

  const {
    data: prescribingOrganizationCounts,
    pending,
    error
  } = await trpcClient.stat.getFollowupPrescribingOrganizationStats.useQuery(
    props.filters
  )

  const prescribingOrganizationStats = computed(
    () =>
      prescribingOrganizationCounts.value?.map(
        ({ _count, prescribingOrganization, prescribingOrganizationId }) => ({
          key: prescribingOrganizationId,
          label: prescribingOrganization,
          color: SupportColor.followups,
          count: _count
        })
      ) || []
  )
</script>
