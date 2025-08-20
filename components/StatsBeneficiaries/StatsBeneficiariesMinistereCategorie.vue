<template>
  <AtomLoader
    v-if="pending"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques de la répartion des catégories n'ont pas pu être chargées."
  />
  <StatsList
    v-if="ministereCategorieStats"
    :total-count="beneficiaryCount"
    :stats="ministereCategorieStats"
    stats-bar
    :not-filled-route="
      routes.beneficiary.AppBeneficiaries.path({
        notFilled: FilterBeneficiaryNotFilled.BeneficiaryMinistereCategorie
      })
    "
  />
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
  import type { StatFilterInput } from '~/server/schema'
  import { getStatLabel, ministereCategorieKeys } from '~/client/options'
  import { FilterBeneficiaryNotFilled } from '~/utils/constants/filters'
  import type { StatsListPropType } from '~/types/stat'

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const pending = ref<boolean>(true)
  const error = ref<Error | null>(null)
  const ministereCategorieStats = ref<StatsListPropType | null>(null)

  try {
    const trpc = useTrpcClient()
    const data = await trpc.stat.getMinistereCategorie.mutate(props.filters)
    if (data == null) {
      throw new Error('no data')
    }
    ministereCategorieStats.value =
      data.map(({ _count, ministereCategorie }) => ({
        key: ministereCategorie || 'null',
        label: getStatLabel(ministereCategorieKeys.byKey, ministereCategorie),
        count: _count
      })) || []
  } catch (err: unknown) {
    console.error(err)
    error.value = err as Error
  } finally {
    pending.value = false
  }
</script>
