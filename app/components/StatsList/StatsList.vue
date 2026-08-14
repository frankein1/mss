<template>
  <div>
    <ul
      :id="STATS_ID"
      class="stats-list"
    >
      <li
        v-for="(
          { key, label, count, subCount, color, picto, emphasis, description },
          index
        ) in displayedStats"
        :key="key"
        class="stats-entry"
        :class="{
          'with-bar': statsBar,
          'with-percentage': statsPercentage,
          'with-color-dot': statsColorDot,
          'with-sub-count': withSubCount
        }"
      >
        <div :id="index + STATS_ID">
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
            <span :class="{ 'fr-text--bold': emphasis }">{{ label }}</span>
            <template v-if="description">
              <br />
              <span class="fr-text--xs text--muted fr-m-0">{{
                description
              }}</span>
            </template>
          </div>
        </div>
        <div
          class="fr-text--bold"
          :class="{ 'fr-h5 fr-mb-0': emphasis }"
          :style="{ color: !statsPercentage ? color : undefined }"
        >
          {{ toFixed != null ? count.toFixed(toFixed) : count
          }}<template v-if="unit">{{ unit }}</template>
        </div>
        <div
          v-if="statsPercentage"
          :style="{
            color: !statsColorDot ? color : undefined
          }"
        >
          {{ getPercentage(count, totalCount) }}%
        </div>
        <div
          v-if="statsColorDot"
          class="color-dot"
          :style="{ backgroundColor: color }"
        ></div>

        <template v-if="withSubCount">
          <div
            class="text--muted fr-text--xs fr-mb-0"
            :class="{ 'fr-text--bold': emphasis }"
          >
            {{ subCountLabel }}
          </div>
          <div
            class="text--muted fr-text--xs fr-mb-0"
            :class="{ 'fr-h5 fr-mb-0': emphasis }"
          >
            {{ toFixed ? (subCount || 0).toFixed(toFixed) : subCount
            }}<template v-if="unit">{{ unit }}</template>
          </div>
        </template>
        <StatsBar
          v-if="statsBar"
          :class="{ 'fr-mt-1w': emphasis }"
          :count="withSubCount ? Math.min(subCount || count, count) : count"
          :total-count="withSubCount ? subCount || count : totalCount"
          :color="color"
          :labelledby="index + STATS_ID"
        />
        <span
          v-if="withSubCount"
          class="text--muted fr-text--xs fr-mb-0"
          :class="{ 'fr-h5 fr-mb-0': emphasis }"
        >
          {{ getPercentage(count, subCount || 0) }}%
        </span>
      </li>

      <li
        v-if="
          displayTotal &&
          withSum &&
          (stats.length < STATS_COLLAPSED_LIMIT || expandStats)
        "
        class="stats-entry fr-text--bold fr-mt-1w"
        :class="{
          'with-percentage': statsPercentage,
          'with-color-dot': statsColorDot
        }"
      >
        <span>Total</span>

        <span>
          {{ sum !== undefined && toFixed ? sum.toFixed(toFixed) : sum
          }}<template v-if="unit">{{ unit }}</template>
        </span>

        <span v-if="statsPercentage">
          {{ getPercentage(sum || 0, totalCount) }}%
        </span>
      </li>
    </ul>
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
    STATS_NULL_LABEL
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
    displayTotal = true
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
  }>()

  const STATS_ID = 'stats-' + useId()
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

  .stats-list {
    --ul-type: none;
    --ul-start: 0;
  }

  .stats-entry {
    --li-bottom: 0.75rem;

    display: grid;
    align-items: center;
    column-gap: 0.5rem;
    grid-template-columns: auto max-content;
    grid-template-areas: 'label count';

    > :first-child {
      grid-area: label;
      word-break: normal;
      overflow-wrap: anywhere;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    > :nth-child(2) {
      grid-area: count;
    }

    > :nth-child(3) {
      grid-area: percentage;
    }

    > :nth-child(4) {
      grid-area: color-dot;
    }

    &.with-percentage {
      grid-template-columns: auto max-content max-content;
      grid-template-areas: 'label count percentage';

      &.with-bar {
        grid-template-areas: 'label count percentage' 'bar bar bar';
      }
    }

    &.with-percentage.with-color-dot {
      grid-template-columns: auto max-content max-content max-content;
      grid-template-areas: 'label count percentage color-dot';
    }

    &.with-bar {
      grid-template-areas: 'label count' 'bar bar';

      > :last-child {
        grid-area: bar;
      }
    }

    &.with-bar.with-sub-count {
      --li-bottom: 1rem;

      grid-template-columns: auto max-content;
      grid-template-areas: 'label count' 'sublabel subcount' 'bar percentage';
      row-gap: 0.5rem;

      > :nth-child(2) {
        text-align: end;
        min-width: 47px;
      }

      > :nth-child(3) {
        grid-area: sublabel;
      }

      > :nth-child(4) {
        grid-area: subcount;
        text-align: end;
        min-width: 47px;
      }

      > :nth-child(5) {
        grid-area: bar;
      }

      > :last-child {
        grid-area: percentage;
        text-align: end;
      }
    }
  }

  .color-dot {
    width: 1rem;
    height: 1rem;
    border-radius: 100%;
  }
</style>
