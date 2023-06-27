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
      :initial-selected-values="filtersStore.beneficiaryHistory || {}"
      @filter="onFilter"
    />
  </div>
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
  import { helpRequestStatusOptions } from '~/client/options/helpRequest'
  import { typeSuiviOptions } from '~/client/options/history'
  import { canViewAnyHelpRequestDetails } from '~/server/security/rules'
  import { useAuthStore } from '~/store/auth'
  import { formatDate } from '~/utils/formatDate'

  const authStore = useAuthStore()
  const trpcClient = useTrpcClient()
  const filtersStore = useFiltersStore()

  const props = defineProps<{
    beneficiaryId: string
  }>()

  const emit = defineEmits<{
    (e: 'filter', filters: BeneficiaryHistoryFilterInput): void
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
      transform: followupTypes => toOptions(followupTypes, 'id', 'name')
    }
  )

  const {
    data: examinationDateOptions,
    pending: examinationDateOptionsPending,
    error: examinationDateOptionsError
  } = await trpcClient.config.getExaminationDates.useQuery(
    {
      id: props.beneficiaryId
    },
    {
      transform: examinationDates => {
        return new Map(
          examinationDates.map(({ examinationDate }) => [
            examinationDate.toString(),
            formatDate(examinationDate)
          ])
        )
      }
    }
  )

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

  const statusOptions = new Map([
    ...followupStatusOptions,
    ...helpRequestStatusOptions
  ])

  const filters = computed<FilterProp[] | null>(() => {
    if (
      !followupTypeOptions.value ||
      !examinationDateOptions.value ||
      !agentOptions.value
    ) {
      return null
    }

    const filters = [
      {
        name: 'status',
        label: 'Statut',
        options: withEmptyValue(statusOptions, 'Tous les statuts'),
        type: FilterType.SelectOne
      },
      {
        name: 'typeSuivi',
        label: 'Type de suivi',
        options: withEmptyValue(typeSuiviOptions, 'Tous les suivis'),
        type: FilterType.SelectOne
      },
      {
        name: 'medium',
        label: "Type d'entretien",
        options: followupMediumOptions,
        type: FilterType.SelectMultiple
      },
      {
        name: 'followupTypes',
        label: "Type d'accompagnement",
        options: followupTypeOptions.value,
        type: FilterType.SelectMultiple
      }
    ]

    if (examinationDateOptions.value.size) {
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

  function onFilter(filters: BeneficiaryHistoryFilterInput) {
    filtersStore.beneficiaryHistory = filters
    emit('filter', filters)
  }
</script>
