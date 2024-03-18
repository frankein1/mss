<template>
  <div class="feature-section">
    <AtomLoader
      v-if="!socialSupportSubjectOptions || !beneficiariesCitiesOptions"
      class="fr-mx-auto"
    />
    <AtomFilters
      v-else
      :filters="statsFilters"
      :default-values="defaultValues"
      @filter="emit('update:filters', $event)"
    />
  </div>
</template>

<script setup lang="ts">
  import {
    fileInstructionTypeFilterKeys,
    fileInstructionTypePictos,
    beneficiaryStatusKeys,
    periodOptions
  } from '~/client/options'
  import { FilterType } from '~/utils/constants/filters'
  import { Options, withEmptyValue } from '~/utils/options'
  import type { StatFilterInput } from '~/server/schema'
  import type { FilterProp } from '~/types/filter'
  import { StatPeriodFilter } from '~/types/stat'

  const { application } = usePermissions()

  const props = withDefaults(
    defineProps<{
      socialSupportSubjectOptions: Options
      beneficiariesCitiesOptions: Options
      agentOptions: Options
      filters: StatFilterInput
      isHelpRequestsTab?: boolean
    }>(),
    { isHelpRequestsTab: false }
  )

  const emit = defineEmits<{
    'update:filters': [filters: StatFilterInput]
  }>()

  const defaultValues = computed<StatFilterInput | undefined>(() => {
    if (props.isHelpRequestsTab) {
      return { helpRequestSubject: '' }
    }
    return undefined
  })

  const maxAlwaysExpandedNb = computed(() => (props.isHelpRequestsTab ? 4 : 3))

  const statsFilters = computed(() => {
    const statsFilters: FilterProp[] = []
    if (props.isHelpRequestsTab) {
      statsFilters.push({
        name: 'helpRequestSubject',
        label: "Thématique d'instruction",
        options: withEmptyValue(
          fileInstructionTypeFilterKeys.options,
          'Toutes'
        ),
        type: FilterType.Radio,
        alwaysExpanded: true,
        pictos: fileInstructionTypePictos
      })
    }

    statsFilters.push({
      name: 'period',
      label: 'Période',
      type: FilterType.SelectOne,
      options: withEmptyValue(periodOptions, ''),
      alwaysExpanded: true
    })

    if (props.filters.period === StatPeriodFilter.Custom) {
      statsFilters.push(
        {
          name: 'fromDate',
          label: 'Du',
          type: FilterType.Date,
          alwaysExpanded: true
        },
        {
          name: 'toDate',
          label: 'Au',
          type: FilterType.Date,
          alwaysExpanded: statsFilters.length < maxAlwaysExpandedNb.value
        }
      )
    }

    if (
      props.filters.helpRequestSubject !== 'Housing' &&
      props.socialSupportSubjectOptions.size
    ) {
      statsFilters.push({
        name: 'socialSupportSubjects',
        label: "Objet de l'accompagnement",
        options: props.socialSupportSubjectOptions,
        type: FilterType.SelectMultiple,
        alwaysExpanded: statsFilters.length < maxAlwaysExpandedNb.value
      })
    }
    if (props.beneficiariesCitiesOptions.size) {
      statsFilters.push({
        name: 'cities',
        label: 'Ville',
        options: props.beneficiariesCitiesOptions,
        type: FilterType.SelectMultiple,
        alwaysExpanded: statsFilters.length < maxAlwaysExpandedNb.value
      })
    }
    if (application.value.module.statsByReferent) {
      statsFilters.push({
        name: 'referent',
        label: 'Référent',
        options: props.agentOptions,
        type: FilterType.SelectOne,
        alwaysExpanded: statsFilters.length < maxAlwaysExpandedNb.value
      })
    }
    statsFilters.push({
      name: 'beneficiaryStatus',
      label: 'Statut du bénéficiaire',
      options: withEmptyValue(beneficiaryStatusKeys.options),
      type: FilterType.SelectOne,
      alwaysExpanded: statsFilters.length < maxAlwaysExpandedNb.value
    })
    return statsFilters
  })
</script>
