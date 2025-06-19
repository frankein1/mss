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
  <template v-if="followupWithInstruction && prescribingOrganizationStats">
    <StatsList
      :total-count="totalCount"
      :stats="followupWithInstruction"
      :display-total="false"
      stats-bar
    />

    <hr />
    <p class="fr-text--xs text--muted">
      <span class="fr-text--bold"
        >RÉPARTITION DES ORGANISMES PRESCRIPTEURS</span
      >
      <br />
      Pourcentage calculé sur le nombre total de synthèses d'entretien.
    </p>
    <StatsList
      :total-count="totalCount"
      :stats="prescribingOrganizationStats"
      :not-filled-route="
        routes.file.AppHistory.path({
          notFilled: FilterFollowupNotFilled.PrescribingOrganization,
          tab: HistoryTab.Followups
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
  import { StatFilterInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { SupportColor } from '~/client/colors/support'
  import { StatsListPropType, StatsPiePropType } from '~/types/stat'
  import { FilterFollowupNotFilled } from '~/utils/constants/filters'
  import { HistoryTab } from '~/utils/constants/history'
  import { routes } from '~/utils/routes'

  const props = defineProps<{
    totalCount: number
    filters: StatFilterInput
  }>()

  const pending = ref<boolean>(true)
  const error = ref<Error | null>(null)
  const prescribingOrganizationStats = ref<StatsPiePropType | null>(null)
  const followupWithInstruction = ref<StatsListPropType | null>(null)

  try {
    const trpc = useTrpcClient()
    const data = await trpc.stat.getFollowupPrescribingOrganizationStats.mutate(
      props.filters
    )
    if (data == null) {
      throw new Error('no data')
    }
    prescribingOrganizationStats.value =
      data.map(
        ({ _count, prescribingOrganization, prescribingOrganizationId }) => ({
          key: prescribingOrganizationId,
          label: prescribingOrganization,
          color: SupportColor.followups,
          count: _count
        })
      ) || []
    const noOrganization = data?.find(
      followup => followup.prescribingOrganizationId == 'null'
    )
    const noOrganizationCount = noOrganization?._count || 0
    followupWithInstruction.value = [
      {
        key: 'followupWithInstruction',
        label: 'Entretiens avec prescripteur renseigné',
        color: SupportColor.followups,
        emphasis: true,
        count: props.totalCount - noOrganizationCount
      }
    ]
  } catch (err: unknown) {
    console.error(err)
    error.value = err as Error
  } finally {
    pending.value = false
  }

  // const followupWithInstruction: ComputedRef<StatsListPropType> = computed(
  //   () => {
  //     const noOrganization = data?.find(
  //       followup => followup.prescribingOrganizationId == 'null'
  //     )
  //     const noOrganizationCount = noOrganization?._count || 0
  //     return [
  //       {
  //         key: 'followupWithInstruction',
  //         label: 'Entretiens avec prescripteur renseigné',
  //         color: SupportColor.followups,
  //         emphasis: true,
  //         count: props.totalCount - noOrganizationCount
  //       }
  //     ]
  //   }
  // )
</script>
