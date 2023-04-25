import { getBeneficiaryCountHandler } from '../controller/stat.controller'
import { statFilterSchema } from '../schema/filter.schema'
import { protectedProcedure, router } from '~/server/trpc'

export const statRouter = router({
  getBeneficiaryCount: protectedProcedure
    .input(statFilterSchema)
    .query(getBeneficiaryCountHandler)
})
