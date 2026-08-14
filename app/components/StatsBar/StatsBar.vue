<template>
  <div class="stats-bar">
    <div
      role="progressbar"
      aria-label="Barre de progression"
      :aria-labelledby="labelledby"
      :style="`width:${getPercentage(count, totalCount)}%;`"
      :aria-valuenow="getPercentage(count, totalCount)"
      aria-valuemin="0"
      aria-valuemax="100"
    ></div>
  </div>
</template>

<script lang="ts" setup>
  import { getPercentage } from '~/utils/stats'

  withDefaults(
    defineProps<{
      count: number
      totalCount: number
      labelledby: string
      color?: string
    }>(),
    {
      color: 'var(--primary)'
    }
  )
</script>

<style lang="scss" scoped>
  @use '~/assets/style/variables' as *;

  .stats-bar {
    $bar-border-radius: 0.25rem;

    background-color: var(--background-alt-grey);
    width: 100%;
    height: 0.5rem;
    border-radius: $bar-border-radius;
    margin-top: 0.25rem;

    > * {
      background-color: v-bind(color);
      height: 100%;
      border-radius: $bar-border-radius;
    }
  }
</style>
