import { z } from 'zod'
import { paginatedSchema } from '../helpers.schema'
import { exportHelpRequestsSchema } from './exportHelpRequest.schema'

export const getHelpRequestsSchema =
  exportHelpRequestsSchema.merge(paginatedSchema)

export type GetHelpRequestsInput = z.infer<typeof getHelpRequestsSchema>

export type GetHelpRequestsInputOrderBy = GetHelpRequestsInput['orderBy']
