<template>
  <div>
    <div class="pie-container">
      <canvas ref="chart">
        <p>{{ pieLabel }}</p>
      </canvas>
    </div>
    <StatsList
      :total-count="totalCount"
      :stats="stats"
      stats-color-dot
      :not-filled-route="notFilledRoute"
    />
  </div>
</template>

<script lang="ts" setup>
  import { ChartItem } from 'chart.js'
  import { StatsPiePropType } from '~/types/stat'

  const { $buildChart } = useNuxtApp()

  const props = defineProps<{
    pieLabel: string
    stats: StatsPiePropType
    totalCount: number
    notFilledRoute?: string
  }>()

  const chart = ref<ChartItem>('')

  onMounted(() => {
    plotChart()
  })

  function plotChart() {
    $buildChart(chart.value, {
      type: 'pie',
      options: {
        responsive: false
      },
      data: {
        labels: props.stats.map(({ label }) => label),
        datasets: [
          {
            label: props.pieLabel,
            data: props.stats.map(({ count }) => count),
            backgroundColor: props.stats.map(({ color }) => color),
            hoverOffset: 4
          }
        ]
      }
    })
  }
</script>

<style lang="scss" scoped>
  .pie-container {
    max-width: 200px;
    max-height: 200px;
    margin: 0 auto;
  }
</style>
