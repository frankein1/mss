<template>
  <AtomLoader
    v-if="status === 'pending'"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques de la répartion des catégories socio-professionnelles n'ont pas pu être chargées."
  />

  <template v-else-if="cspStats && cspStats.length">
    <StatsList
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
  </template>
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

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const trpcClient = useTrpcClient()
  const { data, error, status } = await trpcClient.stat.getCSPStats.useQuery(
    toRef(() => props.filters)
  )
  const cspStats = computed(
    () =>
      data.value?.map(({ _count, socioProfessionalCategory }) => ({
        key: socioProfessionalCategory || 'null',
        label: getStatLabel(
          beneficiarySocioProfessionalCategoryKeys.byKey,
          socioProfessionalCategory
        ),
        count: _count
      })) || []
  )
</script>
