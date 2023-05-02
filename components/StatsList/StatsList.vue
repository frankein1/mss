<template>
  <div>
    <ul
      :id="STATS_ID"
      class="stats-list"
    >
      <li
        v-for="{ key, label, count, color } in displayedStats"
        :key="key"
        class="stats-entry"
        :class="{ 'with-bar': statsBar, 'with-percentage': statsPercentage }"
      >
        <span>{{ label }}</span>
        <span
          class="fr-text--bold"
          :style="{ color: !statsPercentage ? color : undefined }"
        >
          {{ count }}
        </span>
        <span
          v-if="statsPercentage"
          :style="{ color: color }"
        >
          {{ getPercentage(count) }}%
        </span>
        <div
          v-if="statsBar"
          class="stats-bar"
        >
          <div
            role="progressbar"
            :style="`width:${getPercentage(count)}%;`"
            :aria-valuenow="getPercentage(count)"
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
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
  import { STATS_COLLAPSED_LIMIT } from '~/utils/constants'
  import { getRandomId } from '~/utils/random'

  const props = withDefaults(
    defineProps<{
      stats: StatsListPropType
      statsBar?: boolean
      statsPercentage?: boolean
      totalCount?: number
    }>(),
    {
      statsBar: false,
      statsPercentage: true,
      totalCount: 0
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

  function getPercentage(count: number) {
    return ((count / props.totalCount) * 100).toFixed(1)
  }
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
    column-gap: 0.5rem;
    grid-template-columns: auto max-content;
    grid-template-areas: 'label count';

    > :first-child {
      grid-area: label;
      word-break: break-word;
    }

    > :nth-child(2) {
      grid-area: count;
    }

    > :nth-child(3) {
      grid-area: percentage;
    }

    &.with-percentage {
      grid-template-columns: auto max-content max-content;
      grid-template-areas: 'label count percentage';
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
</style>
