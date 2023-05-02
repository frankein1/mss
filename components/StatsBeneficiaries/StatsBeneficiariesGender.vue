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
  import { Gender } from '@prisma/client'
  import { AlertType } from '~~/utils/constants/alert'
  import { Routes } from '~/utils/routing/routes'
  import { StatFilterInput } from '~/server/schema/filter.schema'
  import { getStatColor } from '~/utils/constants/colors/stats'
  import { getStatLabel } from '~/client/options/stat'
  import { genderLabel } from '~/client/options/gender'
  import { StatsPiePropType } from '~/types/stat'

  const GenderColor = {
    [Gender.Female]: '#FF8886',
    [Gender.Male]: '#8D81E4',
    [Gender.Other]: '#FFCD56'
  }

  const trpcClient = useTrpcClient()

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const {
    data: genderCounts,
    pending,
    error
  } = useAsyncData<Array<{ gender: Gender | null; _count: number }>>(
    () => trpcClient.stat.getGenderStats.query(props.filters),
    {
      default: () => [],
      watch: [props.filters]
    }
  )

  const genderStats = computed(
    () =>
      (genderCounts.value?.map(({ _count, gender }) => ({
        key: gender,
        label: getStatLabel(genderLabel, gender),
        color: getStatColor(GenderColor, gender),
        count: _count
      })) || []) as StatsPiePropType
  )
</script>
