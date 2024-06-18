<template>
  <div>
    <ul
      :id="STATS_ID"
      class="stats-list"
    >
      <li
        v-for="{ key, label, count, color, picto } in displayedStats"
        :key="key"
        class="stats-entry"
        :class="{
          'with-bar': statsBar,
          'with-percentage': statsPercentage,
          'with-color-dot': statsColorDot
        }"
      >
        <div>
          <AtomPictogram
            v-if="picto"
            :path="picto"
            length="3rem"
          />
          <span>{{ label }}</span>
        </div>
        <span
          class="fr-text--bold"
          :style="{ color: !statsPercentage ? color : undefined }"
        >
          {{ toFixed ? count.toFixed(toFixed) : count
          }}<template v-if="unit">{{ unit }}</template>
        </span>
        <span
          v-if="statsPercentage"
          :style="{ color: !statsColorDot ? color : undefined }"
        >
          {{ getPercentage(count, totalCount) }}%
        </span>
        <span
          v-if="statsColorDot"
          class="color-dot"
          :style="{ backgroundColor: color }"
        ></span>
        <div
          v-if="statsBar"
          class="stats-bar"
        >
          <div
            role="progressbar"
            :style="`width:${getPercentage(count, totalCount)}%;`"
            :aria-valuenow="getPercentage(count, totalCount)"
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
      </li>

      <li
        v-if="
          withSum && (stats.length + 1 <= STATS_COLLAPSED_LIMIT || expandStats)
        "
        class="stats-entry fr-text--bold fr-mt-1w"
        :class="{
          'with-bar': statsBar,
          'with-percentage': statsPercentage,
          'with-color-dot': statsColorDot
        }"
      >
        <span>Total</span>

        <span>
          {{ toFixed ? sum.toFixed(toFixed) : sum
          }}<template v-if="unit">{{ unit }}</template>
        </span>

        <span v-if="statsPercentage">
          {{ getPercentage(sum || 0, totalCount) }}%
        </span>
      </li>
    </ul>
    <button
      v-if="stats.length > STATS_COLLAPSED_LIMIT"
      class="fr-btn fr-btn--secondary"
      :aria-expanded="expandStats"
      :aria-controls="STATS_ID"
      @click="expandStats = !expandStats"
    >
      {{ expandBtnLabel }}
    </button>
  </div>
</template>

<script lang="ts" setup>
  import { StatsListPropType } from '~/types/stat'
  import { STATS_COLLAPSED_LIMIT } from '~/utils/constants/stats'
  import { getRandomId } from '~/utils/random'
  import { getPercentage } from '~/utils/stats'

  const props = withDefaults(
    defineProps<{
      stats: StatsListPropType
      statsBar?: boolean
      statsPercentage?: boolean
      statsColorDot?: boolean
      totalCount?: number
      unit?: string
      toFixed?: number
      withSum?: boolean
    }>(),
    {
      statsBar: false,
      statsPercentage: true,
      statsColorDot: false,
      totalCount: 0,
      unit: '',
      toFixed: undefined,
      withSum: true
    }
  )

  const STATS_ID = getRandomId('stats-')
  const expandStats = ref<boolean>(false)

  const displayedStats = computed(() =>
    expandStats.value
      ? props.stats
      : props.stats.slice(0, STATS_COLLAPSED_LIMIT)
  )

  const expandBtnLabel = computed(() =>
    expandStats.value ? 'Voir moins' : 'Voir plus'
  )

  const sum = computed(() =>
    props.withSum
      ? props.stats.reduce((acc, curr) => acc + curr.count, 0)
      : undefined
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
      word-break: break-word;
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
    }

    &.with-percentage.with-color-dot {
      grid-template-columns: auto max-content max-content max-content;
      grid-template-areas: 'label count percentage color-dot';
    }

    &.with-bar {
      grid-template-areas: 'label count percentage' 'bar bar bar';

      > :last-child {
        grid-area: bar;
      }
    }
  }

  .stats-bar {
    $bar-border-radius: 0.25rem;

    background-color: var(--background-alt-grey);
    width: 100%;
    height: 0.5rem;
    border-radius: $bar-border-radius;
    margin-top: 0.25rem;

    > * {
      background: $primary;
      height: 100%;
      border-radius: $bar-border-radius;
    }
  }

  .color-dot {
    width: 1rem;
    height: 1rem;
    border-radius: 100%;
  }
</style>
