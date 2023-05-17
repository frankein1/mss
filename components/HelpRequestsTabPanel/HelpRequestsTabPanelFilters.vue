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
  import { helpRequestStatusOptions } from '~/client/options/helpRequest'
  import { formatDate } from '~/utils/formatDate'
  import { toOptions, withEmptyValue } from '~/utils/options'
  import { FilterType } from '~/utils/constants/filters'
  import { useAuthStore } from '~/store/auth'
  import { AlertType } from '~~/utils/constants/alert'
  import { HelpRequestFilterInput } from '~/server/schema'
  import { canAccessProtectedDataInHelpRequest } from '~/server/query/security/rules'
  import { useFiltersStore } from '~/store/filters'
  import { FilterProp } from '~/types/filter'

  const authStore = useAuthStore()
  const user = authStore.getAuthUser
  const trpcClient = useTrpcClient()
  const filtersStore = useFiltersStore()

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

  const {
    data: followupTypeOptions,
    pending: followupTypeOptionsPending,
    error: followupTypeOptionsError
  } = await trpcClient.config.getStructureFollowupTypes.useQuery(undefined, {
    transform: followUpTypes => toOptions(followUpTypes, 'id', 'name')
  })

  const {
    data: examinationDateOptions,
    pending: examinationDateOptionsPending,
    error: examinationDateOptionsError
  } = useAsyncData(loadExaminationDateOptions, {
    transform: exmainationDates => {
      const definedExminiationDates = exmainationDates.filter(
        hasDefinedExaminationDate
      )
      return new Map(
        definedExminiationDates.map(({ examinationDate }) => [
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
    if (!followupTypeOptions.value || !agentOptions.value) {
      return null
    }

    const filters = [
      {
        name: 'status',
        label: 'Statut',
        options: withEmptyValue(helpRequestStatusOptions, 'Tous les statuts'),
        type: FilterType.SelectOne
      },
      {
        name: 'followupTypes',
        label: 'Objet de la demande',
        options: followupTypeOptions.value,
        type: FilterType.SelectMultiple
      }
    ]
    if (
      canAccessProtectedDataInHelpRequest(user) &&
      examinationDateOptions.value
    ) {
      filters.push({
        name: 'examinationDate',
        label: 'Date de passage en commission',
        options: withEmptyValue(
          examinationDateOptions.value,
          'Toutes les commissions'
        ),
        type: FilterType.SelectOne
      })
    }
    if (canAccessProtectedDataInHelpRequest(user)) {
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
          label: 'Instruction',
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

    return filters
  })

  async function loadExaminationDateOptions() {
    if (!canAccessProtectedDataInHelpRequest(user)) {
      return []
    }
    return await trpcClient.config.getExaminationDates.query()
  }

  function onFilter(filters: HelpRequestFilterInput) {
    filtersStore.helpRequest = filters
    emit('filter', filters)
  }

  function hasDefinedExaminationDate(h: {
    examinationDate: Date | null
  }): h is { examinationDate: Date } {
    return h.examinationDate !== null
  }
</script>
