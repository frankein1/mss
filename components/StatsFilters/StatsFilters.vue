<template>
  <div class="feature-section">
    <AtomLoader
      v-if="!followupTypeOptions || !beneficiariesCitiesOptions"
      class="fr-mx-auto"
    />
    <AtomFilters
      v-else
      :filters="statsFilters"
      :initial-selected-values="initialValues"
      @filter="emit('filter', $event)"
    />
  </div>
</template>

<script setup lang="ts">
  import {
    helpRequestSubjectStatsOptions,
    helpRequestSubjectPictos
  } from '~/client/options/helpRequest'
  import { FilterType } from '~/utils/constants/filters'
  import { Options, withEmptyValue } from '~/utils/options'
  import type { StatFilterInput } from '~/server/schema'
  import type { FilterProp } from '~/types/filter'
  import { beneficiaryStatusOptions } from '~/client/options/beneficiary'

  const { application } = usePermissions()

  const props = withDefaults(
    defineProps<{
      followupTypeOptions: Options
      beneficiariesCitiesOptions: Options
      agentOptions: Options
      isHelpRequestsTab?: boolean
    }>(),
    { isHelpRequestsTab: false }
  )

  const emit = defineEmits<{
    filter: [filters: StatFilterInput]
  }>()

  const initialValues = computed(() => {
    if (props.isHelpRequestsTab) {
      return { helpRequestSubject: '' }
    }
    return undefined
  })

  const statsFilters = computed(() => {
    const filters: FilterProp[] = []
    if (props.isHelpRequestsTab) {
      filters.push({
        name: 'helpRequestSubject',
        label: "Thématique d'instruction",
        options: withEmptyValue(helpRequestSubjectStatsOptions, 'Toutes'),
        type: FilterType.Radio,
        alwaysExpanded: true,
        pictos: helpRequestSubjectPictos
      })
    }
    filters.push({
      name: 'fromDate',
      label: 'Du',
      type: FilterType.Date,
      alwaysExpanded: true
    })
    filters.push({
      name: 'toDate',
      label: 'Au',
      type: FilterType.Date,
      alwaysExpanded: true
    })
    if (props.followupTypeOptions) {
      filters.push({
        name: 'followupTypes',
        label: "Objet de l'accompagnement",
        options: props.followupTypeOptions,
        type: FilterType.SelectMultiple,
        alwaysExpanded: true
      })
    }
    if (props.beneficiariesCitiesOptions) {
      filters.push({
        name: 'cities',
        label: 'Ville',
        options: props.beneficiariesCitiesOptions,
        type: FilterType.SelectMultiple
      })
    }
    if (application.value.module.statsByReferent) {
      filters.push({
        name: 'referent',
        label: 'Référent',
        options: props.agentOptions,
        type: FilterType.SelectOne
      })
    }
    filters.push({
      name: 'beneficiaryStatus',
      label: 'Statut du bénéficiaire',
      options: withEmptyValue(beneficiaryStatusOptions),
      type: FilterType.SelectOne
    })
    return filters
  })
</script>
