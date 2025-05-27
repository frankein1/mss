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

  const trpcClient = useTrpcClient()

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const error = ref<boolean>(false)
  const pending = ref<boolean>(false)
  const familySituationsStats = ref<StatsListPropType | null>(null)
  const router = trpcClient.stat
  const updatedFamilySituationStats = router.getFamilyStatsPost.useMutation()

  onMounted(async () => {
    pending.value = true
    useTrpcMutation({
      mutation: () => updatedFamilySituationStats.mutate(props.filters),
      onSuccess: data => {
        console.log(data)

        if (updatedFamilySituationStats.error.value) {
          error.value = true
          return
        }
        pending.value = false
        familySituationsStats.value =
          data?.map(({ _count, familySituation }) => ({
            key: familySituation || 'null',
            label: getStatLabel(familySituationKeys.byKey, familySituation),
            count: _count
          })) || []
      },
      /*************  ✨ Windsurf Command ⭐  *************/
      // Called if the mutation fails. Sets `error.value` to `true`.
      /*******  83b2ae6d-6af6-4f84-bdc8-04b8960af9b7  *******/
      onFailure: () => {
        error.value = true
      }
    })
  })
</script>
