<template>
  <AtomAlert
    v-if="fetchError"
    class="fr-mb-2w"
    :alert-type="AlertType.Error"
    :message="fetchError"
  />
  <AtomLoader
    v-else-if="pending"
    class="fr-mx-auto"
  />
  <AtomFilters
    :filters="beneficiaryFilters || []"
    :expanded-by-default="true"
    :initial-selected-values="filtersState.beneficiary.value || {}"
    :validation-schema="beneficiaryFilterSchema"
    @filter="onFilter"
  />
</template>

<script lang="ts" setup>
  import { FilterType } from '~/utils/constants/filters'
  import { AlertType } from '~/utils/constants/alert'
  import {
    beneficiaryStatusKeys,
    beneficiaryNotFilledKeys,
    ageGroupKeys,
    yesNoOptions,
    ministereDepartmentServiceAcKeys,
    ministereStructureKeys,
    AgeGroup
  } from '~/client/options'
  import { toOptions, withEmptyValue } from '~/utils/options'
  import {
    beneficiaryFilterSchema,
    type BeneficiaryFilterInput
  } from '~/server/schema'
  import type { FilterProp } from '~/types/filter'
  import { EventCategory, BeneficiaryFilterEventAction } from '~/types/matomo'
  import { beneficiaryFieldLabels } from '~/client/labels'

  const trpcClient = useTrpcClient()
  const hasReferentsFilters = !useAuthState().isReferent()

  const emit = defineEmits<{
    filter: [filters: BeneficiaryFilterInput]
  }>()

  const filtersState = useFilters()
  const { application } = usePermissions()

  const {
    data: socialSupportSubjectOptions,
    pending: socialSupportSubjectOptionsPending,
    error: socialSupportSubjectOptionsError
  } = await trpcClient.structure.getActiveOrUsedSocialSupportSubjects.useQuery(
    undefined,
    {
      transform: socialSupportSubjects =>
        toOptions(socialSupportSubjects, 'id', 'name'),
      queryKey: 'structure.getActiveOrUsedSocialSupportSubjects.options'
    }
  )

  const {
    data: agentOptions,
    pending: agentOptionsPending,
    error: agentOptionsError
  } = await trpcClient.config.getAgents.useQuery(undefined, {
    transform: agents => toOptions(agents, 'id', 'name'),
    queryKey: 'config.getAgents.options'
  })

  const pending = computed(
    () => socialSupportSubjectOptionsPending.value || agentOptionsPending.value
  )

  const fetchError = computed(() => {
    if (socialSupportSubjectOptionsError.value) {
      return "La liste des objets d'accompagnement n'a pas pu être chargée."
    }
    if (agentOptionsError.value) {
      return "La liste des agents n'a pas pu être chargée."
    }
    return ''
  })

  const beneficiaryFilters = computed(() => {
    if (!socialSupportSubjectOptions.value || !agentOptions.value) {
      return null
    }

    const maxAlwaysExpandedNb = 3

    const filters: FilterProp[] = [
      {
        name: 'search',
        label: 'Recherche',
        type: FilterType.Search,
        placeholder: 'Rechercher par nom ou numéro de dossier complet',
        alwaysExpanded: true
      },
      {
        name: 'socialSupportSubjects',
        label: "Objet d'accompagnement",
        options: socialSupportSubjectOptions.value,
        type: FilterType.SelectMultiple,
        alwaysExpanded: true,
        matomoEventCategory: EventCategory.BeneficiaryFilter,
        matomoEventAction: BeneficiaryFilterEventAction.SocialSupportSubject
      }
    ]

    if (hasReferentsFilters) {
      filters.push({
        name: 'referents',
        label: 'Référent',
        options: agentOptions.value,
        type: FilterType.SelectMultiple,
        alwaysExpanded: filters.length < maxAlwaysExpandedNb,
        matomoEventCategory: EventCategory.BeneficiaryFilter,
        matomoEventAction: BeneficiaryFilterEventAction.Referent
      })
    }

    filters.push({
      name: 'status',
      label: 'Statut',
      options: withEmptyValue(
        beneficiaryStatusKeys.options,
        'Tous les statuts'
      ),
      type: FilterType.SelectOne,
      alwaysExpanded: filters.length < maxAlwaysExpandedNb,
      matomoEventCategory: EventCategory.BeneficiaryFilter,
      matomoEventAction: BeneficiaryFilterEventAction.Status
    })

    filters.push({
      name: 'qpv',
      label: 'Quartier prioritaire',
      options: withEmptyValue(yesNoOptions, 'Tous'),
      type: FilterType.SelectOne,
      alwaysExpanded: filters.length < maxAlwaysExpandedNb,
      matomoEventCategory: EventCategory.BeneficiaryFilter,
      matomoEventAction: BeneficiaryFilterEventAction.QPV
    })

    if (application.value.module.vulnerablePerson) {
      filters.push({
        name: 'vulnerablePerson',
        label: beneficiaryFieldLabels.vulnerablePerson,
        options: withEmptyValue(yesNoOptions, 'Tous les bénéficiaires'),
        type: FilterType.SelectOne,
        alwaysExpanded: filters.length < maxAlwaysExpandedNb,
        matomoEventCategory: EventCategory.BeneficiaryFilter,
        matomoEventAction: BeneficiaryFilterEventAction.VulnerablePerson
      })
    }

    if (application.value.module.ministere) {
      filters.push({
        name: 'ministereDepartementServiceAc',
        label: beneficiaryFieldLabels.ministereDepartementServiceAc,
        options: withEmptyValue(ministereDepartmentServiceAcKeys.options),
        type: FilterType.SelectOne,
        alwaysExpanded: filters.length < maxAlwaysExpandedNb,
        matomoEventCategory: EventCategory.BeneficiaryFilter,
        matomoEventAction:
          BeneficiaryFilterEventAction.MinistereDepartementServiceAc
      })
      filters.push({
        name: 'ministereStructure',
        label: beneficiaryFieldLabels.ministereStructure,
        options: withEmptyValue(ministereStructureKeys.options),
        type: FilterType.SelectOne,
        alwaysExpanded: filters.length < maxAlwaysExpandedNb,
        matomoEventCategory: EventCategory.BeneficiaryFilter,
        matomoEventAction: BeneficiaryFilterEventAction.MinistereStructure
      })
    }

    filters.push({
      name: 'ageGroup',
      label: "Tranche d'âge",
      options: withEmptyValue(
        ageGroupKeys.options,
        "Toutes les tranches d'âge"
      ),
      type: FilterType.SelectOne,
      alwaysExpanded: filters.length < maxAlwaysExpandedNb,
      matomoEventCategory: EventCategory.BeneficiaryFilter,
      matomoEventAction: BeneficiaryFilterEventAction.AgeGroup
    })

    if (filtersState.beneficiary.value?.ageGroup === AgeGroup.Custom) {
      filters.push(
        {
          name: 'fromAge',
          label: 'De (âge minimum)',
          type: FilterType.Number,
          alwaysExpanded: filters.length < maxAlwaysExpandedNb
        },
        {
          name: 'toAge',
          label: 'À (âge maximum)',
          type: FilterType.Number,
          alwaysExpanded: filters.length < maxAlwaysExpandedNb
        }
      )
    }

    filters.push({
      name: 'notFilled',
      label: 'non renseigné',
      options: withEmptyValue(
        beneficiaryNotFilledKeys.options,
        'Pas de sélection'
      ),
      type: FilterType.NotFilled,
      alwaysExpanded: true,
      matomoEventCategory: EventCategory.BeneficiaryFilter,
      matomoEventAction: BeneficiaryFilterEventAction.NotFilled
    })

    return filters
  })

  function onFilter(filters: BeneficiaryFilterInput) {
    filtersState.beneficiary.value = filters
    emit('filter', filters)
  }
</script>
