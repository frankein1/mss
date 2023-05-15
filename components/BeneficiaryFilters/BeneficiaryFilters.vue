<template>
  <div>
    <AtomAlert
      v-if="fetchError"
      class="fr-mb-2w"
      :alert-type="AlertType.Error"
      :message="fetchError"
    />
    <AtomLoader
      v-else-if="pending"
      class="fr-mx-auto"
    />
    <AtomFilters
      v-else-if="beneficiaryFilters"
      :filters="beneficiaryFilters"
      :initial-selected-values="INITIAL_VALUES"
      @filter="onFilter"
    />
  </div>
</template>

<script lang="ts" setup>
  import { FilterType } from '~/utils/constants/filters'
  import { AlertType } from '~~/utils/constants/alert'
  import { useFiltersStore } from '~/store/filters'
  import { beneficiaryStatusOptions } from '~/client/options/beneficiary'
  import { ageGroupOptions } from '~/client/options/ageGroup'
  import { toOptions, withEmptyValue } from '~/utils/options'
  import { hasDefinedCity } from '~/utils/beneficiary/hasDefinedCity'
  import type { BeneficiaryFilterRawInput } from '~/server/schema'
  import type { FilterProp } from '~/types/filter'

  const trpcClient = useTrpcClient()

  const emit = defineEmits<{
    (e: 'filter', filters: BeneficiaryFilterRawInput): void
  }>()

  const filtersStore = useFiltersStore()
  const INITIAL_VALUES = filtersStore.beneficiary || {}

  // TODO: Try to use transform
  const {
    data: followupTypes,
    pending: followupTypesPending,
    error: followupTypesError
  } = trpcClient.config.getStructureFollowupTypes.useQuery()

  const {
    data: agents,
    pending: agentsPending,
    error: agentsError
  } = trpcClient.config.getAgents.useQuery()

  const {
    data: cities,
    pending: citiesPending,
    error: citiesError
  } = trpcClient.config.getBeneficiariesCities.useQuery()

  const pending = computed(
    () =>
      followupTypesPending.value || agentsPending.value || citiesPending.value
  )

  const fetchError = computed(() => {
    if (followupTypesError.value) {
      return "La liste des types d'accompagnement n'a pas pu être chargée."
    }
    if (agentsError.value) {
      return "La liste des agents n'a pas pu être chargée."
    }
    if (citiesError.value) {
      return "La liste des villes n'a pas pu être chargée."
    }
    return ''
  })

  const followupTypeOptions = computed(() =>
    followupTypes.value ? toOptions(followupTypes.value, 'id', 'name') : null
  )

  const agentOptions = computed(() =>
    agents.value ? toOptions(agents.value, 'id', 'name') : null
  )

  const definedCities = computed(() =>
    cities.value ? cities.value.filter(hasDefinedCity) : null
  )

  const citiesOptions = computed(() =>
    definedCities.value ? toOptions(definedCities.value, 'city', 'city') : null
  )

  const beneficiaryFilters = computed(() => {
    if (
      !followupTypeOptions.value ||
      !agentOptions.value ||
      !citiesOptions.value
    ) {
      return null
    }

    const filters: FilterProp[] = [
      {
        name: 'followupTypes',
        label: "Type d'accompagnement",
        options: followupTypeOptions.value,
        type: FilterType.SelectMultiple
      },
      {
        name: 'referents',
        label: 'Référent',
        options: agentOptions.value,
        type: FilterType.SelectMultiple
      }
    ]

    if (citiesOptions.value.size) {
      filters.push({
        name: 'cities',
        label: 'Ville',
        options: citiesOptions.value,
        type: FilterType.SelectMultiple
      })
    }

    filters.push(
      {
        name: 'status',
        label: 'Statut',
        options: withEmptyValue(beneficiaryStatusOptions, 'Tous les statuts'),
        type: FilterType.SelectOne
      },
      {
        name: 'ageGroup',
        label: "Tranche d'âge",
        options: withEmptyValue(ageGroupOptions, "Toutes les tranches d'âge"),
        type: FilterType.SelectOne
      }
    )

    return filters
  })

  function onFilter(filters: BeneficiaryFilterRawInput) {
    filtersStore.beneficiary = filters
    emit('filter', filters)
  }
</script>
