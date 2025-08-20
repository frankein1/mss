import type { RouterOutput } from '~/server/trpc/routers'

export enum FileInstructionPeriodFilter {
  ThisYear = 'ThisYear',
  LastYear = 'LastYear',
  ThisMonth = 'ThisMonth',
  LastMonth = 'LastMonth',
  Custom = 'Custom'
}

export type HistoryCounts = RouterOutput['stat']['getHistoryCounts']
