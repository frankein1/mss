<template>
  <AtomLoader
    v-if="status === 'pending'"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques concerannt les instructions n'ont pas pu être chargées."
  />
  <template
    v-if="
      distribution &&
      distribution.length &&
      externalInstructions &&
      externalInstructions.length
    "
  >
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
  import type { StatFilterInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { SupportColor } from '~/client/colors/support'
  import { routes } from '~/utils/routes'
  import { HistoryTab } from '~/utils/constants/history'
  import { FilterFileInstructionNotFilled } from '~/utils/constants/filters'

  const props = defineProps<{
    totalCount: number
    filters: StatFilterInput
  }>()

  const trpcClient = useTrpcClient()

  const { data, error, status } =
    await trpcClient.stat.getHelpRequestInstructionsStats.useQuery(
      toRef(() => props.filters)
    )

  const distribution = computed(() => [
    {
      key: 'external-instructors',
      label: 'Instructions en externe',
      color: SupportColor.helpRequests,
      emphasis: true,
      count: data.value?.fileInstructions.externalStructure._count || 0
    },
    {
      key: 'internal-instructors',
      label: 'Instructions en interne',
      color: SupportColor.helpRequests,
      emphasis: true,
      count: data.value?.fileInstructions.internalStructure._count || 0
    }
  ])

  const externalInstructions = computed(
    () =>
      data.value?.fileInstructions.instructorOrganization.map(instructor => {
        return {
          key: instructor.id,
          label: instructor.name,
          color: SupportColor.helpRequests,
          count: instructor._count || 0
        }
      }) || []
  )

  const externalTotalCount = computed(() => {
    let total = 0
    data.value?.fileInstructions.instructorOrganization.forEach(item => {
      total = total + item._count
    })
    return total
  })
</script>
