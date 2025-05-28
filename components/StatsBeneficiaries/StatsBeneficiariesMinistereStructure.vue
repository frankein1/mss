<template>
  <AtomLoader
    v-if="pending"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques de la répartion des structures de rattachement n'ont pas pu être chargées."
  />
  <StatsList
    v-if="ministereStructureStats"
    :total-count="beneficiaryCount"
    :stats="ministereStructureStats"
    stats-bar
    :not-filled-route="
      routes.beneficiary.AppBeneficiaries.path({
        notFilled: FilterBeneficiaryNotFilled.BeneficiaryMinistereStructure
      })
    "
  />
  <p v-else>
    Commencez à
    <NuxtLink :to="routes.beneficiary.AppBeneficiariesAdd.path()"
      >créer des fiches de bénéficiaires</NuxtLink
    >
    pour voir apparaître les statistiques de la répartition des structures de
    rattachement.
  </p>
</template>

<script setup lang="ts">
  import { AlertType } from '~/utils/constants/alert'
  import { routes } from '~/utils/routes'
  import { StatFilterInput } from '~/server/schema'
  import { getStatLabel, ministereStructureKeys } from '~/client/options'
  import { FilterBeneficiaryNotFilled } from '~/utils/constants/filters'
  import { StatsListPropType } from '~/types/stat'

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const error = ref<boolean>(false)
  const pending = ref<boolean>(false)
  const ministereStructureStats = ref<StatsListPropType | null>(null)

  onMounted(async () => {
    pending.value = true
    // Do not use useMutation() or useTrpcMutation()
    // it cause issues with response #id matching
    const trpc = useTrpcClient()
    const data = await trpc.stat.getMinistereStructureStatsPost.mutate(
      props.filters
    )
    if (data == null) {
      error.value = true
      return
    }
    ministereStructureStats.value =
      data.map(({ _count, ministereStructure }) => ({
        key: ministereStructure || 'null',
        label: getStatLabel(ministereStructureKeys.byKey, ministereStructure),
        count: _count
      })) || []
    pending.value = false
  })
</script>
