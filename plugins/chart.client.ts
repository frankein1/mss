import {
  ArcElement,
  Chart,
  PieController,
  Tooltip,
  ChartItem,
  ChartConfiguration,
  ChartConfigurationCustomTypesPerDataset,
  ChartType,
  DefaultDataPoint
} from 'chart.js'

export default defineNuxtPlugin(() => {
  Chart.register(ArcElement, PieController, Tooltip)

  return {
    provide: {
      buildChart: (
        item: ChartItem,
        config:
          | ChartConfiguration<ChartType, DefaultDataPoint<ChartType>, unknown>
          | ChartConfigurationCustomTypesPerDataset<
              ChartType,
              DefaultDataPoint<ChartType>,
              unknown
            >
      ) => new Chart(item, config)
    }
  }
})
