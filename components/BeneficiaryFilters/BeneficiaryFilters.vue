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

  const {
    data: followUpTypeOptions,
    pending: followUpTypeOptionsPending,
    error: followUpTypeOptionsError
  } = useLazyAsyncData('followUpTypeOptions', loadFollowUpTypeOptions, {
    server: false
  })

  const {
    data: agentOptions,
    pending: agentOptionsPending,
    error: agentOptionsError
  } = useLazyAsyncData('agentOptions', loadAgentOptions, {
    server: false
  })

  const {
    data: citiesOptions,
    pending: citiesOptionsPending,
    error: citiesOptionsError
  } = useLazyAsyncData('citiesOptions', loadCitiesOptions, {
    server: false
  })

  const pending = computed(
    () =>
      followUpTypeOptionsPending.value ||
      agentOptionsPending.value ||
      citiesOptionsPending.value
  )

  const fetchError = computed(() => {
    if (followUpTypeOptionsError.value) {
      return "La liste des types d'accompagnement n'a pas pu être chargée."
    }
    if (agentOptionsError.value) {
      return "La liste des agents n'a pas pu être chargée."
    }
    if (citiesOptionsError.value) {
      return "La liste des villes n'a pas pu être chargée."
    }
    return ''
  })

  async function loadFollowUpTypeOptions() {
    const followUpTypes =
      await trpcClient.config.getStructureFollowupTypes.query()
    return toOptions(followUpTypes, 'id', 'name')
  }

  async function loadAgentOptions() {
    const agents = await trpcClient.config.getAgents.query()
    return toOptions(agents, 'id', 'name')
  }

  async function loadCitiesOptions() {
    const cities = await trpcClient.config.getBeneficiariesCities.query()
    const definedCities = cities.filter(hasDefinedCity)

    return toOptions(definedCities, 'city', 'city')
  }

  const beneficiaryFilters = computed(() => {
    if (
      !followUpTypeOptions.value ||
      !agentOptions.value ||
      !citiesOptions.value
    ) {
      return null
    }

    const filters: FilterProp[] = [
      {
        name: 'followupTypes',
        label: "Type d'accompagnement",
        options: followUpTypeOptions.value,
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
