import { httpBatchLink, createTRPCNuxtClient } from 'trpc-nuxt/client'
import superjson from 'superjson'
import type { AppRouter } from '~~/server/trpc/routers'
import { splitLink } from '@trpc/client'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const headers = useRequestHeaders()
  const batchLinkOptions = {
    url: `${config.public.appUrl}/api/trpc`,
    transformer: superjson,
    headers() {
      // You can add more custom headers here
      return headers
    }
  }
  const client = createTRPCNuxtClient<AppRouter>({
    links: [
      splitLink({
        condition(operation) {
          // Stats queries should always use POST to avoid URL length issues, when using a lot of filters
          const shouldUsePOST =
            operation.type === 'query' && operation.path.startsWith('stat.')
          return shouldUsePOST
        },
        // force POST method
        true: httpBatchLink({ ...batchLinkOptions, methodOverride: 'POST' }),
        // regular requests
        false: httpBatchLink(batchLinkOptions)
      })
    ]
  })

  return {
    provide: {
      trpcClient: client
    }
  }
})
