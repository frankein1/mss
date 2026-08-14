import { protectedProcedure, router } from '~~/server/trpc'
import { dataEducationRoutes } from '~~/server/route'

export const dataEducationRouter = router({
  searchSchoolCities: protectedProcedure
    .input(dataEducationRoutes.searchSchoolCities.inputValidation)
    .query(dataEducationRoutes.searchSchoolCities.execute),
  searchSchools: protectedProcedure
    .input(dataEducationRoutes.searchSchools.inputValidation)
    .query(dataEducationRoutes.searchSchools.execute)
})
