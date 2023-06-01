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
  import type { BeneficiaryFilterInput } from '~/server/schema'
  import type { FilterProp } from '~/types/filter'

  const trpcClient = useTrpcClient()

  const emit = defineEmits<{
    (e: 'filter', filters: BeneficiaryFilterInput): void
  }>()

  const filtersStore = useFiltersStore()
  const INITIAL_VALUES = filtersStore.beneficiary || {}

  // FIXME: For now, trpc-nuxt does not allow to define query key, and their defined key is not based on the transform option
  const {
    data: followupTypeOptions,
    pending: followupTypeOptionsPending,
    error: followupTypeOptionsError
  } = await useAsyncData(
    'config.getStructureFollowupTypes.options',
    () => trpcClient.config.getStructureFollowupTypes.query(undefined),
    {
      transform: followupTypes => toOptions(followupTypes, 'id', 'name')
    }
  )

  const {
    data: agentOptions,
    pending: agentOptionsPending,
    error: agentOptionsError
  } = await trpcClient.config.getAgents.useQuery(undefined, {
    transform: agents => toOptions(agents, 'id', 'name')
  })

  const {
    data: citiesOptions,
    pending: citieOptionsPending,
    error: citieOptionsError
  } = await trpcClient.config.getBeneficiariesCities.useQuery(undefined, {
    transform: cities => {
      const definedCities = cities.filter(hasDefinedCity)
      return toOptions(definedCities, 'city', 'city')
    }
  })

  const pending = computed(
    () =>
      followupTypeOptionsPending.value ||
      agentOptionsPending.value ||
      citieOptionsPending.value
  )

  const fetchError = computed(() => {
    if (followupTypeOptionsError.value) {
      return "La liste des types d'accompagnement n'a pas pu être chargée."
    }
    if (agentOptionsError.value) {
      return "La liste des agents n'a pas pu être chargée."
    }
    if (citieOptionsError.value) {
      return "La liste des villes n'a pas pu être chargée."
    }
    return ''
  })

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

  function onFilter(filters: BeneficiaryFilterInput) {
    filtersStore.beneficiary = filters
    emit('filter', filters)
  }
</script>
