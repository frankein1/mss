<template>
  <AtomLoader
    v-if="pending"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques concerannt les instructions n'ont pas pu être chargées."
  />
  <template v-if="fileInstructions && externalInstructions">
    <StatsList
      :total-count="totalCount"
      :stats="distribution"
      :display-total="false"
      :big-text="true"
    />
    <template
      v-if="fileInstructions.fileInstructions.instructorOrganization.length"
    >
      <hr />
      <p class="fr-text--xs text--muted">
        <span class="fr-text--bold">RÉPARTITION DES INSTRUCTIONS EXTERNES</span>
        <br />
        Pourcentage calculé sur le nombre de dossiers instruits en externe.
      </p>
      <StatsList
        :total-count="totalCount"
        :stats="externalInstructions"
        :display-total="true"
        :big-text="true"
        :not-filled-route="
          routes.file.AppHistory.path({
            notFilled: FilterFileInstructionNotFilled.InstructorOrganization,
            tab: HistoryTab.FileInstructions
          })
        "
      />
    </template>
  </template>
  <p v-else>
    Commencez à créer des instructions de dossier dans les fiches de
    bénéficiaires pour voir apparaître les statistiques de la répartition des
    organismes prescripteurs.
  </p>
</template>

<script lang="ts" setup>
  import { StatFilterInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { SupportColor } from '~/client/colors/support'
  import { StatsListPropType } from '~/types/stat'
  import { routes } from '~/utils/routes'
  import { HistoryTab } from '~/utils/constants/history'
  import { FilterFileInstructionNotFilled } from '~/utils/constants/filters'

  const trpcClient = useTrpcClient()

  const props = defineProps<{
    totalCount: number
    filters: StatFilterInput
  }>()

  const {
    data: fileInstructions,
    pending,
    error
  } = await trpcClient.stat.getHelpRequestInstructionsStats.useQuery(
    props.filters
  )

  const distribution: ComputedRef<StatsListPropType> = computed(() => [
    {
      key: 'external-instructors',
      label: 'Instructions en externe',
      color: SupportColor.helpRequests,
      emphasis: true,
      count:
        fileInstructions.value?.fileInstructions.externalStructure._count || 0
    },
    {
      key: 'internal-instructors',
      label: 'Instructions en interne',
      color: SupportColor.helpRequests,
      emphasis: true,
      count:
        fileInstructions.value?.fileInstructions.internalStructure._count || 0
    }
  ])

  const externalInstructions: ComputedRef<StatsListPropType | undefined> =
    computed(() =>
      fileInstructions.value?.fileInstructions.instructorOrganization.map(
        instructor => {
          return {
            key: instructor.id,
            label: instructor.name,
            color: SupportColor.helpRequests,
            count: instructor._count || 0
          }
        }
      )
    )
</script>
