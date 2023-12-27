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
      :initial-selected-values="filtersState.helpRequest.value || {}"
      @filter="onFilter"
    />
  </div>
</template>

<script lang="ts" setup>
  import { formatDate } from '~/utils/formatDate'
  import { toOptions, withEmptyValue } from '~/utils/options'
  import { FilterType } from '~/utils/constants/filters'
  import { AlertType } from '~~/utils/constants/alert'
  import { HelpRequestFilterInput } from '~/server/schema'
  import { canViewAnyHelpRequestDetails } from '~/server/security'
  import type { FilterProp } from '~/types/filter'
  import { helpRequestFieldLabels } from '~/client/labels'
  import { ministerOptions } from '~/client/options/ministry'
  import { EventCategory, HelpRequestFilterEventAction } from '~/types/matomo'

  const authState = useAuthState()
  const isMinistryAgent = authState.isMinistryAgent()
  const isReferent = authState.isReferent()
  const trpcClient = useTrpcClient()
  const filtersState = useFilters()
  const { helpRequestStatusOptions } = useHelpRequestStatus()
  const { can } = useSecurityRule()

  const emit = defineEmits<{
    filter: [filters: HelpRequestFilterInput]
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
    data: followupTypeOptions,
    pending: followupTypeOptionsPending,
    error: followupTypeOptionsError
  } = await trpcClient.config.getStructureFollowupTypes.useQuery(undefined, {
    transform: followUpTypes => toOptions(followUpTypes, 'id', 'name'),
    queryKey: 'config.getStructureFollowupTypes.options'
  })

  const {
    data: examinationDateOptions,
    pending: examinationDateOptionsPending,
    error: examinationDateOptionsError
  } = await useAsyncData(loadExaminationDates)

  const pending = computed(
    () =>
      agentOptionsPending.value ||
      followupTypeOptionsPending.value ||
      examinationDateOptionsPending.value
  )

  const fetchError = computed(() => {
    if (agentOptionsError.value) {
      return "La liste des agents n'a pas pu être chargée."
    }
    if (followupTypeOptionsError.value) {
      return "La liste des objets d'accompagnement n'a pas pu être chargée."
    }
    if (examinationDateOptionsError.value) {
      return "La liste des dates de passage en commission n'a pas pu être chargée."
    }
    return ''
  })

  const filters = computed(() => {
    if (
      !followupTypeOptions.value ||
      !agentOptions.value ||
      !examinationDateOptions.value
    ) {
      return null
    }

    const filters: FilterProp[] = [
      {
        name: 'status',
        label: helpRequestFieldLabels.status,
        options: withEmptyValue(
          helpRequestStatusOptions.value,
          'Tous les statuts'
        ),
        type: FilterType.SelectOne,
        matomoEventCategory: EventCategory.HelpRequestFilter,
        matomoEventAction: HelpRequestFilterEventAction.Status
      },
      {
        name: 'followupTypes',
        label: helpRequestFieldLabels.typeId,
        options: followupTypeOptions.value,
        type: FilterType.SelectMultiple,
        matomoEventCategory: EventCategory.HelpRequestFilter,
        matomoEventAction: HelpRequestFilterEventAction.FollowupType
      }
    ]

    if (can(canViewAnyHelpRequestDetails)) {
      if (examinationDateOptions.value.size) {
        filters.push({
          name: 'examinationDate',
          label: helpRequestFieldLabels.examinationDate,
          options: withEmptyValue(
            examinationDateOptions.value,
            'Toutes les commissions'
          ),
          type: FilterType.SelectOne,
          matomoEventCategory: EventCategory.HelpRequestFilter,
          matomoEventAction: HelpRequestFilterEventAction.ExaminationDate
        })
      }

      filters.push(
        {
          name: 'handlingDate',
          label: 'Fin de prise en charge',
          options: new Map([
            ['', 'Non sélectionné'],
            ['true', 'Oui'],
            ['false', 'Non']
          ]),
          type: FilterType.SelectOne,

          matomoEventCategory: EventCategory.HelpRequestFilter,
          matomoEventAction: HelpRequestFilterEventAction.HandlingDate
        },
        {
          name: 'externalStructure',
          label: 'Instruction',
          options: new Map([
            ['', 'Toutes les instructions'],
            ['false', 'Interne'],
            ['true', 'Organisme externe']
          ]),
          type: FilterType.SelectOne,

          matomoEventCategory: EventCategory.HelpRequestFilter,
          matomoEventAction: HelpRequestFilterEventAction.ExternalStructure
        }
      )
    }

    if (!isReferent) {
      filters.push({
        name: 'referents',
        label: 'Référent',
        options: agentOptions.value,
        type: FilterType.SelectMultiple,

        matomoEventCategory: EventCategory.HelpRequestFilter,
        matomoEventAction: HelpRequestFilterEventAction.Referent
      })
    }

    if (isMinistryAgent) {
      filters.push({
        name: 'ministre',
        label: helpRequestFieldLabels.ministre,
        options: ministerOptions,
        type: FilterType.SelectMultiple,
        matomoEventCategory: EventCategory.HelpRequestFilter,
        matomoEventAction: HelpRequestFilterEventAction.Ministre
      })
    }

    return filters
  })

  async function loadExaminationDates() {
    if (!can(canViewAnyHelpRequestDetails)) {
      return new Map()
    }

    const examinationDates = await trpcClient.config.getExaminationDates.query()

    return new Map(
      examinationDates.map(({ examinationDate }) => [
        examinationDate.toString(),
        formatDate(examinationDate)
      ])
    )
  }

  function onFilter(filters: HelpRequestFilterInput) {
    filtersState.helpRequest.value = filters
    emit('filter', filters)
  }
</script>
