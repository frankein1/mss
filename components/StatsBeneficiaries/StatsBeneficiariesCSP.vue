<template>
  <AtomLoader
    v-if="pending"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques de la répartion des catégories socio-professionnelles n'ont pas pu être chargées."
  />

  <StatsList
    v-if="cspStats"
    :total-count="beneficiaryCount"
    :stats="cspStats"
    stats-bar
    :not-filled-route="
      routes.beneficiary.AppBeneficiaries.path({
        notFilled:
          FilterBeneficiaryNotFilled.BeneficiarySocioProfessionalCategory
      })
    "
  />
  <p v-else>
    Commencez à
    <NuxtLink :to="routes.beneficiary.AppBeneficiariesAdd.path()"
      >créer des fiches de bénéficiaires</NuxtLink
    >
    pour voir apparaître les statistiques de la répartition des catégories
    socio-professionnelles.
  </p>
</template>

<script lang="ts" setup>
  import {
    beneficiarySocioProfessionalCategoryKeys,
    getStatLabel
  } from '~/client/options'
  import type { StatFilterInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { routes } from '~/utils/routes'
  import { FilterBeneficiaryNotFilled } from '~/utils/constants/filters'
  import type { StatsListPropType } from '~/types/stat'

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const pending = ref<boolean>(true)
  const error = ref<Error | null>(null)
  const cspStats = ref<StatsListPropType | null>(null)

  try {
    const trpc = useTrpcClient()
    const data = await trpc.stat.getCSPStats.mutate(props.filters)
    if (data == null) {
      throw new Error('no data')
    }
    cspStats.value =
      data.map(({ _count, socioProfessionalCategory }) => ({
        key: socioProfessionalCategory || 'null',
        label: getStatLabel(
          beneficiarySocioProfessionalCategoryKeys.byKey,
          socioProfessionalCategory
        ),
        count: _count
      })) || []
  } catch (err: unknown) {
    console.error(err)
    error.value = err as Error
  } finally {
    pending.value = false
  }

  pending.value = false
</script>
