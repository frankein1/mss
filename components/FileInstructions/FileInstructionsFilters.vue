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
  import {
    helpRequestFieldLabels,
    housingHelpRequestFieldLabels
  } from '~/client/labels'
  import {
    ministerKeys,
    fileInstructionTypeFilterKeys,
    roomCountKeys,
    fileInstructionTypePictos
  } from '~/client/options'
  import { EventCategory, HelpRequestFilterEventAction } from '~/types/matomo'

  const props = defineProps<{
    filters: FileInstructionFilterInput
  }>()

  const trpcClient = useTrpcClient()
  const filtersState = useFilters()
  const { fileInstructionStatusOptions } = useSocialSupportStatus()

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

  const fileInstructionsFilters = computed(() => {
    if (
      !socialSupportSubjectOptions.value ||
      !agentOptions.value ||
      !examinationDateOptions.value
    ) {
      return null
    }

    const fileInstructionsFilters: FilterProp[] = [
      {
        name: 'fileInstructionType',
        label: "Thématique d'accompagnement",
        options: withEmptyValue(
          fileInstructionTypeFilterKeys.options,
          'Toutes'
        ),
        type: FilterType.Radio,
        matomoEventCategory: EventCategory.HelpRequestFilter,
        matomoEventAction: HelpRequestFilterEventAction.FileInstructionType,
        alwaysExpanded: true,
        pictos: fileInstructionTypePictos
      }
    ]

    if (props.filters.fileInstructionType !== 'Housing') {
      fileInstructionsFilters.push({
        name: 'socialSupportSubjects',
        label: helpRequestFieldLabels.subjectId,
        options: socialSupportSubjectOptions.value,
        type: FilterType.SelectMultiple,
        matomoEventCategory: EventCategory.HelpRequestFilter,
        matomoEventAction: HelpRequestFilterEventAction.SocialSupportSubject,
        alwaysExpanded: true
      })
    } else {
      fileInstructionsFilters.push({
        name: 'roomCount',
        label: housingHelpRequestFieldLabels.roomCount,
        options: roomCountKeys.options,
        type: FilterType.Radio,
        asTag: true,
        matomoEventCategory: EventCategory.HelpRequestFilter,
        matomoEventAction: HelpRequestFilterEventAction.RoomCount,
        alwaysExpanded: true
      })
    }

    fileInstructionsFilters.push(
      {
        name: 'status',
        label: helpRequestFieldLabels.status,
        options: withEmptyValue(
          fileInstructionStatusOptions.value,
          'Tous les statuts'
        ),
        type: FilterType.SelectOne,
        matomoEventCategory: EventCategory.HelpRequestFilter,
        matomoEventAction: HelpRequestFilterEventAction.Status,
        alwaysExpanded: true
      },
      {
        name: 'createdById',
        label: 'Agent',
        options: agentOptions.value,
        type: FilterType.SelectMultiple,
        matomoEventCategory: EventCategory.HelpRequestFilter,
        matomoEventAction: HelpRequestFilterEventAction.Agent,
        alwaysExpanded: true
      }
    )

    if (
      application.value.module.helpRequest &&
      examinationDateOptions.value.length
    ) {
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

    if (application.value.module.ministere) {
      fileInstructionsFilters.push({
        name: 'ministre',
        label: helpRequestFieldLabels.ministre,
        options: ministerKeys.options,
        type: FilterType.SelectMultiple,
        matomoEventCategory: EventCategory.HelpRequestFilter,
        matomoEventAction: HelpRequestFilterEventAction.Ministre
      })
    }

    return fileInstructionsFilters
  })

  async function loadExaminationDates() {
    if (!application.value.module.helpRequest) {
      return []
    }

    const examinationDates = await trpcClient.config.getExaminationDates.query()

    return examinationDates.map(({ examinationDate }) => ({
      value: examinationDate.toString(),
      label: formatDate(examinationDate)
    }))
  }

  function onFilter(filters: FileInstructionFilterInput) {
    filtersState.fileInstruction.value = filters
    emit('update:filters', filters)
  }
</script>
