import { httpBatchLink, createTRPCNuxtClient } from 'trpc-nuxt/client'
import superjson from 'superjson'
import type { AppRouter } from '~/server/routers'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const headers = useRequestHeaders()
  const client = createTRPCNuxtClient<AppRouter>({
    links: [
      httpBatchLink({
        url: `${config.public.appUrl}/api/trpc`,
        headers() {
          // You can add more custom headers here
          return headers
        }
      })
    ],
    transformer: superjson
  })

  return {
    provide: {
      trpcClient: client
    }
  }
})
