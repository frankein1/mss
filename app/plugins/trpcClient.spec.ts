// @vitest-environment nuxt
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { getRequestHeaders } from 'h3'
import type { H3Event } from 'h3'
import { fakeRequest, resetFakeRequest } from '~~/test/components/fake-request'
import trpcClientPlugin from './trpcClient'

const trpcHandler = vi.fn()

registerEndpoint('/api/trpc/admin.getOverview', (event: H3Event) => {
  trpcHandler(getRequestHeaders(event))
  return [{ result: { data: { json: null } } }]
})

describe('trpcClient plugin', () => {
  beforeEach(() => {
    trpcHandler.mockReset()
    resetFakeRequest()
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
    // The batch link sends from a setTimeout, outside the plugin's Nuxt context
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
