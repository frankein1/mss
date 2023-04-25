import { createNuxtApiHandler } from 'trpc-nuxt'
import { appRouter } from '~/server/routers'
import { createContext } from '~/server/trpc'

// export API handler
export default createNuxtApiHandler({
  router: appRouter,
  createContext
})
