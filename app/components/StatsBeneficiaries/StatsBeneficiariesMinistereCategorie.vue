<template>
  <AtomLoader
    v-if="status === 'pending'"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques de la répartion des catégories n'ont pas pu être chargées."
  />
  <template
    v-else-if="ministereCategorieStats && ministereCategorieStats.length"
  >
    <StatsList
      :total-count="beneficiaryCount"
      :stats="ministereCategorieStats"
      stats-bar
      :not-filled-route="
        routes.beneficiary.AppBeneficiaries.path({
          notFilled: FilterBeneficiaryNotFilled.BeneficiaryMinistereCategorie
        })
      "
    />
  </template>
  <p v-else>
    Commencez à
    <NuxtLink :to="routes.beneficiary.AppBeneficiariesAdd.path()"
      >créer des fiches de bénéficiaires</NuxtLink
    >
    pour voir apparaître les statistiques de la répartition des catégories.
  </p>
</template>

<script setup lang="ts">
  import { AlertType } from '~/utils/constants/alert'
  import { routes } from '~/utils/routes'
  import type { StatFilterInput } from '~~/server/schema'
  import { getStatLabel, ministereCategorieKeys } from '~~/client/options'
  import { FilterBeneficiaryNotFilled } from '~/utils/constants/filters'

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const trpcClient = useTrpcClient()

  const { data, error, status } =
    await trpcClient.stat.getMinistereCategorie.useQuery(
      toRef(() => props.filters)
    )
  const ministereCategorieStats = computed(
    () =>
      data.value?.map(({ _count, ministereCategorie }) => ({
        key: ministereCategorie || 'null',
        label: getStatLabel(ministereCategorieKeys.byKey, ministereCategorie),
        count: _count
      })) || []
  )
</script>
