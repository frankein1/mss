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
      v-else-if="followupFilters"
      :filters="followupFilters"
      :initial-selected-values="filtersState.followup.value || {}"
      @filter="onFilter"
    />
  </div>
</template>

<script lang="ts" setup>
  import {
    followupStatusKeys,
    followupMediumKeys,
    periodKeys,
    followupNotFilledKeys,
    ministereDepartmentServiceAcKeys,
    ministereStructureKeys
  } from '~/client/options'
  import { toOptions, withEmptyValue } from '~/utils/options'
  import { FilterType } from '~/utils/constants/filters'
  import { AlertType } from '~/utils/constants/alert'
  import type { FollowupFilterInput } from '~/server/schema'
  import type { FilterProp } from '~/types/filter'
  import { followupFieldLabels, beneficiaryFieldLabels } from '~/client/labels'
  import { EventCategory, FollowupFilterEventAction } from '~/types/matomo'
  import { FollowupPeriodFilter } from '~/types/followup'
  import { formatMinisterName } from '~/utils/minister'

  const props = defineProps<{
    filters: FollowupFilterInput
  }>()

  const trpcClient = useTrpcClient()
  const filtersState = useFilters()
  const { application } = usePermissions()
  const isMinistry = computed(() => application.value.structure.ministryFields)

  const emit = defineEmits<{
    'update:filters': [filters: FollowupFilterInput]
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
  } = await trpcClient.structure.getActiveOrUsedSocialSupportSubjects.useQuery(
    undefined,
    {
      transform: socialSupportSubjects =>
        toOptions(socialSupportSubjects, 'id', 'name'),
      queryKey: 'structure.getActiveOrUsedSocialSupportSubjects.options'
    }
  )

  const pending = computed(
    () => agentOptionsPending.value || socialSupportSubjectOptionsPending.value
  )
  // get Minister list from DB
  const { data: ministers, error: ministersError } = isMinistry.value
    ? await trpcClient.minister.getMinisters.useQuery()
    : { data: null, error: null }

  const ministerOptions = computed(() => {
    if (!ministers?.value) {
      return null
    }
    return ministers.value.map(minister => ({
      label: formatMinisterName(minister),
      value: minister.id
    }))
  })

  const fetchError = computed(() => {
    if (agentOptionsError.value) {
      return "La liste des agents n'a pas pu être chargée."
    }
    if (socialSupportSubjectOptionsError.value) {
      return "La liste des objets d'accompagnement n'a pas pu être chargée."
    }
    if (socialSupportSubjectOptionsError.value) {
      return "La liste des objets d'accompagnement n'a pas pu être chargée."
    }
    if (isMinistry.value && ministersError?.value) {
      return "La liste des ministres n'a pas pu être chargée."
    }
    return ''
  })

  const followupFilters = computed(() => {
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
      },
      {
        name: 'period',
        label: 'Période',
        type: FilterType.SelectOne,
        options: withEmptyValue(periodKeys.options, ''),
        matomoEventCategory: EventCategory.FollowupFilter,
        matomoEventAction: FollowupFilterEventAction.Period
      }
    ]

    if (props.filters.period === FollowupPeriodFilter.Custom) {
      filters.push(
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
      )
    }

    if (application.value.structure.ministryFields) {
      if (ministerOptions.value != null) {
        filters.push({
          name: 'ministerId',
          label: followupFieldLabels.minister,
          options: ministerOptions.value,
          type: FilterType.SelectMultiple,
          matomoEventCategory: EventCategory.FollowupFilter,
          matomoEventAction: FollowupFilterEventAction.Ministre
        })
      }
      filters.push({
        name: 'ministereDepartementServiceAc',
        label: beneficiaryFieldLabels.ministereDepartementServiceAc,
        options: withEmptyValue(ministereDepartmentServiceAcKeys.options),
        type: FilterType.SelectOne,
        alwaysExpanded: false,
        matomoEventCategory: EventCategory.FollowupFilter,
        matomoEventAction:
          FollowupFilterEventAction.MinistereDepartementServiceAc
      })
      filters.push({
        name: 'ministereStructure',
        label: beneficiaryFieldLabels.ministereStructure,
        options: withEmptyValue(ministereStructureKeys.options),
        type: FilterType.SelectOne,
        alwaysExpanded: false,
        matomoEventCategory: EventCategory.FollowupFilter,
        matomoEventAction: FollowupFilterEventAction.MinistereStructure
      })
    }

    filters.push({
      name: 'notFilled',
      label: 'non renseigné',
      options: withEmptyValue(
        followupNotFilledKeys.options,
        'Pas de sélection'
      ),
      type: FilterType.NotFilled,
      alwaysExpanded: true,
      matomoEventCategory: EventCategory.FollowupFilter,
      matomoEventAction: FollowupFilterEventAction.NotFilled
    })

    return filters
  })

  function onFilter(filters: FollowupFilterInput) {
    filtersState.followup.value = filters
    emit('update:filters', filters)
  }
</script>
