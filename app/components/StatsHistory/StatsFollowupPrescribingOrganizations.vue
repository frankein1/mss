<template>
  <AtomLoader
    v-if="status === 'pending'"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques de la répartion des organismes prescripteurs n'ont pas pu être chargées."
  />
  <template
    v-if="
      followupWithInstruction &&
      followupWithInstruction.length &&
      prescribingOrganizationStats &&
      prescribingOrganizationStats.length
    "
  >
    <StatsList
      :total-count="totalCount"
      :stats="followupWithInstruction"
      :display-total="false"
      stats-bar
    />

    <hr />
    <p class="fr-text--xs text--muted">
      <span
        :id="headingId"
        class="fr-text--bold text--uppercase"
        >Répartition des organismes prescripteurs</span
      >
      <br />
      Pourcentage calculé sur le nombre total de synthèses d'entretien.
    </p>
    <StatsList
      :labelledby="headingId"
      :total-count="totalCount"
      :stats="prescribingOrganizationStats"
      :not-filled-route="
        routes.file.AppHistoryFollowups.path({
          notFilled: FilterFollowupNotFilled.PrescribingOrganization
        })
      "
    />
  </template>
  <p v-else>
    Commencez à créer des synthèses d'entretien dans les fiches de bénéficiaires
    pour voir apparaître les statistiques de la répartition des organismes
    prescripteurs.
  </p>
</template>

<script lang="ts" setup>
  import type { StatFilterInput } from '~~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { SupportColor } from '~~/client/colors/support'
  import { FilterFollowupNotFilled } from '~/utils/constants/filters'
  import { routes } from '~/utils/routes'

  const props = defineProps<{
    totalCount: number
    filters: StatFilterInput
  }>()

  const headingId = useId()

  const trpcClient = useTrpcClient()
  const { data, error, status } =
    await trpcClient.stat.getFollowupPrescribingOrganizationStats.useQuery(
      toRef(() => props.filters)
    )

  const prescribingOrganizationStats = computed(
    () =>
      data.value?.map(
        ({ _count, prescribingOrganization, prescribingOrganizationId }) => ({
          key: prescribingOrganizationId,
          label: prescribingOrganization,
          color: SupportColor.followups,
          count: _count
        })
      ) || []
  )
  const followupWithInstruction = computed(() => {
    const noOrganization = data?.value?.find(
      followup => followup.prescribingOrganizationId == 'null'
    )
    const noOrganizationCount = noOrganization?._count || 0
    return [
      {
        key: 'followupWithInstruction',
        label: 'Entretiens avec prescripteur renseigné',
        color: SupportColor.followups,
        emphasis: true,
        count: toRef(() => props.totalCount).value - noOrganizationCount
      }
    ]
  })
</script>
