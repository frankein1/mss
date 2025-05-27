<template>
  <AtomLoader
    v-if="pending"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques de la répartion des modes d'hébergement n'ont pas pu être chargées."
  />
  <StatsList
    v-if="accommodationModesStats"
    :total-count="beneficiaryCount"
    :stats="accommodationModesStats"
    stats-bar
    :not-filled-route="
      routes.beneficiary.AppBeneficiaries.path({
        notFilled: FilterBeneficiaryNotFilled.BeneficiaryAccommodationMode
      })
    "
  />
  <p v-else>
    Commencez à
    <NuxtLink :to="routes.beneficiary.AppBeneficiariesAdd.path()"
      >créer des fiches de bénéficiaires</NuxtLink
    >
    pour voir apparaître les statistiques de la répartition des modes
    d'hébergement.
  </p>
</template>

<script lang="ts" setup>
  import { StatFilterInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { routes } from '~/utils/routes'
  import {
    getStatLabel,
    beneficiaryAccommodationModeKeys
  } from '~/client/options'
  import { FilterBeneficiaryNotFilled } from '~/utils/constants/filters'
  import { StatsListPropType } from '~/types/stat'

  const trpcClient = useTrpcClient()

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const error = ref<boolean>(false)
  const pending = ref<boolean>(false)
  const accommodationModesStats = ref<StatsListPropType | null>(null)
  const router = trpcClient.stat
  const updatedAccomodationModeStats =
    router.getAccommodationModeStatsPost.useMutation()

  onMounted(async () => {
    pending.value = true
    useTrpcMutation({
      mutation: () => updatedAccomodationModeStats.mutate(props.filters),
      onSuccess: data => {
        console.log(data)
        if (updatedAccomodationModeStats.error.value) {
          error.value = true
          return
        }
        pending.value = false
        accommodationModesStats.value =
          data?.map(({ _count, accommodationMode }) => ({
            key: accommodationMode || 'null',
            label: getStatLabel(
              beneficiaryAccommodationModeKeys.byKey,
              accommodationMode
            ),
            count: _count
          })) || []
      },
      onFailure: () => {
        error.value = true
      }
    })
  })
</script>
