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
  import { withEmptyValue } from '~/utils/options'
  import { FilterType } from '~/utils/constants/filters'
  import { AlertType } from '~/utils/constants/alert'
  import type { FamilyFileHistoryFilterInput } from '~/server/schema'
  import type { FilterProp } from '~/types/filter'
  import { typeSuiviKeys, TypeSuivi } from '~/client/options'
  import {
    EventCategory,
    BeneficiaryHistoryFilterEventAction,
    FollowupFilterEventAction
  } from '~/types/matomo'
  import { followupFieldLabels } from '~/client/labels'
  import { formatBeneficiaryShortenedName } from '~/utils/beneficiary/formatBeneficiaryShortenedName'
  import type { BeneficiaryFileIdentification } from '~/types/beneficiary'

  const { familyFileIdentification, values, resultsLabel, deviceNameOptions } =
    defineProps<{
      resultsLabel: string
      values: FamilyFileHistoryFilterInput
      familyFileIdentification: BeneficiaryFileIdentification[]
      deviceNameOptions: string[]
    }>()

  const { socialSupportStatusOptions } = useSocialSupportStatus()

  const emit = defineEmits<{
    'update:values': [filters: FamilyFileHistoryFilterInput]
  }>()

  const { agents, subjects } = inject(
    getStructureInfoInjectionKey
  ) as GetStructureInfo

  const {
    data: agentOptions,
    pending: agentOptionsPending,
    error: agentOptionsError
  } = agents

  const {
    data: socialSupportSubjectOptions,
    pending: socialSupportSubjectOptionsPending,
    error: socialSupportSubjectOptionsError
  } = subjects

  const pending = computed(
    () => agentOptionsPending.value || socialSupportSubjectOptionsPending.value
  )

  const fetchError = computed(() => {
    if (agentOptionsError.value) {
      return "La liste des agents n'a pas pu être chargée."
    }
    if (socialSupportSubjectOptionsError.value) {
      return "La liste des objets d'accompagnement n'a pas pu être chargée."
    }
    return ''
  })

  const typeSuiviValue = computed(() => values.typeSuivi)

  // const isFilteringHelpRequests = computed(
  //   () => !!typeSuiviValue.value && typeSuiviValue.value !== TypeSuivi.Followup
  // )

  const isFilteringHousingHelpRequests = computed(
    () => typeSuiviValue.value === TypeSuivi.HousingHelpRequest
  )

  const beneficiaryOptions = computed(() =>
    familyFileIdentification.map(m => ({
      label: formatBeneficiaryShortenedName(m),
      value: m.id
    }))
  )

  const filters = computed(() => {
    if (
      !socialSupportSubjectOptions.value ||
      !agentOptions.value ||
      !familyFileIdentification
    ) {
      return null
    }

    const maxAlwaysExpandedNb = 3

    const filters: FilterProp[] = [
      {
        name: 'typeSuivi',
        label: "Type d'accompagnement",
        options: withEmptyValue(
          typeSuiviKeys.options,
          'Tous les accompagnements'
        ),
        type: FilterType.SelectOne,
        matomoEventCategory: EventCategory.BeneficiaryHistoryFilter,
        matomoEventAction: BeneficiaryHistoryFilterEventAction.TypeSuivi,
        alwaysExpanded: true
      },
      {
        name: 'status',
        label: followupFieldLabels.status,
        options: withEmptyValue(
          socialSupportStatusOptions.value,
          'Tous les statuts'
        ),
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

    if (deviceNameOptions.length > 0) {
      filters.push({
        name: 'beneficiaryDeviceNames',
        label: 'Dispositif concerné',
        options: deviceNameOptions.map(name => ({ label: name, value: name })),
        type: FilterType.SelectMultiple,
        matomoEventCategory: EventCategory.BeneficiaryHistoryFilter,
        matomoEventAction:
          BeneficiaryHistoryFilterEventAction.SocialSupportSubject,
        alwaysExpanded: filters.length < maxAlwaysExpandedNb
      })
    }

    // if (!isFilteringHelpRequests.value) {
    //   filters.push({
    //     name: 'medium',
    //     label: followupFieldLabels.medium,
    //     options: followupMediumKeys.options,
    //     type: FilterType.SelectMultiple,
    //     alwaysExpanded: filters.length < maxAlwaysExpandedNb,
    //     matomoEventCategory: EventCategory.BeneficiaryHistoryFilter,
    //     matomoEventAction: FollowupFilterEventAction.Medium
    //   })
    // }

    if (familyFileIdentification.length > 1) {
      filters.push({
        name: 'beneficiaryId',
        label: 'Bénéficiaire concerné :',
        options: withEmptyValue(beneficiaryOptions.value, 'Tous'),
        type: FilterType.Radio,
        asTag: true,
        matomoEventCategory: EventCategory.BeneficiaryHistoryFilter,
        matomoEventAction:
          BeneficiaryHistoryFilterEventAction.InvolvedBeneficiary,
        alwaysExpanded: filters.length < maxAlwaysExpandedNb
      })
    }

    return filters
  })
</script>
