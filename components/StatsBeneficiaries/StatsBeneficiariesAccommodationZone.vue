<template>
  <AtomLoader
    v-if="pending"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques de la répartion des zones d'hébergement n'ont pas pu être chargées."
  />

  <StatsList
    v-if="accommodationZoneStats"
    :total-count="beneficiaryCount"
    :stats="accommodationZoneStats"
    stats-bar
    :not-filled-route="
      routes.beneficiary.AppBeneficiaries.path({
        notFilled: FilterBeneficiaryNotFilled.BeneficiaryAccommodationZone
      })
    "
  />
  <p v-else>
    Commencez à
    <NuxtLink :to="routes.beneficiary.AppBeneficiariesAdd.path()"
      >créer des fiches de bénéficiaires</NuxtLink
    >
    pour voir apparaître les statistiques de la répartition des zones
    d'hébergement.
  </p>
</template>

<script setup lang="ts">
  import { AlertType } from '~/utils/constants/alert'
  import { routes } from '~/utils/routes'
  import { StatFilterInput } from '~/server/schema'
  import {
    getStatLabel,
    beneficiaryAccommodationZoneKeys
  } from '~/client/options'
  import { FilterBeneficiaryNotFilled } from '~/utils/constants/filters'
  import { StatsListPropType } from '~/types/stat'

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const trpcClient = useTrpcClient()
  const error = ref<boolean>(false)
  const pending = ref<boolean>(false)
  const accommodationZoneStats = ref<StatsListPropType | null>(null)
  const router = trpcClient.stat
  const updatedAccommodationZone =
    router.getAccommodationZoneStatsPost.useMutation()

  onMounted(async () => {
    pending.value = true
    useTrpcMutation({
      mutation: () => updatedAccommodationZone.mutate(props.filters),
      onSuccess: data => {
        console.log(data)
        if (updatedAccommodationZone.error.value) {
          error.value = true
          return
        }
        pending.value = false
        accommodationZoneStats.value =
          data?.map(({ _count, accommodationZone }) => ({
            key: accommodationZone || 'null',
            label: getStatLabel(
              beneficiaryAccommodationZoneKeys.byKey,
              accommodationZone
            ),
            count: _count
          })) || []
      },
      onFailure: () => {
        error.value = true
      }
    })
  })

  // const {
  //   data: accommodationZoneCounts,
  //   pending,
  //   error
  // } = await useTrpcClient().stat.getAccommodationZoneStats.useQuery(
  //   props.filters
  // )

  // const accommodationZoneStats = computed(
  //   () =>
  //     accommodationZoneCounts.value?.map(({ _count, accommodationZone }) => ({
  //       key: accommodationZone || 'null',
  //       label: getStatLabel(
  //         beneficiaryAccommodationZoneKeys.byKey,
  //         accommodationZone
  //       ),
  //       count: _count
  //     })) || []
  // )
</script>
