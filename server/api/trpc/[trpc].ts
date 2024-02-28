import { createNuxtApiHandler } from 'trpc-nuxt'
import { appRouter } from '~/server/trpc/routers'
import { createContext } from '~/server/trpc'

// export API handler
export default createNuxtApiHandler({
  router: appRouter,
  createContext,
  onError({
    error,
    type: _type,
    path: _path,
    input: _input,
    ctx: _ctx,
    req: _req
  }) {
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      throw createError({
        statusCode: 500,
        message: "Si l'erreur persiste, merci de prevenir l'équipe support"
      })
    }
  }
})
