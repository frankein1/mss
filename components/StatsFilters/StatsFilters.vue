<template>
  <div class="fr-p-2w">
    <AtomLoader
      v-if="!followupTypeOptions || !beneficiariesCitiesOptions"
      class="fr-mx-auto"
    />
    <AtomFilters
      v-else
      :filters="statsFilters"
      @filter="emit('filter', $event)"
    />
  </div>
</template>

<script setup lang="ts">
  import { FilterType } from '~/utils/constants/filters'
  import type { Options } from '~/utils/options'
  import type { StatFilterInput } from '~/server/schema'
  import type { FilterProp } from '~/types/filter'
  import { canViewStatsByReferent } from '~/server/security'

  const user = useAuthUser()

  const props = defineProps<{
    followupTypeOptions: Options
    beneficiariesCitiesOptions: Options
    agentOptions: Options
  }>()

  const emit = defineEmits<{
    filter: [filters: StatFilterInput]
  }>()

  const statsFilters = computed(() => {
    const filters: FilterProp[] = [
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
    ]
    if (props.followupTypeOptions) {
      filters.push({
        name: 'followupTypes',
        label: "Type d'accompagnement",
        options: props.followupTypeOptions,
        type: FilterType.SelectMultiple
      })
    }
    if (props.beneficiariesCitiesOptions) {
      filters.push({
        name: 'cities',
        label: 'Ville',
        options: props.beneficiariesCitiesOptions,
        type: FilterType.SelectMultiple
      })
    }
    if (canViewStatsByReferent(user.value)) {
      filters.push({
        name: 'referent',
        label: 'Référent',
        options: props.agentOptions,
        type: FilterType.SelectOne
      })
    }
    return filters
  })
</script>
