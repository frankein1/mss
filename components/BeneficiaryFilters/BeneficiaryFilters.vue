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
    :initial-selected-values="filtersState.beneficiary.value || {}"
    @filter="onFilter"
  />
</template>

<script lang="ts" setup>
  import { FilterType } from '~/utils/constants/filters'
  import { AlertType } from '~/utils/constants/alert'
  import { beneficiaryStatusOptions, ageGroupOptions } from '~/client/options'
  import { toOptions, withEmptyValue } from '~/utils/options'
  import type { BeneficiaryFilterInput } from '~/server/schema'
  import type { FilterProp } from '~/types/filter'
  import { EventCategory, BeneficiaryFilterEventAction } from '~/types/matomo'

  const trpcClient = useTrpcClient()
  const hasReferentsFilters = !useAuthState().isReferent()

  const emit = defineEmits<{
    filter: [filters: BeneficiaryFilterInput]
  }>()

  const filtersState = useFilters()

  const {
    data: socialSupportSubjectOptions,
    pending: socialSupportSubjectOptionsPending,
    error: socialSupportSubjectOptionsError
  } = await trpcClient.config.getStructureSocialSupportSubjects.useQuery(
    undefined,
    {
      transform: socialSupportSubjects =>
        toOptions(socialSupportSubjects, 'id', 'name'),
      queryKey: 'config.getStructureSocialSupportSubjects.options'
    }
  )

  const {
    data: agentOptions,
    pending: agentOptionsPending,
    error: agentOptionsError
  } = await trpcClient.config.getAgents.useQuery(undefined, {
    transform: agents => toOptions(agents, 'id', 'name'),
    queryKey: 'config.getAgents.options'
  })

  const pending = computed(
    () => socialSupportSubjectOptionsPending.value || agentOptionsPending.value
  )

  const fetchError = computed(() => {
    if (socialSupportSubjectOptionsError.value) {
      return "La liste des objets d'accompagnement n'a pas pu être chargée."
    }
    if (agentOptionsError.value) {
      return "La liste des agents n'a pas pu être chargée."
    }
    return ''
  })

  const beneficiaryFilters = computed(() => {
    if (!socialSupportSubjectOptions.value || !agentOptions.value) {
      return null
    }

    const maxAlwaysExpandedNb = 3

    const filters: FilterProp[] = [
      {
        name: 'search',
        label: 'Recherche',
        type: FilterType.Search,
        placeholder: 'Rechercher un·e bénéficiaire',
        alwaysExpanded: true
      },
      {
        name: 'socialSupportSubjects',
        label: "Objet d'accompagnement",
        options: socialSupportSubjectOptions.value,
        type: FilterType.SelectMultiple,
        alwaysExpanded: true,
        matomoEventCategory: EventCategory.BeneficiaryFilter,
        matomoEventAction: BeneficiaryFilterEventAction.SocialSupportSubject
      }
    ]

    if (hasReferentsFilters) {
      filters.push({
        name: 'referents',
        label: 'Référent',
        options: agentOptions.value,
        type: FilterType.SelectMultiple,
        alwaysExpanded: filters.length < maxAlwaysExpandedNb,
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
        alwaysExpanded: filters.length < maxAlwaysExpandedNb,
        matomoEventCategory: EventCategory.BeneficiaryFilter,
        matomoEventAction: BeneficiaryFilterEventAction.Status
      },
      {
        name: 'ageGroup',
        label: "Tranche d'âge",
        options: withEmptyValue(ageGroupOptions, "Toutes les tranches d'âge"),
        type: FilterType.SelectOne,
        alwaysExpanded: filters.length < maxAlwaysExpandedNb,
        matomoEventCategory: EventCategory.BeneficiaryFilter,
        matomoEventAction: BeneficiaryFilterEventAction.AgeGroup
      }
    )

    return filters
  })

  function onFilter(filters: BeneficiaryFilterInput) {
    filtersState.beneficiary.value = filters
    emit('filter', filters)
  }
</script>
