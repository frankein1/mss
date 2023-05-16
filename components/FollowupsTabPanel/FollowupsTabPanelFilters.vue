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
      class="fr-mx-auto fr-mb-2w"
    />
    <AtomFilters
      v-else-if="filters"
      :filters="filters"
      :initial-selected-values="filtersStore.followup || {}"
      @filter="onFilter"
    />
  </div>
</template>

<script lang="ts" setup>
  import {
    followupStatusOptions,
    followupMediumOptions
  } from '~/client/options/followup'
  import { toOptions, withEmptyValue } from '~/utils/options'
  import { FilterType } from '~/utils/constants/filters'
  import { AlertType } from '~~/utils/constants/alert'
  import type { FollowupFilterInput } from '~/server/schema'
  import { useFiltersStore } from '~/store/filters'
  import type { FilterProp } from '~/types/filter'

  const trpcClient = useTrpcClient()
  const filtersStore = useFiltersStore()

  const emit = defineEmits<{
    (e: 'filter', filters: FollowupFilterInput): void
  }>()

  const {
    data: agentOptions,
    pending: agentOptionsPending,
    error: agentOptionsError
  } = await trpcClient.config.getAgents.useQuery(undefined, {
    transform: agents => toOptions(agents, 'id', 'name')
  })

  const {
    data: followupTypeOptions,
    pending: followupTypeOptionsPending,
    error: followupTypeOptionsError
  } = await trpcClient.config.getStructureFollowupTypes.useQuery(undefined, {
    transform: followUpTypes => toOptions(followUpTypes, 'id', 'name')
  })

  const pending = computed(
    () => agentOptionsPending.value || followupTypeOptionsPending.value
  )

  const fetchError = computed(() => {
    if (agentOptionsError.value) {
      return "La liste des agents n'a pas pu être chargée."
    }
    if (followupTypeOptionsError.value) {
      return "La liste des types d'accompagnement n'a pas pu être chargée."
    }
    return ''
  })

  const filters = computed<FilterProp[] | null>(() => {
    if (!followupTypeOptions.value || !agentOptions.value) {
      return null
    }

    return [
      {
        name: 'status',
        label: 'Statut',
        options: withEmptyValue(followupStatusOptions, 'Tous les statuts'),
        type: FilterType.SelectOne
      },
      {
        name: 'medium',
        label: "Type d'entretien",
        options: followupMediumOptions,
        type: FilterType.SelectMultiple
      },
      {
        name: 'followupTypes',
        label: "Objet de l'entretien",
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
  })

  function onFilter(filters: FollowupFilterInput) {
    filtersStore.followup = filters
    emit('filter', filters)
  }
</script>
