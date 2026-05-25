<template>
  <section class="feature-section">
    <h3 class="fr-sr-only">Filtres</h3>
    <AtomLoader
      v-if="isLoading"
      class="fr-mx-auto"
    />
    <AtomFilters
      v-else
      :filters="statsFilters"
      :default-values="defaultValues"
      :expanded-by-default="true"
      @filter="emit('update:filters', $event)"
    />
  </section>
</template>

<script setup lang="ts">
  import { periodKeys } from '~/client/options'
  import { FilterType } from '~/utils/constants/filters'
  import { withEmptyValue } from '~/utils/options'
  import type { WorkshopStatFilterInput } from '~/server/schema'
  import type { FilterProp } from '~/types/filter'
  import { StatPeriodFilter } from '~/types/stat'

  const trpcClient = useTrpcClient()

  const props = defineProps<{
    filters: WorkshopStatFilterInput
  }>()

  const emit = defineEmits<{
    'update:filters': [filters: WorkshopStatFilterInput]
  }>()

  const defaultValues = computed<WorkshopStatFilterInput | undefined>(() => {
    return undefined
  })

  const maxAlwaysExpandedNb = 4

  const { data: workshopNameList, status: workshopNameListStatus } =
    trpcClient.workshop.getWorkshopNameList.useQuery()

  const { data: partnerOrganizations, status: partnerOrganizationsStatus } =
    await trpcClient.partner.getAll.useQuery()

  const isLoading = computed(
    () =>
      workshopNameListStatus.value === 'pending' ||
      partnerOrganizationsStatus.value === 'pending'
  )

  const statsFilters = computed(() => {
    const statsFilters: FilterProp[] = [
      {
        name: 'period',
        label: 'Période',
        type: FilterType.SelectOne,
        options: withEmptyValue(periodKeys.options, ''),
        alwaysExpanded: true
      }
    ]

    if (props.filters.period === StatPeriodFilter.Custom) {
      statsFilters.push(
        {
          name: 'fromDate',
          label: 'Du',
          type: FilterType.Date,
          alwaysExpanded: true
        },
        {
          name: 'toDate',
          label: 'Au',
          type: FilterType.Date,
          alwaysExpanded: statsFilters.length < maxAlwaysExpandedNb
        }
      )
    }
    if (workshopNameList.value) {
      statsFilters.push({
        name: 'workshopNameIds',
        label: 'Atelier',
        type: FilterType.SelectMultiple,
        options: workshopNameList.value.map(({ id, name }) => ({
          label: name,
          value: id
        })),
        alwaysExpanded: true
      })
    }

    if (partnerOrganizations.value) {
      statsFilters.push({
        name: 'partnerOrganizationIds',
        label: 'Partenaire',
        type: FilterType.SelectMultiple,
        options: partnerOrganizations.value.map(({ id, name }) => ({
          label: name,
          value: id
        })),
        alwaysExpanded: true
      })
    }

    return statsFilters
  })
</script>
