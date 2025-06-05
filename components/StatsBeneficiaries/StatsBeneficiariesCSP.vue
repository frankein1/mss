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
    v-if="CSPStats.length"
    :total-count="beneficiaryCount"
    :stats="CSPStats"
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
  import { StatFilterInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { routes } from '~/utils/routes'
  import { FilterBeneficiaryNotFilled } from '~/utils/constants/filters'
  import { useLoadStatisticsWithPost } from '~/composables/useLoadStatisticsWithPost'

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const {
    data: CSPCounts,
    pending,
    error
  } = await useLoadStatisticsWithPost('getCSPStats', toRef(props.filters))

  const CSPStats = computed(
    () =>
      CSPCounts.value?.map(({ _count, socioProfessionalCategory }) => ({
        key: socioProfessionalCategory || 'null',
        label: getStatLabel(
          beneficiarySocioProfessionalCategoryKeys.byKey,
          socioProfessionalCategory
        ),
        count: _count
      })) || []
  )
</script>
