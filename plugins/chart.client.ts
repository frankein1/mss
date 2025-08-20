import type {
  ChartItem,
  ChartConfiguration,
  ChartConfigurationCustomTypesPerDataset,
  ChartType,
  DefaultDataPoint
} from 'chart.js'
import { ArcElement, Chart, PieController, Tooltip } from 'chart.js'

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
