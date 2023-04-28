<template>
  <div class="main-container fr-p-2w">
    <AtomLoader
      v-if="pending"
      class="fr-mx-auto"
    />
    <AtomAlert
      v-else-if="error"
      :alert-type="AlertType.Error"
      message="Les statistiques de la répartion des genres n'ont pas pu être chargées."
    />
    <template v-else-if="genderStats">
      <h2 class="fr-h5">Genres</h2>
      <StatsPie
        v-if="genderStats.length"
        pie-label="Répartion des genres"
        :stats="genderStats"
        :total-count="beneficiaryCount"
      />
      <p v-else>
        Commencez à
        <NuxtLink
          :to="Routes.BeneficiariesAdd"
          target="_self"
          >créer des fiches de bénéficiaires</NuxtLink
        >
        pour voir apparaître les statistiques de la répartition des genres.
      </p>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { AlertType } from '~~/utils/constants/alert'
  import { getGenderWording, getGenderColor } from '~/client/options/gender'
  import { Routes } from '~/utils/routing/routes'
  import { StatFilterInput } from '~/server/schema/filter.schema'

  const trpcClient = useTrpcClient()

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const {
    data: genderCounts,
    pending,
    error
  } = useAsyncData(() => trpcClient.stat.getGenderStats.query(props.filters), {
    default: () => [],
    watch: [props.filters]
  })

  const genderStats = computed(() => {
    return (
      genderCounts.value?.map(({ _count, gender }) => ({
        key: gender,
        label: getGenderWording(gender),
        color: getGenderColor(gender),
        count: parseInt(_count)
      })) || []
    )
  })
</script>
