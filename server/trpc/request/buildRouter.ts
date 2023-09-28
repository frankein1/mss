import { Request } from './createRequest'
import { appProcedure, router } from '~/server/trpc/createRouter'

export const buildRouter = (requests: Request[]) => {
  const routes: Record<string, any> = {}
  for (const request of requests) {
    if (request.mutation) {
      routes[request.path] = appProcedure
        .input(request.inputValidation)
        .query(request.handler)
    } else {
      routes[request.path] = appProcedure
        .input(request.inputValidation)
        .mutation(request.handler)
    }
  }
  return router(routes)
}
