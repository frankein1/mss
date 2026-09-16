<template>
  <section class="feature-section">
    <h2 class="fr-sr-only">Filtres</h2>
    <AtomFilters
      :filters="statsFilters"
      :expanded-by-default="true"
      @filter="emit('update:filters', $event)"
    />
  </section>
</template>

<script setup lang="ts">
  import {
    ageGroupKeys,
    beneficiaryStatusKeys,
    periodKeys,
    yesNoOptions,
    AgeGroup
  } from '~~/client/options'
  import { beneficiaryFieldLabels } from '~~/client/labels'
  import { FilterType } from '~/utils/constants/filters'
  import type { Options } from '~/utils/options'
  import { withEmptyValue } from '~/utils/options'
  import type { StatFilterInput } from '~~/server/schema'
  import type { FilterProp } from '~~/types/filter'
  import { StatPeriodFilter } from '~~/types/stat'

  /**
   * Filtres du tableau de bord décideur.
   *
   * Volontairement sans « Référent » ni « Agent » : ces filtres listent des
   * personnes, ce qui est exclu d'un espace sans donnée nominative.
   */
  const props = withDefaults(
    defineProps<{
      filters: StatFilterInput
      structureOptions: Options
      subjectOptions?: Options
    }>(),
    { subjectOptions: () => [] }
  )

  const emit = defineEmits<{
    'update:filters': [filters: StatFilterInput]
  }>()

  const statsFilters = computed(() => {
    const statsFilters: FilterProp[] = [
      {
        name: 'structureIds',
        label: 'Structure',
        type: FilterType.SelectMultiple,
        options: props.structureOptions,
        alwaysExpanded: true
      },
      {
        name: 'period',
        label: 'Période',
        type: FilterType.SelectOne,
        options: withEmptyValue(periodKeys.options, ''),
        alwaysExpanded: true
      }
    ]

    // Aucun objet d'accompagnement configuré dans les structures partagées :
    // le filtre serait vide, on ne l'affiche pas.
    if (props.subjectOptions.length) {
      statsFilters.push({
        name: 'socialSupportSubjectNames',
        label: "Objet de l'accompagnement",
        type: FilterType.SelectMultiple,
        options: props.subjectOptions,
        alwaysExpanded: true
      })
    }

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
          alwaysExpanded: true
        }
      )
    }

    statsFilters.push(
      {
        name: 'beneficiaryStatus',
        label: 'Statut du bénéficiaire',
        type: FilterType.SelectOne,
        options: withEmptyValue(beneficiaryStatusKeys.options),
        alwaysExpanded: true
      },
      {
        name: 'qpv',
        label: beneficiaryFieldLabels.qpv,
        type: FilterType.SelectOne,
        options: withEmptyValue(yesNoOptions, ''),
        alwaysExpanded: false
      },
      {
        name: 'ageGroup',
        label: "Tranche d'âge",
        type: FilterType.SelectOne,
        options: withEmptyValue(
          ageGroupKeys.options,
          "Toutes les tranches d'âge"
        ),
        alwaysExpanded: false
      }
    )

    if (props.filters.ageGroup === AgeGroup.Custom) {
      statsFilters.push(
        {
          name: 'fromAge',
          label: 'De (âge minimum)',
          type: FilterType.Number,
          alwaysExpanded: false
        },
        {
          name: 'toAge',
          label: 'À (âge maximum)',
          type: FilterType.Number,
          alwaysExpanded: false
        }
      )
    }

    return statsFilters
  })
</script>
