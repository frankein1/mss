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
  import { EventCategory, BeneficiaryFilterEventAction } from '~/types/matomo'
  import { beneficiaryFieldLabels } from '~/client/labels'
  import { canOnlyListItsBeneficiaries } from '~/server/security/rules'
  import { useAuthStore } from '~/store/auth'

  const trpcClient = useTrpcClient()
  const authStore = useAuthStore()

  const emit = defineEmits<{
    filter: [filters: BeneficiaryFilterInput]
  }>()

  const filtersStore = useFiltersStore()
  const INITIAL_VALUES = filtersStore.beneficiary || {}

  const {
    data: followupTypeOptions,
    pending: followupTypeOptionsPending,
    error: followupTypeOptionsError
  } = await trpcClient.config.getStructureFollowupTypes.useQuery(
    {},
    {
      transform: followupTypes => toOptions(followupTypes, 'id', 'name'),
      queryKey: 'config.getStructureFollowupTypes.options'
    }
  )

  const {
    data: agentOptions,
    pending: agentOptionsPending,
    error: agentOptionsError
  } = await trpcClient.config.getAgents.useQuery(
    {},
    {
      transform: agents => toOptions(agents, 'id', 'name'),
      queryKey: 'config.getAgents.options'
    }
  )

  const {
    data: citiesOptions,
    pending: citieOptionsPending,
    error: citieOptionsError
  } = await trpcClient.config.getBeneficiariesCities.useQuery(
    {},
    {
      transform: cities => {
        const definedCities = cities.filter(hasDefinedCity)
        return toOptions(definedCities, 'city', 'city')
      }
    }
  )

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
        type: FilterType.SelectMultiple,
        matomoEventCategory: EventCategory.BeneficiaryFilter,
        matomoEventAction: BeneficiaryFilterEventAction.FollowupType
      }
    ]

    if (!canOnlyListItsBeneficiaries(authStore.getAuthUser)) {
      filters.push({
        name: 'referents',
        label: 'Référent',
        options: agentOptions.value,
        type: FilterType.SelectMultiple,
        matomoEventCategory: EventCategory.BeneficiaryFilter,
        matomoEventAction: BeneficiaryFilterEventAction.Referent
      })
    }

    if (citiesOptions.value.size) {
      filters.push({
        name: 'cities',
        label: beneficiaryFieldLabels.city,
        options: citiesOptions.value,
        type: FilterType.SelectMultiple,
        matomoEventCategory: EventCategory.BeneficiaryFilter,
        matomoEventAction: BeneficiaryFilterEventAction.City
      })
    }

    filters.push(
      {
        name: 'status',
        label: 'Statut',
        options: withEmptyValue(beneficiaryStatusOptions, 'Tous les statuts'),
        type: FilterType.SelectOne,
        matomoEventCategory: EventCategory.BeneficiaryFilter,
        matomoEventAction: BeneficiaryFilterEventAction.Status
      },
      {
        name: 'ageGroup',
        label: "Tranche d'âge",
        options: withEmptyValue(ageGroupOptions, "Toutes les tranches d'âge"),
        type: FilterType.SelectOne,
        matomoEventCategory: EventCategory.BeneficiaryFilter,
        matomoEventAction: BeneficiaryFilterEventAction.AgeGroup
      }
    )

    return filters
  })

  function onFilter(filters: BeneficiaryFilterInput) {
    filtersStore.beneficiary = filters
    emit('filter', filters)
  }
</script>
