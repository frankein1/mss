import { publicProcedure, router } from '../trpc'
import { adminLoginSchema } from '~/server/schema'
import {
  loginController,
  getStructuresController
} from '~/server/controller/admin'

export const adminRouter = router({
  login: publicProcedure.input(adminLoginSchema).mutation(loginController),
  getStructures: publicProcedure.query(getStructuresController)
})
