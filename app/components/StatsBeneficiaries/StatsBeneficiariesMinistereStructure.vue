<template>
  <AtomLoader
    v-if="status === 'pending'"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques de la répartion des structures de rattachement n'ont pas pu être chargées."
  />

  <template
    v-else-if="ministereStructureStats && ministereStructureStats.length"
  >
    <StatsList
      :total-count="beneficiaryCount"
      :stats="ministereStructureStats"
      stats-bar
      :not-filled-route="
        routes.beneficiary.AppBeneficiaries.path({
          notFilled: FilterBeneficiaryNotFilled.BeneficiaryMinistereStructure
        })
      "
    />
  </template>
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
  import type { StatFilterInput } from '~~/server/schema'
  import { getStatLabel, ministereStructureKeys } from '~~/client/options'
  import type { ActiveBeneficiaryMinistereStructure } from '~~/client/options'
  import { FilterBeneficiaryNotFilled } from '~/utils/constants/filters'

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const trpcClient = useTrpcClient()

  const { data, error, status } =
    await trpcClient.stat.getMinistereStructure.useQuery(
      toRef(() => props.filters)
    )
  const ministereStructureStats = computed(
    () =>
      data.value?.map(({ _count, ministereStructure }) => ({
        key: ministereStructure || 'null',
        label: getStatLabel<ActiveBeneficiaryMinistereStructure>(
          ministereStructureKeys.byKey,
          ministereStructure as ActiveBeneficiaryMinistereStructure | null
        ),
        count: _count
      })) || []
  )
</script>
