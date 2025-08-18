import { z } from 'zod'
import { FilterWorkshopTimeDirection } from '~/utils/constants/filters'
import { withEmptyValueOptionalNativeEnum } from '../helpers.schema'
import { WorkshopPeriodFilter } from '~/types/workshop'

export const getWorkshopListSchema = z.object({
  filter: z.object({
    timeDirection: z.nativeEnum(FilterWorkshopTimeDirection).optional(),
    workshopNameIds: z.array(z.string().uuid()).optional(),
    period: withEmptyValueOptionalNativeEnum(WorkshopPeriodFilter),
    fromDate: z.coerce.date().optional(),
    toDate: z.coerce.date().optional()
  }),
  perPage: z.number(),
  page: z.number()
})

export type GetWorkshopListInput = z.infer<typeof getWorkshopListSchema>
