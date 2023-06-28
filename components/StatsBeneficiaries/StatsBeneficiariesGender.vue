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
          :to="RoutePath.BeneficiariesAdd()"
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
  import { RoutePath } from '~/utils/routing'
  import { StatFilterInput } from '~/server/schema'
  import { getStatColor } from '~/client/colors/stats'
  import { getStatLabel } from '~/client/options/stat'
  import { beneficiaryGenderLabels } from '~/client/options/beneficiary'
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
  } = await trpcClient.stat.getGenderStats.useQuery(props.filters, {
    default: () => [],
    transform: v => v // FIXME: Nuxt can't type array picks too. You can use the transform option for now to get proper types - https://github.com/wobsoriano/trpc-nuxt/issues/22#issuecomment-1270863820
  })

  const genderStats = computed(
    () =>
      (genderCounts.value?.map(({ _count, gender }) => ({
        key: gender,
        label: getStatLabel(beneficiaryGenderLabels, gender),
        color: getStatColor(GenderColor, gender),
        count: _count
      })) || []) as StatsPiePropType
  )
</script>
