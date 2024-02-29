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
    :results-label="resultsLabel"
    no-margin
    @filter="emit('update:values', $event)"
  />
</template>

<script setup lang="ts">
  import { toOptions, withEmptyValue } from '~/utils/options'
  import { FilterType } from '~/utils/constants/filters'
  import { AlertType } from '~/utils/constants/alert'
  import type { BeneficiaryHistoryFilterInput } from '~/server/schema'
  import type { FilterProp } from '~/types/filter'
  import {
    followupMediumOptions,
    followupStatusOptions,
    typeSuiviOptions,
    TypeSuivi
  } from '~/client/options'
  import { formatDate } from '~/utils/formatDate'
  import {
    EventCategory,
    BeneficiaryHistoryFilterEventAction,
    FollowupFilterEventAction,
    HelpRequestFilterEventAction
  } from '~/types/matomo'
  import { followupFieldLabels, helpRequestFieldLabels } from '~/client/labels'

  const props = defineProps<{
    beneficiaryId: string
    resultsLabel: string
    values: BeneficiaryHistoryFilterInput
  }>()

  const authState = useAuthState()
  const isReferent = authState.isReferent()
  const trpcClient = useTrpcClient()
  const { socialSupportStatusOptions } = useSocialSupportStatus()

  const emit = defineEmits<{
    'update:values': [filters: BeneficiaryHistoryFilterInput]
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

  const { application } = usePermissions()

  const {
    data: examinationDateOptions,
    pending: examinationDateOptionsPending,
    error: examinationDateOptionsError
  } = await useAsyncData(loadExaminationDates)

  const pending = computed(
    () =>
      agentOptionsPending.value ||
      socialSupportSubjectOptionsPending.value ||
      examinationDateOptionsPending.value
  )

  const fetchError = computed(() => {
    if (agentOptionsError.value) {
      return "La liste des agents n'a pas pu être chargée."
    }
    if (socialSupportSubjectOptionsError.value) {
      return "La liste des objets d'accompagnement n'a pas pu être chargée."
    }
    if (examinationDateOptionsError.value) {
      return "La liste des dates de passage en commission n'a pas pu être chargée."
    }
    return ''
  })

  const statusOptions = new Map([
    ...followupStatusOptions,
    ...socialSupportStatusOptions.value
  ])

  const typeSuiviValue = computed(() => props.values.typeSuivi)

  const isFilteringHelpRequests = computed(
    () => !!typeSuiviValue.value && typeSuiviValue.value !== TypeSuivi.Followup
  )

  const isFilteringHousingHelpRequests = computed(
    () => typeSuiviValue.value === TypeSuivi.HousingHelpRequest
  )

  const filters = computed(() => {
    if (
      !socialSupportSubjectOptions.value ||
      !examinationDateOptions.value ||
      !agentOptions.value
    ) {
      return null
    }

    const maxAlwaysExpandedNb = 3

    const filters: FilterProp[] = [
      {
        name: 'typeSuivi',
        label: "Type d'accompagnement",
        options: withEmptyValue(typeSuiviOptions, 'Tous les accompagnements'),
        type: FilterType.SelectOne,
        matomoEventCategory: EventCategory.BeneficiaryHistoryFilter,
        matomoEventAction: BeneficiaryHistoryFilterEventAction.TypeSuivi,
        alwaysExpanded: true
      },
      {
        name: 'status',
        label: followupFieldLabels.status,
        options: withEmptyValue(statusOptions, 'Tous les statuts'),
        type: FilterType.SelectOne,
        matomoEventCategory: EventCategory.BeneficiaryHistoryFilter,
        matomoEventAction: FollowupFilterEventAction.Status,
        alwaysExpanded: true
      }
    ]

    if (!isFilteringHousingHelpRequests.value) {
      filters.push({
        name: 'socialSupportSubjects',
        label: "Objet de l'accompagnement",
        options: socialSupportSubjectOptions.value,
        type: FilterType.SelectMultiple,
        matomoEventCategory: EventCategory.BeneficiaryHistoryFilter,
        matomoEventAction:
          BeneficiaryHistoryFilterEventAction.SocialSupportSubject,
        alwaysExpanded: true
      })
    }

    if (!isFilteringHelpRequests.value) {
      filters.push({
        name: 'medium',
        label: followupFieldLabels.medium,
        options: followupMediumOptions,
        type: FilterType.SelectMultiple,
        alwaysExpanded: filters.length < maxAlwaysExpandedNb,
        matomoEventCategory: EventCategory.BeneficiaryHistoryFilter,
        matomoEventAction: FollowupFilterEventAction.Medium
      })
    }

    if (application.value.module.helpRequest) {
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

      // FIXME: Delete once it is admitted that it is done
      //   filters.push(
      //     {
      //       name: 'handlingDate',
      //       label: helpRequestFieldLabels.handlingDate,
      //       options: new Map([
      //         ['', 'Non sélectionné'],
      //         ['true', 'Oui'],
      //         ['false', 'Non']
      //       ]),
      //       type: FilterType.SelectOne,
      //       matomoEventCategory: EventCategory.BeneficiaryHistoryFilter,
      //       matomoEventAction: HelpRequestFilterEventAction.HandlingDate
      //     },
      //     {
      //       name: 'externalStructure',
      //       label: 'Instruction',
      //       options: new Map([
      //         ['', 'Toutes les instructions'],
      //         ['false', 'Interne'],
      //         ['true', 'Organisme externe']
      //       ]),
      //       type: FilterType.SelectOne,
      //       matomoEventCategory: EventCategory.BeneficiaryHistoryFilter,
      //       matomoEventAction: HelpRequestFilterEventAction.ExternalStructure
      //     }
      //   )
    }

    if (!isReferent) {
      filters.push({
        name: 'referents',
        label: 'Référent',
        options: agentOptions.value,
        type: FilterType.SelectMultiple,
        matomoEventCategory: EventCategory.BeneficiaryHistoryFilter,
        matomoEventAction: FollowupFilterEventAction.Referent,
        alwaysExpanded: filters.length < maxAlwaysExpandedNb
      })
    }

    return filters
  })

  async function loadExaminationDates() {
    if (!application.value.module.helpRequest) {
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
</script>
