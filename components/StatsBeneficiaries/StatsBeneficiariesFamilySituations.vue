<template>
  <AtomLoader
    v-if="pending"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques de la répartion des situations familiales n'ont pas pu être chargées."
  />

  <StatsList
    v-if="familySituationsStats"
    :total-count="beneficiaryCount"
    :stats="familySituationsStats"
    stats-bar
    :not-filled-route="
      routes.beneficiary.AppBeneficiaries.path({
        notFilled: FilterBeneficiaryNotFilled.BeneficiaryFamilySituation
      })
    "
  />
  <p v-else>
    Commencez à
    <NuxtLink :to="routes.beneficiary.AppBeneficiariesAdd.path()"
      >créer des fiches de bénéficiaires</NuxtLink
    >
    pour voir apparaître les statistiques de la répartition des situations
    familiales.
  </p>
</template>

<script lang="ts" setup>
  import { StatFilterInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { routes } from '~/utils/routes'
  import { getStatLabel, familySituationKeys } from '~/client/options'
  import { FilterBeneficiaryNotFilled } from '~/utils/constants/filters'
  import { StatsListPropType } from '~/types/stat'

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const error = ref<boolean>(false)
  const pending = ref<boolean>(false)
  const familySituationsStats = ref<StatsListPropType | null>(null)

  onMounted(async () => {
    pending.value = true
    // Do not use useMutation() or useTrpcMutation()
    // it cause issues with response #id matching
    const trpc = useTrpcClient()
    const data = await trpc.stat.getFamilyStatsPost.mutate(props.filters)
    if (data == null) {
      error.value = true
      return
    }
    familySituationsStats.value =
      data.map(({ _count, familySituation }) => ({
        key: familySituation || 'null',
        label: getStatLabel(familySituationKeys.byKey, familySituation),
        count: _count
      })) || []
    pending.value = false
  })
</script>
