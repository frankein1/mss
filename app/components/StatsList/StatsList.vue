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
      <tbody>
        <template
          v-for="(
            {
              key,
              label,
              count,
              subCount,
              color,
              picto,
              emphasis,
              description
            },
            index
          ) in displayedStats"
          :key="key"
        >
          <tr>
            <th
              :id="index + STATS_ID"
              class="header-col"
              scope="row"
            >
              <div class="header-content">
                <img
                  v-if="picto"
                  :src="picto"
                  width="48px"
                  alt=""
                />
                <NuxtLink
                  v-if="label === STATS_NULL_LABEL && notFilledRoute"
                  :to="notFilledRoute"
                  >{{ label }}</NuxtLink
                >
                <div v-else>
                  <span :class="{ 'fr-text--bold': emphasis }">{{
                    label
                  }}</span>
                  <template v-if="description">
                    <br />
                    <span class="fr-text--xs text--muted fr-m-0">{{
                      description
                    }}</span>
                  </template>
                </div>
              </div>
            </th>

            <td class="count-col">
              <div
                class="fr-text--bold"
                :class="{ 'fr-h5 fr-mb-0': emphasis }"
                :style="{ color: !statsPercentage ? color : undefined }"
              >
                {{ toFixed != null ? count.toFixed(toFixed) : count
                }}<template v-if="unit">{{ unit }}</template>
              </div>
            </td>

            <td class="percent-col">
              <span
                v-if="statsPercentage"
                :style="{
                  color: !statsColorDot ? color : undefined
                }"
              >
                {{ getPercentage(count, totalCount) }}%
              </span>
              <span
                v-if="statsColorDot"
                class="color-dot"
                :style="{ backgroundColor: color }"
              ></span>
            </td>
          </tr>

          <tr v-if="withSubCount">
            <td
              class="header-col text--muted fr-text--xs fr-mb-0"
              :class="{ 'fr-text--bold': emphasis }"
            >
              {{ subCountLabel }}
            </td>
            <td
              class="count-col text--muted fr-text--xs fr-mb-0"
              :class="{ 'fr-h5 fr-mb-0': emphasis }"
            >
              {{ toFixed != null ? (subCount || 0).toFixed(toFixed) : subCount
              }}<template v-if="unit">{{ unit }}</template>
            </td>
            <td class="percent-col"></td>
          </tr>

          <tr
            v-if="statsBar"
            class="bar-row"
          >
            <td :colspan="withSubCount ? 1 : 3">
              <StatsBar
                :class="{ 'fr-mt-1w': emphasis }"
                :count="
                  withSubCount ? Math.min(subCount || count, count) : count
                "
                :total-count="withSubCount ? subCount || count : totalCount"
                :color="color"
                :labelledby="index + STATS_ID"
              />
            </td>
            <template v-if="withSubCount">
              <td
                class="count-col text--muted fr-text--xs fr-mb-0"
                :class="{ 'fr-h5 fr-mb-0': emphasis }"
              >
                {{ getPercentage(count, subCount || 0) }}%
              </td>
              <td class="percent-col"></td>
            </template>
          </tr>
        </template>
      </tbody>
      <tfoot
        v-if="
          displayTotal &&
          withSum &&
          (stats.length < STATS_COLLAPSED_LIMIT || expandStats)
        "
      >
        <tr>
          <th
            class="header-col"
            scope="row"
          >
            Total
          </th>

          <td class="count-col">
            {{
              sum !== undefined && toFixed != null ? sum.toFixed(toFixed) : sum
            }}<template v-if="unit">{{ unit }}</template>
          </td>

          <td class="percent-col">
            <span v-if="statsPercentage">
              {{ getPercentage(sum || 0, totalCount) }}%
            </span>
            <span
              v-if="statsColorDot"
              class="color-dot color-dot--placeholder"
            ></span>
          </td>
        </tr>
      </tfoot>
    </table>

    <button
      v-if="
        (withSum && stats.length >= STATS_COLLAPSED_LIMIT) ||
        stats.length > STATS_COLLAPSED_LIMIT
      "
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
  import type { StatsListPropType } from '~~/types/stat'
  import {
    STATS_COLLAPSED_LIMIT,
    STATS_NULL_LABEL,
    statsCardTitleIdInjectionKey
  } from '~/utils/constants/stats'
  import { getPercentage } from '~/utils/stats'

  const {
    stats,
    statsBar = false,
    statsPercentage = true,
    statsColorDot = false,
    subCountLabel = undefined,
    totalCount: totalCountFromProps = undefined,
    unit = '',
    toFixed = undefined,
    withSum = true,
    notFilledRoute = undefined,
    displayTotal = true,
    caption = undefined,
    labelledby = undefined
  } = defineProps<{
    stats: StatsListPropType
    statsBar?: boolean
    statsPercentage?: boolean
    statsColorDot?: boolean
    withSubCount?: boolean
    subCountLabel?: string
    totalCount?: number
    unit?: string
    toFixed?: number
    withSum?: boolean
    notFilledRoute?: string
    displayTotal?: boolean
    // Table name, required when several tables share the same StatsCard
    caption?: string
    // Id of a visible heading naming the table, preferred over caption to avoid reading it twice
    labelledby?: string
  }>()

  const STATS_ID = 'stats-' + useId()
  // Tables default to the parent StatsCard title as accessible name
  const cardTitleId = inject(statsCardTitleIdInjectionKey, undefined)
  const expandStats = ref<boolean>(false)
  const totalCount = computed(
    () =>
      totalCountFromProps || stats.reduce((acc, item) => acc + item.count, 0)
  )

  const displayedStats = computed(() =>
    expandStats.value ? stats : stats.slice(0, STATS_COLLAPSED_LIMIT)
  )

  const expandBtnLabel = computed(() =>
    expandStats.value ? 'Voir moins' : 'Voir plus'
  )

  const sum = computed(() =>
    withSum ? stats.reduce((acc, curr) => acc + curr.count, 0) : undefined
  )
</script>

<style lang="scss" scoped>
  @use '~/assets/style/variables' as *;

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

    tfoot {
      th,
      td {
        font-weight: bold;
        padding-top: calc(6px + 0.5rem);
      }
    }

    .header-col {
      width: auto;
      text-align: left;
      word-break: normal;
      overflow-wrap: anywhere;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .percent-col .color-dot {
      margin-left: 0.5rem;
      vertical-align: middle;
    }

    .color-dot--placeholder {
      visibility: hidden;
    }

    .count-col,
    .percent-col {
      // Shrinks to content: 1% is smaller than the content, so the
      // browser falls back to the minimal width without wrapping
      width: 1%;
      white-space: nowrap;
      text-align: right;
    }

    .count-col {
      padding-right: 6px;
    }
  }

  .color-dot {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    border-radius: 100%;
  }
</style>
