<template>
  <section class="feature-section">
    <h3 class="fr-sr-only">Filtres</h3>
    <AtomLoader
      v-if="!socialSupportSubjectOptions || !beneficiariesCitiesOptions"
      class="fr-mx-auto"
    />
    <AtomAlert
      v-if="isMinistry && ministersError"
      :alert-type="AlertType.Error"
      message="La liste des ministres n'a pas pu être chargée."
    />
    <AtomFilters
      v-else
      :filters="statsFilters"
      :default-values="defaultValues"
      :expanded-by-default="true"
      :validation-schema="validationSchema"
      @filter="emit('update:filters', $event)"
    />
  </section>
</template>

<script setup lang="ts">
  import {
    fileInstructionTypeFilterKeys,
    fileInstructionTypePictos,
    beneficiaryStatusKeys,
    periodKeys,
    ageGroupKeys,
    ministereDepartmentServiceAcKeys,
    ministereStructureKeys,
    AgeGroup
  } from '~/client/options'
  import { FilterType } from '~/utils/constants/filters'
  import type { Options } from '~/utils/options'
  import { withEmptyValue } from '~/utils/options'
  import type { StatFilterInput } from '~/server/schema'
  import type { FilterProp } from '~/types/filter'
  import { StatPeriodFilter } from '~/types/stat'
  import {
    beneficiaryFieldLabels,
    helpRequestFieldLabels
  } from '~/client/labels'
  import { formatMinisterName } from '~/utils/minister'
  import { AlertType } from '~/utils/constants/alert'

  const { application } = usePermissions()
  const trpcClient = useTrpcClient()
  const isMinistry = computed(() => application.value.module.ministere)

  const props = withDefaults(
    defineProps<{
      socialSupportSubjectOptions: Options
      beneficiariesCitiesOptions: Options
      agentOptions: Options
      deviceNameOptions?: Options
      filters: StatFilterInput
      validationSchema?: any
      isHelpRequest?: boolean
      isHistory?: boolean
    }>(),
    {
      isHelpRequest: false,
      isHistory: false,
      validationSchema: undefined,
      deviceNameOptions: () => []
    }
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

  // get Minister list from DB
  const { data: ministers, error: ministersError } = isMinistry.value
    ? await trpcClient.minister.getMinisters.useQuery()
    : { data: null, error: null }

  const ministerOptions = computed(() => {
    if (!ministers?.value) {
      return null
    }
    return ministers.value.map(minister => ({
      label: formatMinisterName(minister),
      value: minister.id
    }))
  })

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
    if (props.deviceNameOptions?.length) {
      statsFilters.push({
        name: 'deviceNameIds',
        label: 'Dispositif',
        options: props.deviceNameOptions,
        type: FilterType.SelectMultiple,
        alwaysExpanded: statsFilters.length < maxAlwaysExpandedNb
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
    if (application.value.module.ministere && ministerOptions.value != null) {
      if (ministerOptions.value != null) {
        statsFilters.push({
          name: 'ministerId',
          label: helpRequestFieldLabels.minister,
          options: ministerOptions.value,
          type: FilterType.SelectMultiple,
          alwaysExpanded: statsFilters.length < maxAlwaysExpandedNb
        })
      }
      statsFilters.push({
        name: 'ministereDepartementServiceAc',
        label: beneficiaryFieldLabels.ministereDepartementServiceAc,
        options: withEmptyValue(ministereDepartmentServiceAcKeys.options),
        type: FilterType.SelectOne,
        alwaysExpanded: statsFilters.length < maxAlwaysExpandedNb
      })
      statsFilters.push({
        name: 'ministereStructure',
        label: beneficiaryFieldLabels.ministereStructure,
        options: withEmptyValue(ministereStructureKeys.options),
        type: FilterType.SelectOne,
        alwaysExpanded: statsFilters.length < maxAlwaysExpandedNb
      })
    }
    statsFilters.push({
      name: 'ageGroup',
      label: "Tranche d'âge",
      options: withEmptyValue(
        ageGroupKeys.options,
        "Toutes les tranches d'âge"
      ),
      type: FilterType.SelectOne,
      alwaysExpanded: statsFilters.length < maxAlwaysExpandedNb
    })

    if (props.filters.ageGroup === AgeGroup.Custom) {
      statsFilters.push(
        {
          name: 'fromAge',
          label: 'De (âge minimum)',
          type: FilterType.Number,
          alwaysExpanded: statsFilters.length < maxAlwaysExpandedNb
        },
        {
          name: 'toAge',
          label: 'À (âge maximum)',
          type: FilterType.Number,
          alwaysExpanded: statsFilters.length < maxAlwaysExpandedNb
        }
      )
    }

    return statsFilters
  })
</script>
