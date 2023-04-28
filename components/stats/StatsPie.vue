<template>
  <div>
    <canvas ref="chart">
      <p>{{ pieLabel }}</p>
    </canvas>
    <StatsList
      :total-count="totalCount"
      :stats="stats"
    />
  </div>
</template>

<script lang="ts" setup>
  import { ChartItem } from 'chart.js'
  import { StatsPie } from '~/types/stat'

  const { $buildChart } = useNuxtApp()

  const props = defineProps<{
    pieLabel: string
    stats: StatsPie
    totalCount: number
  }>()

  const chart = ref<ChartItem>('')

  onMounted(() => {
    plotChart()
  })

  function plotChart() {
    $buildChart(chart.value, {
      type: 'pie',
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
