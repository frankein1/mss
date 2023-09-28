import { Request } from './createRequest'
import { protectedProcedure, router } from '~/server/trpc/createRouter'

export const buildRouter = (requests: Request[]) => {
  const routes: Record<string, any> = {}
  for (const request of requests) {
    if (request.mutation) {
      routes[request.path] = protectedProcedure
        .input(request.inputValidation)
        .query(request.handler)
    } else {
      routes[request.path] = protectedProcedure
        .input(request.inputValidation)
        .mutation(request.handler)
    }
  }
  return router(routes)
}
