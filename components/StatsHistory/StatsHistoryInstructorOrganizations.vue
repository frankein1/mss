<template>
  <div class="main-container fr-p-2w">
    <AtomLoader
      v-if="pending"
      class="fr-mx-auto"
    />
    <AtomAlert
      v-else-if="error"
      :alert-type="AlertType.Error"
      message="Les statistiques de la répartion des organismes instructeurs n'ont pas pu être chargées."
    />
    <template v-else-if="instructorOrganizationStats">
      <h2 class="fr-h5">Organismes instructeurs</h2>
      <p>
        Pourcentage calculé sur le nombre total de dossiers instruits en externe
      </p>
      <StatsList
        v-if="instructorOrganizationStats.length"
        :total-count="totalCount"
        :stats="instructorOrganizationStats"
      />
      <p v-else>
        Commencez à créer des instructions de dossier instruites en externe dans
        les fiches de bénéficiaires pour voir apparaître les statistiques de la
        répartition des organismes instructeurs.
      </p>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { StatFilterInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { SupportColor } from '~/client/colors/support'

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
