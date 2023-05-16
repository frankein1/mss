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
      :initial-selected-values="INITIAL_VALUES"
      @filter="onFilter"
    />
  </div>
</template>

<script lang="ts" setup>
  import {
    followupStatusOptions,
    followupMediumOptions
  } from '~/client/options/followup'
  import { helpRequestStatusOptions } from '~/client/options/helpRequest'
  import { typeSuiviOptions } from '~/client/options/history'
  import { formatDate } from '~/utils/formatDate'
  import {
    // parseKindOfBoolean,
    toOptions,
    withEmptyValue
  } from '~/utils/options'
  import { FilterType } from '~/utils/constants/filters'
  import { useAuthStore } from '~/store/auth'
  import { AlertType } from '~~/utils/constants/alert'
  import { getRandomId } from '~/utils/random'
  import {
    InterviewHistoryFilterRawInput,
    HelpRequestHistoryFilterRawInput,
    BeneficiaryHistoryFilterRawInput
  } from '~/server/schema'
  import { canAccessProtectedDataInHelpRequest } from '~/server/query/security/rules'
  import { useFiltersStore } from '~/store/filters'

  const HANDLING_DATE_NAME = 'handlingDate'
  const STATUS_NAME = 'status'
  const FOLLOW_UP_TYPE_NAME = 'followupTypes'
  const EXTERNAL_STRUCTURE = 'externalStructure'

  const authStore = useAuthStore()
  const user = authStore.getAuthUser
  const trpcClient = useTrpcClient()
  const filtersStore = useFiltersStore()
  const INITIAL_VALUES = getInitialValues()

  const props = defineProps<{
    isInInterviewsContext: boolean
    isInHelpRequestsContext: boolean
  }>()

  const emit = defineEmits<{
    (
      e: 'filter',
      filters:
        | InterviewHistoryFilterRawInput
        | HelpRequestHistoryFilterRawInput
        | BeneficiaryHistoryFilterRawInput
    ): void
  }>()

  const historyType = computed(() => {
    if (props.isInInterviewsContext) return 'followups'
    if (props.isInHelpRequestsContext) return 'helpRequests'
    return ''
  })

  /**
   * NOTE: As BeneficiaryHistoryFilters are used both in InterviewsTable and
   * HelpRequestsTable that are in the same page, the two following asyncData are
   * done simultaneous while fetching the same data. If they use the same
   * async data key, the latter to start falls in an infinte pending state.
   */
  const {
    data: agentOptions,
    pending: agentOptionsPending,
    error: agentOptionsError
  } = useLazyAsyncData(`agentOptions-${historyType.value}`, loadAgentOptions, {
    server: false
  })

  const {
    data: followUpTypeOptions,
    pending: followUpTypeOptionsPending,
    error: followUpTypeOptionsError
  } = useLazyAsyncData(
    `followUpTypeOptions-${historyType.value}`,
    loadFollowUpTypeOptions,
    {
      server: false
    }
  )

  const {
    data: examinationDateOptions,
    pending: examinationDateOptionsPending,
    error: examinationDateOptionsError
  } = useLazyAsyncData(
    getRandomId('examinationDateOptions'),
    loadExaminationDateOptions,
    { server: false }
  )

  const pending = computed(
    () =>
      agentOptionsPending.value ||
      followUpTypeOptionsPending.value ||
      examinationDateOptionsPending.value
  )

  const fetchError = computed(() => {
    if (agentOptionsError.value) {
      return "La liste des agents n'a pas pu être chargée."
    }
    if (followUpTypeOptionsError.value) {
      return "La liste des types d'accompagnement n'a pas pu être chargée."
    }
    if (examinationDateOptionsError.value) {
      return "La liste des dates de passage en commission n'a pas pu être chargée."
    }
    return ''
  })

  const statusOptions = computed(() => {
    if (props.isInInterviewsContext && props.isInHelpRequestsContext) {
      return new Map([
        ...followupStatusOptions.entries(),
        ...helpRequestStatusOptions.entries()
      ])
    }
    return props.isInInterviewsContext
      ? followupStatusOptions
      : helpRequestStatusOptions
  })

  const filters = computed(() => {
    const _filters = [
      {
        name: STATUS_NAME,
        label: 'Statut',
        options: withEmptyValue(statusOptions.value, 'Tous les statuts'),
        type: FilterType.SelectOne,
        isInterviewFilter: props.isInInterviewsContext,
        isHelpRequestFilter: props.isInHelpRequestsContext
      }
    ]
    if (props.isInInterviewsContext && props.isInHelpRequestsContext) {
      _filters.push({
        name: 'typeSuivi',
        label: 'Type de suivi',
        options: withEmptyValue(typeSuiviOptions, 'Tous les suivis'),
        type: FilterType.SelectOne,
        isInterviewFilter: false,
        isHelpRequestFilter: false
      })
    }
    if (props.isInInterviewsContext) {
      _filters.push({
        name: 'medium',
        label: "Type d'entretien",
        options: followupMediumOptions,
        type: FilterType.SelectMultiple,
        isInterviewFilter: true,
        isHelpRequestFilter: false
      })
    }
    if (followUpTypeOptions.value) {
      const followUpTypeLabel =
        props.isInInterviewsContext && !props.isInHelpRequestsContext
          ? "Objet de l'entretien"
          : props.isInHelpRequestsContext && !props.isInInterviewsContext
          ? 'Objet de la demande'
          : "Type d'accompagnement"
      _filters.push({
        name: FOLLOW_UP_TYPE_NAME,
        label: followUpTypeLabel,
        options: followUpTypeOptions.value,
        type: FilterType.SelectMultiple,
        isInterviewFilter: true,
        isHelpRequestFilter: true
      })
    }
    if (
      props.isInHelpRequestsContext &&
      canAccessProtectedDataInHelpRequest(user) &&
      examinationDateOptions.value
    ) {
      _filters.push({
        name: 'examinationDate',
        label: 'Date de passage en commission',
        options: withEmptyValue(
          examinationDateOptions.value,
          'Toutes les commissions'
        ),
        type: FilterType.SelectOne,
        isInterviewFilter: false,
        isHelpRequestFilter: true
      })
    }
    if (
      props.isInHelpRequestsContext &&
      canAccessProtectedDataInHelpRequest(user)
    ) {
      _filters.push(
        {
          name: HANDLING_DATE_NAME,
          label: 'Fin de prise en charge',
          options: new Map([
            ['', 'Non sélectionné'],
            ['true', 'Oui'],
            ['false', 'Non']
          ]),
          type: FilterType.SelectOne,
          isInterviewFilter: false,
          isHelpRequestFilter: true
        },
        {
          name: EXTERNAL_STRUCTURE,
          label: 'Instruction',
          options: new Map([
            ['', 'Toutes les instructions'],
            ['false', 'Interne'],
            ['true', 'Organisme externe']
          ]),
          type: FilterType.SelectOne,
          isInterviewFilter: false,
          isHelpRequestFilter: true
        }
      )
    }
    if (agentOptions.value) {
      _filters.push({
        name: 'referents',
        label: 'Référent',
        options: agentOptions.value,
        type: FilterType.SelectMultiple,
        isInterviewFilter: true,
        isHelpRequestFilter: true
      })
    }

    return _filters
  })

  async function loadAgentOptions() {
    const agents = await trpcClient.config.getAgents.query()
    return toOptions(agents, 'id', 'name')
  }

  async function loadFollowUpTypeOptions() {
    const followUpTypes =
      await trpcClient.config.getStructureFollowupTypes.query()
    return toOptions(followUpTypes, 'id', 'name')
  }

  async function loadExaminationDateOptions() {
    if (
      !props.isInHelpRequestsContext ||
      !canAccessProtectedDataInHelpRequest(user)
    ) {
      return
    }
    const examinationDates = await trpcClient.config.getExaminationDates.query()
    return dateToDateOptions(examinationDates)
  }

  function dateToDateOptions(dates: Array<{ examinationDate: Date }>) {
    return new Map(
      dates.map(d => [
        d.examinationDate.toString(),
        formatDate(d.examinationDate)
      ])
    )
  }

  function onFilter(
    filters:
      | InterviewHistoryFilterRawInput
      | HelpRequestHistoryFilterRawInput
      | BeneficiaryHistoryFilterRawInput
  ) {
    if (props.isInInterviewsContext && !props.isInHelpRequestsContext) {
      filtersStore.interviewHistory = filters
    } else if (props.isInHelpRequestsContext && !props.isInInterviewsContext) {
      filtersStore.helpRequestHistory = filters
    } else {
      filtersStore.beneficiaryHistory = filters
    }
    emit('filter', filters)
  }

  // function prepareFilters(
  //   formData,
  //   isInInterviewsContext,
  //   isInHelpRequestsContext
  // ) {
  //   if (
  //     (isInInterviewsContext && isInHelpRequestsContext) ||
  //     (!isInInterviewsContext && !isInHelpRequestsContext)
  //   ) {
  //     throw new Error(
  //       'History filters must be prepared either for interviews or for help requests'
  //     )
  //   }
  //   return Object.entries(formData).reduce((preparedFilters, [name, value]) => {
  //     if (value) {
  //       const filter = filters.value.find(f => f.name === name)

  //       if (
  //         (filter.isInterviewFilter && isInInterviewsContext) ||
  //         (filter.isHelpRequestFilter && isInHelpRequestsContext)
  //       ) {
  //         if (name === HANDLING_DATE_NAME) {
  //           if (parseKindOfBoolean(value)) {
  //             preparedFilters[name] = { _nnull: true }
  //           } else preparedFilters[name] = { _null: true }
  //         } else if (name === STATUS_NAME) {
  //           const isInterviewStatus = INTERVIEW_STATUS_OPTIONS.has(value)
  //           if (
  //             (isInInterviewsContext && isInterviewStatus) ||
  //             (isInHelpRequestsContext && !isInterviewStatus)
  //           ) {
  //             preparedFilters[name] = { _eq: value }
  //           }
  //         } else if (name === FOLLOW_UP_TYPE_NAME) {
  //           if (isInInterviewsContext) {
  //             preparedFilters.follow_up_types = {
  //               follow_up_types_id: { _in: value }
  //             }
  //           } else preparedFilters.follow_up_type = { _in: value }
  //         } else if (filter.type === FilterType.SelectMultiple) {
  //           preparedFilters[name] = { _in: value }
  //         } else preparedFilters[name] = { _eq: value }
  //       }
  //     }
  //     return preparedFilters
  //   }, {})
  // }

  function getInitialValues() {
    let savedFilters
    if (props.isInInterviewsContext && !props.isInHelpRequestsContext) {
      savedFilters = filtersStore.interviewHistory
    } else if (props.isInHelpRequestsContext && !props.isInInterviewsContext) {
      savedFilters = filtersStore.helpRequestHistory
    } else {
      savedFilters = filtersStore.beneficiaryHistory
    }
    return savedFilters || {}
  }
</script>
