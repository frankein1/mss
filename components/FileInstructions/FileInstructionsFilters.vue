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
      v-else-if="fileInstructionsFilters"
      :filters="fileInstructionsFilters"
      :initial-selected-values="filtersState.fileInstruction.value || {}"
      @filter="onFilter"
    />
  </div>
</template>

<script lang="ts" setup>
  import { formatDate } from '~/utils/formatDate'
  import { toOptions, withEmptyValue } from '~/utils/options'
  import { FilterType } from '~/utils/constants/filters'
  import { AlertType } from '~/utils/constants/alert'
  import { FileInstructionFilterInput } from '~/server/schema'
  import type { FilterProp } from '~/types/filter'
  import { helpRequestFieldLabels } from '~/client/labels'
  import { ministerOptions, fileInstructionTypeOptions } from '~/client/options'
  import { EventCategory, HelpRequestFilterEventAction } from '~/types/matomo'

  const authState = useAuthState()
  const isReferent = authState.isReferent()
  const trpcClient = useTrpcClient()
  const filtersState = useFilters()
  const { socialSupportStatusOptions } = useSocialSupportStatus()

  const props = defineProps<{
    filters: FileInstructionFilterInput
  }>()

  const emit = defineEmits<{
    'update:filters': [filters: FileInstructionFilterInput]
  }>()

  const { application } = usePermissions()

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

  const fileInstructionsFilters = computed(() => {
    if (
      !followupTypeOptions.value ||
      !agentOptions.value ||
      !examinationDateOptions.value
    ) {
      return null
    }

    const maxAlwaysExpandedNb = 3

    const fileInstructionsFilters: FilterProp[] = [
      {
        name: 'fileInstructionType',
        label: "Type d'accompagnement",
        options: withEmptyValue(
          fileInstructionTypeOptions,
          "Tous les dossiers d'instruction"
        ),
        type: FilterType.SelectOne,
        matomoEventCategory: EventCategory.HelpRequestFilter,
        matomoEventAction: HelpRequestFilterEventAction.FileInstructionType,
        alwaysExpanded: true
      },
      {
        name: 'status',
        label: helpRequestFieldLabels.status,
        options: withEmptyValue(
          socialSupportStatusOptions.value,
          'Tous les statuts'
        ),
        type: FilterType.SelectOne,
        matomoEventCategory: EventCategory.HelpRequestFilter,
        matomoEventAction: HelpRequestFilterEventAction.Status,
        alwaysExpanded: true
      }
    ]

    if (props.filters.fileInstructionType !== 'Housing') {
      fileInstructionsFilters.push({
        name: 'followupTypes',
        label: helpRequestFieldLabels.typeId,
        options: followupTypeOptions.value,
        type: FilterType.SelectMultiple,
        matomoEventCategory: EventCategory.HelpRequestFilter,
        matomoEventAction: HelpRequestFilterEventAction.FollowupType,
        alwaysExpanded: true
      })
    }

    if (application.value.module.helpRequest) {
      if (examinationDateOptions.value.size) {
        fileInstructionsFilters.push({
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

      // FIXME: Delete once it is admitted that it is done
      //   filters.push(
      //     {
      //       name: 'handlingDate',
      //       label: 'Fin de prise en charge',
      //       options: new Map([
      //         ['', 'Non sélectionné'],
      //         ['true', 'Oui'],
      //         ['false', 'Non']
      //       ]),
      //       type: FilterType.SelectOne,
      //
      //       matomoEventCategory: EventCategory.HelpRequestFilter,
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
      //
      //       matomoEventCategory: EventCategory.HelpRequestFilter,
      //       matomoEventAction: HelpRequestFilterEventAction.ExternalStructure
      //     }
      //   )
    }

    if (!isReferent) {
      fileInstructionsFilters.push({
        name: 'createdById',
        label: 'Agent',
        options: agentOptions.value,
        type: FilterType.SelectMultiple,
        matomoEventCategory: EventCategory.HelpRequestFilter,
        matomoEventAction: HelpRequestFilterEventAction.Agent,
        alwaysExpanded: fileInstructionsFilters.length < maxAlwaysExpandedNb
      })
    }

    if (application.value.module.ministere) {
      fileInstructionsFilters.push({
        name: 'ministre',
        label: helpRequestFieldLabels.ministre,
        options: ministerOptions,
        type: FilterType.SelectMultiple,
        matomoEventCategory: EventCategory.HelpRequestFilter,
        matomoEventAction: HelpRequestFilterEventAction.Ministre
      })
    }

    return fileInstructionsFilters
  })

  async function loadExaminationDates() {
    if (!application.value.module.helpRequest) {
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

  function onFilter(filters: FileInstructionFilterInput) {
    filtersState.fileInstruction.value = filters
    emit('update:filters', filters)
  }
</script>
