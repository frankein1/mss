import { z } from 'zod'
import { createWorkshopSchemaBase } from './createWorkshop.schema'
import { timeGroup } from '~/client/options'

export const updateWorkshopSchema = createWorkshopSchemaBase
  .extend({
    id: z.string().uuid()
  })
  .omit({
    name: true
  })
  .refine(
    data => {
      if (!data.startTime || !data.endTime) {
        return true
      }
      const startIndex = timeGroup.indexOf(data.startTime)
      const endIndex = timeGroup.indexOf(data.endTime)
      return endIndex > startIndex
    },
    {
      message: "L'heure de fin doit être supérieure à l'heure de début",
      path: ['endTime']
    }
  )
  .refine(
    data => {
      if (!data.endTime) {
        return true
      }

      return data.startTime != null
    },
    {
      message: 'Veuillez saisir une heure de début',
      path: ['endTime']
    }
  )

export type UpdateWorkShopInput = z.infer<typeof updateWorkshopSchema>
