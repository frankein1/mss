<template>
  <div>
    <div class="pie-container">
      <canvas ref="chart">
        <p>{{ pieLabel }}</p>
      </canvas>
    </div>
    <StatsList
      :total-count
      :stats
      stats-color-dot
      :not-filled-route
    />
  </div>
</template>

<script lang="ts" setup>
  import type { Chart, ChartItem } from 'chart.js'
  import type { StatsPiePropType } from '~~/types/stat'

  const { $buildChart } = useNuxtApp()

  const {
    pieLabel,
    stats,
    notFilledRoute = undefined
  } = defineProps<{
    pieLabel: string
    stats: StatsPiePropType
    notFilledRoute?: string
  }>()

  const chart = useTemplateRef('chart')
  let instance: Chart | null = null

  const chartData = computed(() => ({
    labels: stats.map(({ label }) => label),
    datasets: [
      {
        label: pieLabel,
        data: stats.map(({ count }) => count),
        backgroundColor: stats.map(({ color }) => color),
        hoverOffset: 4
      }
    ]
  }))

  const totalCount = computed(() =>
    stats.reduce((acc, item) => acc + item.count, 0)
  )

  function plotChart() {
    if (!chart.value) {
      return null
    }
    return $buildChart(chart.value, {
      type: 'pie',
      options: {
        responsive: true
      },
      data: chartData.value
    })
  }

  onMounted(() => {
    instance = plotChart()
  })

  /* Update chart data when stats change */
  watch(chartData, () => {
    if (instance) {
      instance.data = chartData.value
      instance.update()
    }
  })
</script>

<style lang="scss" scoped>
  .pie-container {
    max-width: 200px;
    max-height: 200px;
    margin: 0 auto;
  }
</style>
