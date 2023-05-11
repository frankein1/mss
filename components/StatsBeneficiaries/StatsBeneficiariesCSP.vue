<template>
  <div class="main-container fr-p-2w">
    <AtomLoader
      v-if="pending"
      class="fr-mx-auto"
    />
    <AtomAlert
      v-else-if="error"
      :alert-type="AlertType.Error"
      message="Les statistiques de la répartion des catégories socio-professionnelles n'ont pas pu être chargées."
    />
    <template v-else-if="CSPStats">
      <h2 class="fr-h5">Catégories socio-professionnelles</h2>
      <StatsList
        v-if="CSPStats.length"
        :total-count="beneficiaryCount"
        :stats="CSPStats"
        stats-bar
      />
      <p v-else>
        Commencez à
        <NuxtLink
          :to="Routes.BeneficiariesAdd"
          target="_self"
          >créer des fiches de bénéficiaires</NuxtLink
        >
        pour voir apparaître les statistiques de la répartition des catégories
        socio-professionnelles.
      </p>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { BeneficiarySocioProfessionalCategory } from '@prisma/client'
  import { beneficiarySocioProfessionalCategoryLabels } from '~/client/options/beneficiary'
  import { StatFilterInput } from '~/server/schema'
  import { AlertType } from '~~/utils/constants/alert'
  import { Routes } from '~/utils/routing/routes'
  import { getStatLabel } from '~/client/options/stat'

  const trpcClient = useTrpcClient()

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const {
    data: CSPCounts,
    pending,
    error
  } = useAsyncData<
    Array<{
      socioProfessionalCategory: BeneficiarySocioProfessionalCategory | null
      _count: number
    }>
  >(() => trpcClient.stat.getCSPStats.query(props.filters), {
    default: () => [],
    watch: [props.filters]
  })

  const CSPStats = computed(
    () =>
      CSPCounts.value?.map(({ _count, socioProfessionalCategory }) => ({
        key: socioProfessionalCategory || 'null',
        label: getStatLabel(
          beneficiarySocioProfessionalCategoryLabels,
          socioProfessionalCategory
        ),
        count: _count
      })) || []
  )
</script>
