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
      helpRequestWithPrescription &&
      helpRequestWithPrescription.length &&
      prescribingOrganizationStats &&
      prescribingOrganizationStats.length
    "
  >
    <StatsList
      :total-count="totalCount"
      :stats="helpRequestWithPrescription"
      :display-total="false"
      :big-text="true"
      stats-bar
    />
    <hr />
    <p class="fr-text--xs text--muted">
      <span class="fr-text--bold"
        >RÉPARTITION DES ORGANISMES PRESCRIPTEURS</span
      >
      <br />
      Pourcentage calculé sur le nombre total des instructions de dossiers.
    </p>
    <StatsList
      :total-count="totalCount"
      :stats="prescribingOrganizationStats"
      :not-filled-route="
        routes.file.AppHistoryFileInstructions.path({
          notFilled: FilterFileInstructionNotFilled.PrescribingOrganization
        })
      "
    />
  </template>
  <p v-else>
    Commencez à créer des instructions de dossier dans les fiches de
    bénéficiaires pour voir apparaître les statistiques de la répartition des
    organismes prescripteurs.
  </p>
</template>

<script lang="ts" setup>
  import type { StatFilterInput } from '~~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { SupportColor } from '~~/client/colors/support'
  import { FilterFileInstructionNotFilled } from '~/utils/constants/filters'
  import { routes } from '~/utils/routes'

  const props = defineProps<{
    totalCount: number
    filters: StatFilterInput
  }>()

  const trpcClient = useTrpcClient()
  const { data, error, status } =
    await trpcClient.stat.getHelpRequestPrescribingOrganizationStats.useQuery(
      toRef(() => props.filters)
    )

  const prescribingOrganizationStats = computed(
    () =>
      data.value?.map(
        ({ _count, prescribingOrganization, prescribingOrganizationId }) => ({
          key: prescribingOrganizationId,
          label: prescribingOrganization,
          color: SupportColor.helpRequests,
          count: _count
        })
      ) || []
  )

  const helpRequestWithPrescription = computed(() => {
    const noOrganization = data.value?.find(
      followup => followup.prescribingOrganizationId == 'null'
    )
    const noOrganizationCount = noOrganization?._count || 0
    return [
      {
        key: 'followupWithInstruction',
        label: "Dossiers d'instruction avec prescripteur renseigné",
        color: SupportColor.helpRequests,
        emphasis: true,
        count: props.totalCount - noOrganizationCount
      }
    ]
  })
</script>
