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
    periodKeys,
    ministerKeys
  } from '~/client/options'
  import { FilterType } from '~/utils/constants/filters'
  import { Options, withEmptyValue } from '~/utils/options'
  import type { StatFilterInput } from '~/server/schema'
  import type { FilterProp } from '~/types/filter'
  import { StatPeriodFilter } from '~/types/stat'
  import { helpRequestFieldLabels } from '~/client/labels'

  const { application } = usePermissions()

  const props = withDefaults(
    defineProps<{
      socialSupportSubjectOptions: Options
      beneficiariesCitiesOptions: Options
      agentOptions: Options
      filters: StatFilterInput
      isHelpRequest?: boolean
      isHistory?: boolean
    }>(),
    { isHelpRequest: false, isHistory: false }
  )

  const emit = defineEmits<{
    'update:filters': [filters: StatFilterInput]
  }>()

  const defaultValues = computed<StatFilterInput | undefined>(() => {
    if (props.isHelpRequest) {
      return { helpRequestSubject: '' }
    }
    return undefined
  })

  const maxAlwaysExpandedNb = 4

  const agentOptionsWithEmptyValue = computed(() => [
    { value: '', label: '' },
    ...props.agentOptions
  ])

  const statsFilters = computed(() => {
    const statsFilters: FilterProp[] = [
      {
        name: 'helpRequestSubject',
        label: "Thématique d'instruction",
        options: withEmptyValue(
          fileInstructionTypeFilterKeys.options,
          'Toutes'
        ),
        type: FilterType.Radio,
        alwaysExpanded: true,
        pictos: fileInstructionTypePictos,
        disabled: !props.isHelpRequest
      },
      {
        name: 'period',
        label: 'Période',
        type: FilterType.SelectOne,
        options: withEmptyValue(periodKeys.options, ''),
        alwaysExpanded: true
      }
    ]

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
          alwaysExpanded: statsFilters.length < maxAlwaysExpandedNb
        }
      )
    }

    if (props.socialSupportSubjectOptions.length) {
      statsFilters.push({
        name: 'socialSupportSubjects',
        label: "Objet de l'accompagnement",
        options: props.socialSupportSubjectOptions,
        type: FilterType.SelectMultiple,
        alwaysExpanded: statsFilters.length < maxAlwaysExpandedNb,
        disabled: props.filters.helpRequestSubject === 'Housing'
      })
    }
    if (props.beneficiariesCitiesOptions.length) {
      statsFilters.push({
        name: 'cities',
        label: 'Ville',
        options: props.beneficiariesCitiesOptions,
        type: FilterType.SelectMultiple,
        alwaysExpanded: statsFilters.length < maxAlwaysExpandedNb
      })
    }
    if (application.value.module.statsByReferent && !props.isHistory) {
      statsFilters.push({
        name: 'referent',
        label: 'Référent',
        options: agentOptionsWithEmptyValue.value,
        type: FilterType.SelectOne,
        alwaysExpanded: statsFilters.length < maxAlwaysExpandedNb
      })
    }
    statsFilters.push({
      name: 'beneficiaryStatus',
      label: 'Statut du bénéficiaire',
      options: withEmptyValue(beneficiaryStatusKeys.options),
      type: FilterType.SelectOne,
      alwaysExpanded: statsFilters.length < maxAlwaysExpandedNb
    })
    if (props.isHistory) {
      statsFilters.push({
        name: 'createdById',
        label: 'Agent',
        options: props.agentOptions,
        type: FilterType.SelectMultiple,
        alwaysExpanded: statsFilters.length < maxAlwaysExpandedNb
      })
    }
    if (application.value.module.ministere && props.isHistory) {
      statsFilters.push({
        name: 'ministre',
        label: helpRequestFieldLabels.ministre,
        options: ministerKeys.options,
        type: FilterType.SelectMultiple,
        alwaysExpanded: statsFilters.length < maxAlwaysExpandedNb
      })
    }
    return statsFilters
  })
</script>
