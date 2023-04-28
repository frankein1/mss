import {
  getAccommodationModeStatsHandler,
  getAgeStatsHandler,
  getBeneficiaryCountHandler,
  getCSPStatsHandler,
  getFamilyStatsHandler,
  getGenderStatsHandler,
  getMobilityStatsHandler,
  getRegionStatsHandler
} from '../controller/stat.controller'
import { statFilterSchema } from '../schema/filter.schema'
import { protectedProcedure, router } from '~/server/trpc'

export const statRouter = router({
  getAccommodationModeStats: protectedProcedure
    .input(statFilterSchema)
    .query(getAccommodationModeStatsHandler),
  getAgeStats: protectedProcedure
    .input(statFilterSchema)
    .query(getAgeStatsHandler),
  getBeneficiaryCount: protectedProcedure
    .input(statFilterSchema)
    .query(getBeneficiaryCountHandler),
  getCSPStats: protectedProcedure
    .input(statFilterSchema)
    .query(getCSPStatsHandler),
  getFamilyStats: protectedProcedure
    .input(statFilterSchema)
    .query(getFamilyStatsHandler),
  getGenderStats: protectedProcedure
    .input(statFilterSchema)
    .query(getGenderStatsHandler),
  getMobilityStats: protectedProcedure
    .input(statFilterSchema)
    .query(getMobilityStatsHandler),
  getRegionStats: protectedProcedure
    .input(statFilterSchema)
    .query(getRegionStatsHandler)
})
