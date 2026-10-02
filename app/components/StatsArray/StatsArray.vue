<template>
  <div>
    <div
      id="stats-array-component"
      class="fr-table fr-table--no-caption"
    >
      <div class="fr-table__wrapper">
        <div class="fr-table__container">
          <div class="fr-table__content">
            <table
              :id="STATS_ID"
              :aria-labelledby="caption ? undefined : labelledby || cardTitleId"
            >
              <caption>
                {{
                  caption
                }}
              </caption>
              <thead v-if="headers?.length">
                <tr>
                  <th
                    v-for="(header, index) in headers"
                    :key="index"
                    scope="col"
                  >
                    {{ header }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="([label, ...values], rowIndex) in displayedStatsArray"
                  :key="`${rowIndex}-${label}`"
                >
                  <th scope="row">
                    {{ label }}
                  </th>
                  <td
                    v-for="(value, columnIndex) in values"
                    :key="columnIndex"
                  >
                    <template v-if="value === null">
                      <span aria-hidden="true">-</span>
                      <span class="fr-sr-only">{{ STATS_NULL_LABEL }}</span>
                    </template>
                    <template v-else>
                      {{ toFixed != null ? value.toFixed(toFixed) : value }}
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <button
      v-if="statsArray.length > STATS_COLLAPSED_LIMIT"
      class="fr-btn fr-btn--secondary"
      :class="expandStats ? 'btn-expanded' : 'btn-unexpanded'"
      :aria-expanded="expandStats"
      :aria-controls="STATS_ID"
      @click="expandStats = !expandStats"
    >
      {{ expandBtnLabel }}
    </button>
  </div>
</template>

<script lang="ts" setup>
  import type { StatsArrayPropType } from '~~/types/stat'
  import {
    STATS_COLLAPSED_LIMIT,
    STATS_NULL_LABEL,
    statsCardTitleIdInjectionKey
  } from '~/utils/constants/stats'

  const {
    statsArray,
    caption = undefined,
    labelledby = undefined,
    toFixed = undefined,
    headers = undefined
  } = defineProps<{
    statsArray: StatsArrayPropType
    caption?: string
    labelledby?: string
    toFixed?: number
    headers?: string[]
  }>()

  const STATS_ID = 'stats-' + useId()
  // Tables default to the parent StatsCard title as accessible name
  const cardTitleId = inject(statsCardTitleIdInjectionKey, undefined)
  const expandStats = ref<boolean>(false)

  const displayedStatsArray = computed(() =>
    expandStats.value ? statsArray : statsArray.slice(0, STATS_COLLAPSED_LIMIT)
  )

  const expandBtnLabel = computed(() =>
    expandStats.value ? 'Voir moins' : 'Voir plus'
  )
</script>

<style lang="scss" scoped>
  .fr-table {
    tbody th {
      background-color: var(--background-default-grey);
    }

    tbody td {
      font-weight: normal;
    }
  }
</style>
