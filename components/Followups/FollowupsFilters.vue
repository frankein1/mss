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
      :initial-selected-values="filtersState.followup.value || {}"
      @filter="onFilter"
    />
  </div>
</template>

<script lang="ts" setup>
  import {
    followupStatusKeys,
    followupMediumKeys,
    ministerKeys
  } from '~/client/options'
  import { toOptions, withEmptyValue } from '~/utils/options'
  import { FilterType } from '~/utils/constants/filters'
  import { AlertType } from '~/utils/constants/alert'
  import type { FollowupFilterInput } from '~/server/schema'
  import type { FilterProp } from '~/types/filter'
  import { followupFieldLabels } from '~/client/labels'
  import { EventCategory, FollowupFilterEventAction } from '~/types/matomo'

  const trpcClient = useTrpcClient()
  const filtersState = useFilters()
  const { application } = usePermissions()

  const emit = defineEmits<{
    filter: [filters: FollowupFilterInput]
  }>()

  const {
    data: agentOptions,
    pending: agentOptionsPending,
    error: agentOptionsError
  } = await trpcClient.config.getAgents.useQuery(undefined, {
    transform: agents => toOptions(agents, 'id', 'name'),
    queryKey: 'config.getAgents.options'
  })

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

  const pending = computed(
    () => agentOptionsPending.value || socialSupportSubjectOptionsPending.value
  )

  const fetchError = computed(() => {
    if (agentOptionsError.value) {
      return "La liste des agents n'a pas pu être chargée."
    }
    if (socialSupportSubjectOptionsError.value) {
      return "La liste des objets d'accompagnement n'a pas pu être chargée."
    }
    return ''
  })

  const filters = computed(() => {
    if (!socialSupportSubjectOptions.value || !agentOptions.value) {
      return null
    }

    const filters: FilterProp[] = [
      {
        name: 'status',
        label: followupFieldLabels.status,
        options: withEmptyValue(followupStatusKeys.options, 'Tous les statuts'),
        type: FilterType.SelectOne,
        matomoEventCategory: EventCategory.FollowupFilter,
        matomoEventAction: FollowupFilterEventAction.Status,
        alwaysExpanded: true
      },
      {
        name: 'socialSupportSubjects',
        label: "Objet de l'accompagnement",
        options: socialSupportSubjectOptions.value,
        type: FilterType.SelectMultiple,
        matomoEventCategory: EventCategory.FollowupFilter,
        matomoEventAction: FollowupFilterEventAction.SocialSupportSubject,
        alwaysExpanded: true
      },
      {
        name: 'createdById',
        label: 'Agent',
        options: agentOptions.value,
        type: FilterType.SelectMultiple,
        matomoEventCategory: EventCategory.FollowupFilter,
        matomoEventAction: FollowupFilterEventAction.Agent,
        alwaysExpanded: true
      },
      {
        name: 'medium',
        label: followupFieldLabels.medium,
        options: followupMediumKeys.options,
        type: FilterType.SelectMultiple,
        matomoEventCategory: EventCategory.FollowupFilter,
        matomoEventAction: FollowupFilterEventAction.Medium
      }
    ]

    if (application.value.module.ministere) {
      filters.push({
        name: 'ministre',
        label: followupFieldLabels.ministre,
        options: ministerKeys.options,
        type: FilterType.SelectMultiple,
        matomoEventCategory: EventCategory.FollowupFilter,
        matomoEventAction: FollowupFilterEventAction.Ministre
      })
    }

    return filters
  })

  function onFilter(filters: FollowupFilterInput) {
    filtersState.followup.value = filters
    emit('filter', filters)
  }
</script>
