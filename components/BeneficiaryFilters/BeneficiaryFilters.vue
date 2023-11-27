<template>
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
</template>

<script lang="ts" setup>
  import { FilterType } from '~/utils/constants/filters'
  import { AlertType } from '~~/utils/constants/alert'
  import { useFiltersStore } from '~/store/filters'
  import { beneficiaryStatusOptions } from '~/client/options/beneficiary'
  import { ageGroupOptions } from '~/client/options/ageGroup'
  import { toOptions, withEmptyValue } from '~/utils/options'
  import type { BeneficiaryFilterInput } from '~/server/schema'
  import type { FilterProp } from '~/types/filter'
  import { EventCategory, BeneficiaryFilterEventAction } from '~/types/matomo'
  import { isReferent } from '~/server/security'

  const trpcClient = useTrpcClient()
  const user = useAuthUser()

  const emit = defineEmits<{
    filter: [filters: BeneficiaryFilterInput]
  }>()

  const filtersStore = useFiltersStore()
  const INITIAL_VALUES = filtersStore.beneficiary || {}

  const {
    data: followupTypeOptions,
    pending: followupTypeOptionsPending,
    error: followupTypeOptionsError
  } = await trpcClient.config.getStructureFollowupTypes.useQuery(undefined, {
    transform: followupTypes => toOptions(followupTypes, 'id', 'name'),
    queryKey: 'config.getStructureFollowupTypes.options'
  })

  const {
    data: agentOptions,
    pending: agentOptionsPending,
    error: agentOptionsError
  } = await trpcClient.config.getAgents.useQuery(undefined, {
    transform: agents => toOptions(agents, 'id', 'name'),
    queryKey: 'config.getAgents.options'
  })

  const pending = computed(
    () => followupTypeOptionsPending.value || agentOptionsPending.value
  )

  const fetchError = computed(() => {
    if (followupTypeOptionsError.value) {
      return "La liste des types d'accompagnement n'a pas pu être chargée."
    }
    if (agentOptionsError.value) {
      return "La liste des agents n'a pas pu être chargée."
    }
    return ''
  })

  const beneficiaryFilters = computed(() => {
    if (!followupTypeOptions.value || !agentOptions.value) {
      return null
    }

    const filters: FilterProp[] = [
      {
        name: 'search',
        label: 'Recherche',
        type: FilterType.Search,
        placeholder: 'Rechercher un·e bénéficiaire',
        alwaysExpanded: true
      },
      {
        name: 'followupTypes',
        label: "Type d'accompagnement",
        options: followupTypeOptions.value,
        type: FilterType.SelectMultiple,
        alwaysExpanded: true,
        matomoEventCategory: EventCategory.BeneficiaryFilter,
        matomoEventAction: BeneficiaryFilterEventAction.FollowupType
      }
    ]

    const hasReferentsFilters = !isReferent(user.value)

    if (hasReferentsFilters) {
      filters.push({
        name: 'referents',
        label: 'Référent',
        options: agentOptions.value,
        type: FilterType.SelectMultiple,
        alwaysExpanded: true,
        matomoEventCategory: EventCategory.BeneficiaryFilter,
        matomoEventAction: BeneficiaryFilterEventAction.Referent
      })
    }

    filters.push(
      {
        name: 'status',
        label: 'Statut',
        options: withEmptyValue(beneficiaryStatusOptions, 'Tous les statuts'),
        type: FilterType.SelectOne,
        alwaysExpanded: !hasReferentsFilters,
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
