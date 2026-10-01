<template>
  <div>
    <table
      :id="STATS_ID"
      class="stats-table fr-mb-4v"
      :aria-labelledby="caption ? undefined : labelledby || cardTitleId"
    >
      <caption
        v-if="caption"
        class="fr-sr-only"
      >
        {{
          caption
        }}
      </caption>
      <thead v-if="headers?.length">
        <tr>
          <th
            v-for="(header, index) in headers"
            :key="index"
            :class="index === 0 ? 'header-col' : 'count-col'"
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
          <th
            class="header-col"
            scope="row"
          >
            {{ label }}
          </th>
          <td
            v-for="(value, columnIndex) in values"
            :key="columnIndex"
            class="count-col fr-text--bold"
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
  .stats-table {
    width: 100%;
    border-collapse: collapse;

    th,
    td {
      border: none;
      padding: 6px 0;
    }

    th {
      font-weight: normal;
    }

    thead th {
      font-weight: bold;
    }

    .header-col {
      width: auto;
      text-align: left;
      word-break: normal;
      overflow-wrap: anywhere;
    }

    .count-col {
      // Shrinks to content: 1% is smaller than the content, so the
      // browser falls back to the minimal width without wrapping
      width: 1%;
      white-space: nowrap;
      text-align: right;
      padding-left: 1rem;
    }
  }
</style>
