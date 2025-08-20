<template>
  <section class="feature-section">
    <AtomFilters
      :filters="filterConfig"
      :expanded-by-default="true"
      @filter="onFilter"
    />
  </section>
</template>

<script lang="ts" setup>
  import { workshopPeriodFilterKeys } from '~/client/options'
  import type { FilterProp, FilterValues } from '~/types/filter'
  import { FilterType, PeriodFilter } from '~/utils/constants/filters'

  const model = defineModel<{
    workshopNameIds?: string[]
    period?: PeriodFilter
  }>({ required: true })
  const trpcClient = useTrpcClient()
  const { data: workshopNameList } =
    await trpcClient.workshop.getWorkshopNameList.useQuery()

  const filterConfig: ComputedRef<FilterProp[]> = computed(() => {
    const config: FilterProp[] = [
      {
        name: 'workshopNameIds',
        label: 'Atelier(s)',
        type: FilterType.SelectMultiple,
        options:
          workshopNameList.value?.map(({ id, name }) => ({
            label: name,
            value: id
          })) ?? [],
        alwaysExpanded: true
      },
      {
        name: 'period',
        label: 'Période',
        type: FilterType.SelectOne,
        options: withEmptyValue(workshopPeriodFilterKeys.options, ''),
        alwaysExpanded: true
      }
    ]

    if (model.value.period === PeriodFilter.Custom) {
      config.push(
        {
          name: 'fromDate',
          label: 'Du',
          type: FilterType.Date
        },
        {
          name: 'toDate',
          label: 'Au',
          type: FilterType.Date
        }
      )
    }

    return config
  })

  function onFilter(values: FilterValues) {
    model.value = values
  }
</script>
