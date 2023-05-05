<template>
  <div class="fr-p-2w">
    <AtomLoader
      v-if="!followupTypeOptions || !beneficiariesCitiesOptions"
      class="fr-mx-auto"
    />
    <AtomFilters
      v-else
      :filters="statsFilters"
      @filter="onFilter"
    />
  </div>
</template>

<script setup lang="ts">
  import { useAuthStore } from '~/store/auth'
  import { FilterType } from '~/utils/constants/filters'
  import type { FilterProp, FilterValues } from '~/types/filter'
  import { Options } from '~/utils/options'

  const isMinistryAgent = useMinistryAgent()
  const authStore = useAuthStore()

  const emit = defineEmits<{
    (e: 'filter', filters: FilterValues): void
  }>()

  const props = defineProps<{
    followupTypeOptions: Options
    beneficiariesCitiesOptions: Options
    agentOptions: Options
    idPrefix: string
  }>()

  const statsFilters = computed(() => {
    const filters: FilterProp[] = [
      {
        name: `${props.idPrefix}-fromDate`,
        label: 'Du',
        type: FilterType.Date
      },
      {
        name: `${props.idPrefix}-toDate`,
        label: 'Au',
        type: FilterType.Date
      }
    ]
    if (props.followupTypeOptions) {
      filters.push({
        name: `${props.idPrefix}-followupTypes`,
        label: "Type d'accompagnement",
        options: props.followupTypeOptions,
        type: FilterType.SelectMultiple
      })
    }
    if (props.beneficiariesCitiesOptions) {
      filters.push({
        name: `${props.idPrefix}-cities`,
        label: 'Ville',
        options: props.beneficiariesCitiesOptions,
        type: FilterType.SelectMultiple
      })
    }
    if (authStore.isResponsableDeStructure && isMinistryAgent.value) {
      filters.push({
        name: `${props.idPrefix}-referent`,
        label: 'Référent',
        options: props.agentOptions,
        type: FilterType.SelectOne
      })
    }
    return filters
  })

  function formatFilters(filters: { [k: string]: string }) {
    const MIDNIGHT_SUFFIX = 'T23:59:59+01:00'
    const formattedFilters: { [k: string]: string | Date | Array<string> } = {}

    if (filters.fromDate) {
      formattedFilters.fromDate = new Date(filters.fromDate)
    }
    if (filters.toDate) {
      formattedFilters.toDate = new Date(`${filters.toDate}${MIDNIGHT_SUFFIX}`)
    }
    if (filters.followupTypes) {
      formattedFilters.followupTypes = filters.followupTypes.split(',')
    }
    if (filters.cities) {
      formattedFilters.cities = filters.cities.split(',')
    }
    if (filters.referent) formattedFilters.referent = filters.referent

    return formattedFilters
  }

  function onFilter(filters: { [k: string]: string }) {
    const cleanedFilters: { [k: string]: string } = {}
    const idPrefixRegex = new RegExp(`^${props.idPrefix}-`)
    Object.entries(filters || {}).forEach(([key, value]) => {
      const keyWithoutIdPrefix = key.replace(idPrefixRegex, '')
      cleanedFilters[keyWithoutIdPrefix] = value
    })
    emit('filter', formatFilters(cleanedFilters))
  }
</script>
