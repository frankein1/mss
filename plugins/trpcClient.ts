import { httpBatchLink, createTRPCNuxtClient } from 'trpc-nuxt/client'
import { HttpBatchLinkOptions } from '@trpc/client'
import superjson from 'superjson'
import type { AppRouter } from '~/server/routers'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const options: HttpBatchLinkOptions = {
    url: `${config.public.appUrl}/api/trpc`,
    fetch(url: RequestInfo | URL, options: RequestInit | undefined) {
      return fetch(url, {
        ...options,
        credentials: 'include'
      })
    }
  }
  const client = createTRPCNuxtClient<AppRouter>({
    links: [httpBatchLink(options)],
    transformer: superjson
  })

  return {
    provide: {
      trpcClient: client
    }
  }
})
