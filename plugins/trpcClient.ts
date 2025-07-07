import { httpBatchLink, createTRPCNuxtClient } from 'trpc-nuxt/client'
import superjson from 'superjson'
import type { AppRouter } from '~/server/trpc/routers'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const headers = useRequestHeaders()
  const client = createTRPCNuxtClient<AppRouter>({
    links: [
      httpBatchLink({
        url: `${config.public.appUrl}/api/trpc`,
        transformer: superjson,
        headers() {
          // You can add more custom headers here
          return headers
        }
      })
    ]
  })

  return {
    provide: {
      trpcClient: client
    }
  }
})
