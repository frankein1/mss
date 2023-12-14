<template>
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
    :initial-selected-values="filtersStore.beneficiaryHistory || {}"
    :results-label="resultsLabel"
    no-margin
    @filter="onFilter"
  />
</template>

<script setup lang="ts">
  import { toOptions, withEmptyValue } from '~/utils/options'
  import { FilterType } from '~/utils/constants/filters'
  import { AlertType } from '~~/utils/constants/alert'
  import { useFiltersStore } from '~/store/filters'
  import type { BeneficiaryHistoryFilterInput } from '~/server/schema'
  import type { FilterProp } from '~/types/filter'
  import {
    followupMediumOptions,
    followupStatusOptions
  } from '~/client/options/followup'
  import { typeSuiviOptions } from '~/client/options/history'
  import { isReferent } from '~/server/security'
  import { formatDate } from '~/utils/formatDate'
  import {
    EventCategory,
    BeneficiaryHistoryFilterEventAction,
    FollowupFilterEventAction,
    HelpRequestFilterEventAction
  } from '~/types/matomo'
  import { followupFieldLabels, helpRequestFieldLabels } from '~/client/labels'

  const { user } = useAuth()
  const trpcClient = useTrpcClient()
  const filtersStore = useFiltersStore()
  const { helpRequestStatusOptions } = useHelpRequestStatus()

  const props = defineProps<{
    beneficiaryId: string
    resultsLabel: string
  }>()

  const emit = defineEmits<{
    filter: [filters: BeneficiaryHistoryFilterInput]
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
    transform: followupTypes => toOptions(followupTypes, 'id', 'name'),
    queryKey: 'config.getStructureFollowupTypes.options'
  })

  const { data: permissions } =
    await useTrpcClient().permissions.getHelpRequestEditionPermissions.useQuery()

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

  const statusOptions = new Map([
    ...followupStatusOptions,
    ...helpRequestStatusOptions.value
  ])

  const filters = computed(() => {
    if (
      !followupTypeOptions.value ||
      !examinationDateOptions.value ||
      !agentOptions.value
    ) {
      return null
    }

    const filters: FilterProp[] = [
      {
        name: 'status',
        label: followupFieldLabels.status,
        options: withEmptyValue(statusOptions, 'Tous les statuts'),
        type: FilterType.SelectOne,
        matomoEventCategory: EventCategory.BeneficiaryHistoryFilter,
        matomoEventAction: FollowupFilterEventAction.Status
      },
      {
        name: 'typeSuivi',
        label: "Type d'accompagnement",
        options: withEmptyValue(typeSuiviOptions, 'Tous les suivis'),
        type: FilterType.SelectOne,
        matomoEventCategory: EventCategory.BeneficiaryHistoryFilter,
        matomoEventAction: BeneficiaryHistoryFilterEventAction.TypeSuivi
      },
      {
        name: 'medium',
        label: followupFieldLabels.medium,
        options: followupMediumOptions,
        type: FilterType.SelectMultiple,
        matomoEventCategory: EventCategory.BeneficiaryHistoryFilter,
        matomoEventAction: FollowupFilterEventAction.Medium
      },
      {
        name: 'followupTypes',
        label: "Objet de l'accompagnement",
        options: followupTypeOptions.value,
        type: FilterType.SelectMultiple,
        matomoEventCategory: EventCategory.BeneficiaryHistoryFilter,
        matomoEventAction: BeneficiaryHistoryFilterEventAction.FollowupType
      }
    ]

    if (permissions.value?.get.anyExaminationDate) {
      if (examinationDateOptions.value.size) {
        filters.push({
          name: 'examinationDate',
          label: helpRequestFieldLabels.examinationDate,
          options: withEmptyValue(
            examinationDateOptions.value,
            'Toutes les commissions'
          ),
          type: FilterType.SelectOne,
          matomoEventCategory: EventCategory.BeneficiaryHistoryFilter,
          matomoEventAction: HelpRequestFilterEventAction.ExaminationDate
        })
      }

      filters.push(
        {
          name: 'handlingDate',
          label: helpRequestFieldLabels.handlingDate,
          options: new Map([
            ['', 'Non sélectionné'],
            ['true', 'Oui'],
            ['false', 'Non']
          ]),
          type: FilterType.SelectOne,
          matomoEventCategory: EventCategory.BeneficiaryHistoryFilter,
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
          matomoEventCategory: EventCategory.BeneficiaryHistoryFilter,
          matomoEventAction: HelpRequestFilterEventAction.ExternalStructure
        }
      )
    }

    if (!isReferent(user.value)) {
      filters.push({
        name: 'referents',
        label: 'Référent',
        options: agentOptions.value,
        type: FilterType.SelectMultiple,
        matomoEventCategory: EventCategory.BeneficiaryHistoryFilter,
        matomoEventAction: FollowupFilterEventAction.Referent
      })
    }

    return filters
  })

  async function loadExaminationDates() {
    if (!permissions.value?.get.anyExaminationDate) {
      return new Map()
    }

    const examinationDates = await trpcClient.config.getExaminationDates.query({
      id: props.beneficiaryId
    })

    return new Map(
      examinationDates.map(({ examinationDate }) => [
        examinationDate.toString(),
        formatDate(examinationDate)
      ])
    )
  }

  function onFilter(filters: BeneficiaryHistoryFilterInput) {
    filtersStore.beneficiaryHistory = filters
    emit('filter', filters)
  }
</script>
