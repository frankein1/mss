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
      :initial-selected-values="filtersStore.helpRequest || {}"
      @filter="onFilter"
    />
  </div>
</template>

<script lang="ts" setup>
  import { formatDate } from '~/utils/formatDate'
  import { toOptions, withEmptyValue } from '~/utils/options'
  import { FilterType } from '~/utils/constants/filters'
  import { useAuthStore } from '~/store/auth'
  import { AlertType } from '~~/utils/constants/alert'
  import { HelpRequestFilterInput } from '~/server/schema'
  import { canViewAnyHelpRequestDetails } from '~/server/security/rules'
  import { useFiltersStore } from '~/store/filters'
  import type { FilterProp } from '~/types/filter'
  import { helpRequestFieldLabels } from '~/client/labels'
  import { ministerOptions } from '~/client/options/ministry'

  const authStore = useAuthStore()
  const trpcClient = useTrpcClient()
  const filtersStore = useFiltersStore()
  const isMinistryAgent = useMinistryAgent()
  const { helpRequestStatusOptions } = useHelpRequestStatus()

  const emit = defineEmits<{
    (e: 'filter', filters: HelpRequestFilterInput): void
  }>()

  const {
    data: agentOptions,
    pending: agentOptionsPending,
    error: agentOptionsError
  } = await trpcClient.config.getAgents.useQuery(undefined, {
    transform: agents => toOptions(agents, 'id', 'name')
  })

  // FIXME: For now, trpc-nuxt does not allow to define query key, and their defined key is not based on the transform option
  const {
    data: followupTypeOptions,
    pending: followupTypeOptionsPending,
    error: followupTypeOptionsError
  } = await useAsyncData(
    'config.getStructureFollowupTypes.options',
    () => trpcClient.config.getStructureFollowupTypes.query(),
    {
      transform: followUpTypes => toOptions(followUpTypes, 'id', 'name')
    }
  )

  const {
    data: examinationDateOptions,
    pending: examinationDateOptionsPending,
    error: examinationDateOptionsError
  } = await trpcClient.config.getExaminationDates.useQuery(undefined, {
    transform: examinationDates => {
      return new Map(
        examinationDates.map(({ examinationDate }) => [
          examinationDate.toString(),
          formatDate(examinationDate)
        ])
      )
    }
  })

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
      return "La liste des types d'accompagnement n'a pas pu être chargée."
    }
    if (examinationDateOptionsError.value) {
      return "La liste des dates de passage en commission n'a pas pu être chargée."
    }
    return ''
  })

  const filters = computed<FilterProp[] | null>(() => {
    if (
      !followupTypeOptions.value ||
      !agentOptions.value ||
      !examinationDateOptions.value
    ) {
      return null
    }

    const filters = [
      {
        name: 'status',
        label: helpRequestFieldLabels.status,
        options: withEmptyValue(
          helpRequestStatusOptions.value,
          'Tous les statuts'
        ),
        type: FilterType.SelectOne
      },
      {
        name: 'followupTypes',
        label: helpRequestFieldLabels.typeId,
        options: followupTypeOptions.value,
        type: FilterType.SelectMultiple
      }
    ]
    if (examinationDateOptions.value.size) {
      filters.push({
        name: 'examinationDate',
        label: helpRequestFieldLabels.examinationDate,
        options: withEmptyValue(
          examinationDateOptions.value,
          'Toutes les commissions'
        ),
        type: FilterType.SelectOne
      })
    }

    if (canViewAnyHelpRequestDetails(authStore.getAuthUser)) {
      filters.push(
        {
          name: 'handlingDate',
          label: 'Fin de prise en charge',
          options: new Map([
            ['', 'Non sélectionné'],
            ['true', 'Oui'],
            ['false', 'Non']
          ]),
          type: FilterType.SelectOne
        },
        {
          name: 'externalStructure',
          label: helpRequestFieldLabels.externalStructure,
          options: new Map([
            ['', 'Toutes les instructions'],
            ['false', 'Interne'],
            ['true', 'Organisme externe']
          ]),
          type: FilterType.SelectOne
        }
      )
    }

    filters.push({
      name: 'referents',
      label: 'Référent',
      options: agentOptions.value,
      type: FilterType.SelectMultiple
    })

    if (isMinistryAgent.value) {
      filters.push({
        name: 'ministre',
        label: helpRequestFieldLabels.ministre,
        options: ministerOptions,
        type: FilterType.SelectMultiple
      })
    }

    return filters
  })

  function onFilter(filters: HelpRequestFilterInput) {
    filtersStore.helpRequest = filters
    emit('filter', filters)
  }
</script>
