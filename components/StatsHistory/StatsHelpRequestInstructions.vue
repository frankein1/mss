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
  <template v-if="distribution && externalInstructions">
    <StatsList
      :total-count="totalCount"
      :stats="distribution"
      :display-total="false"
      :big-text="true"
    />
    <template v-if="externalTotalCount">
      <hr />
      <p class="fr-text--xs text--muted">
        <span class="fr-text--bold">RÉPARTITION DES INSTRUCTIONS EXTERNES</span>
        <br />
        Pourcentage calculé sur le nombre de dossiers instruits en externe.
      </p>
      <StatsList
        :total-count="externalTotalCount"
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

  const props = defineProps<{
    totalCount: number
    filters: StatFilterInput
  }>()

  const pending = ref<boolean>(true)
  const error = ref<Error | null>(null)
  const distribution = ref<StatsListPropType | null>(null)
  const externalInstructions = ref<StatsListPropType | null>(null)
  const externalTotalCount = ref<number | null>(null)

  try {
    const trpc = useTrpcClient()
    const data = await trpc.stat.getHelpRequestInstructionsStats.mutate(
      props.filters
    )
    if (data == null) {
      throw new Error('no data')
    }
    distribution.value = [
      {
        key: 'external-instructors',
        label: 'Instructions en externe',
        color: SupportColor.helpRequests,
        emphasis: true,
        count: data.fileInstructions.externalStructure._count || 0
      },
      {
        key: 'internal-instructors',
        label: 'Instructions en interne',
        color: SupportColor.helpRequests,
        emphasis: true,
        count: data.fileInstructions.internalStructure._count || 0
      }
    ]

    externalInstructions.value =
      data.fileInstructions.instructorOrganization.map(instructor => {
        return {
          key: instructor.id,
          label: instructor.name,
          color: SupportColor.helpRequests,
          count: instructor._count || 0
        }
      })

    let total = 0
    data.fileInstructions.instructorOrganization.forEach(item => {
      total = total + item._count
    })
    externalTotalCount.value = total
  } catch (err: unknown) {
    console.error(err)
    error.value = err as Error
  } finally {
    pending.value = false
  }
</script>
