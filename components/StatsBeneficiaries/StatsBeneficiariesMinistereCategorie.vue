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
  import { StatFilterInput } from '~/server/schema'
  import { getStatLabel, ministereCategorieKeys } from '~/client/options'
  import { FilterBeneficiaryNotFilled } from '~/utils/constants/filters'
  import { StatsListPropType } from '~/types/stat'

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const error = ref<boolean>(false)
  const pending = ref<boolean>(false)
  const ministereCategorieStats = ref<StatsListPropType | null>(null)

  onMounted(async () => {
    pending.value = true
    // Do not use useMutation() or useTrpcMutation()
    // it cause issues with response #id matching
    const trpc = useTrpcClient()
    const data = await trpc.stat.getMinistereCategorieStatsPost.mutate(
      props.filters
    )
    if (data == null) {
      error.value = true
      return
    }
    ministereCategorieStats.value =
      data.map(({ _count, ministereCategorie }) => ({
        key: ministereCategorie || 'null',
        label: getStatLabel(ministereCategorieKeys.byKey, ministereCategorie),
        count: _count
      })) || []
    pending.value = false
  })
</script>
