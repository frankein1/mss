// @vitest-environment nuxt
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport, registerEndpoint } from '@nuxt/test-utils/runtime'
import { getRequestHeaders } from 'h3'
import type { H3Event } from 'h3'
import trpcClientPlugin from './trpcClient'

const { fakeRequest } = vi.hoisted(() => ({
  fakeRequest: {
    headers: {} as Record<string, string>,
    // The batch link sends from a setTimeout, outside the plugin's Nuxt context
    nuxtContextLost: false
  }
}))

mockNuxtImport('useRequestHeaders', () => (include?: string[]) => {
  if (fakeRequest.nuxtContextLost) {
    throw new Error('[nuxt] instance unavailable')
  }
  return Object.fromEntries(
    Object.entries(fakeRequest.headers).filter(
      ([key]) => !include || include.includes(key)
    )
  )
})

const trpcHandler = vi.fn()

registerEndpoint('/api/trpc/admin.getOverview', (event: H3Event) => {
  trpcHandler(getRequestHeaders(event))
  return [{ result: { data: { json: null } } }]
})

describe('trpcClient plugin', () => {
  beforeEach(() => {
    trpcHandler.mockReset()
    fakeRequest.headers = {}
    fakeRequest.nuxtContextLost = false
  })

  it('forwards the allowlisted headers read at plugin setup, not at send time', async () => {
    fakeRequest.headers = {
      'cookie': 'MSS_SESSION_TOKEN=token',
      'x-real-ip': '192.0.2.1',
      'x-request-id': 'request-id',
      'host': 'monsuivisocial.example',
      'content-length': '42'
    }
    const setup = await trpcClientPlugin(useNuxtApp())
    fakeRequest.nuxtContextLost = true

    await setup?.provide?.trpcClient.admin.getOverview.query()

    expect(trpcHandler).toHaveBeenCalledOnce()
    const forwarded = trpcHandler.mock.calls[0]![0]
    expect(forwarded).toMatchObject({
      'cookie': 'MSS_SESSION_TOKEN=token',
      'x-real-ip': '192.0.2.1',
      'x-request-id': 'request-id'
    })
    expect(forwarded).not.toHaveProperty('content-length')
  })
})
