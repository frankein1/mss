// @vitest-environment nuxt
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport, registerEndpoint } from '@nuxt/test-utils/runtime'
import { getRequestHeaders } from 'h3'
import type { H3Event } from 'h3'
import { ref } from 'vue'
import { useAuth } from './useAuth'

const SESSION_COOKIE = 'MSS_SESSION_TOKEN=token'

const { fakeRequest } = vi.hoisted(() => ({
  fakeRequest: {
    // Undefined on the client, the H3 event during SSR
    event: undefined as object | undefined,
    headers: {} as Record<string, string>,
    sessionCookie: undefined as string | undefined
  }
}))

mockNuxtImport('useRequestEvent', () => () => fakeRequest.event)

mockNuxtImport(
  'useRequestHeaders',
  () => (include: string[]) =>
    Object.fromEntries(
      Object.entries(fakeRequest.headers).filter(([key]) =>
        include.includes(key)
      )
    )
)

mockNuxtImport('useCookie', () => () => ref(fakeRequest.sessionCookie))

const getSessionHandler = vi.fn()

registerEndpoint('/api/auth/get-session', (event: H3Event) =>
  getSessionHandler(getRequestHeaders(event))
)

function simulateSsrRequest(headers: Record<string, string>) {
  fakeRequest.event = {}
  fakeRequest.headers = headers
  fakeRequest.sessionCookie = headers.cookie ? 'token' : undefined
}

describe('useAuth getSession', () => {
  beforeEach(() => {
    getSessionHandler.mockReset().mockReturnValue(null)
    fakeRequest.event = undefined
    fakeRequest.headers = {}
    fakeRequest.sessionCookie = undefined
  })

  it('makes no call during SSR without the session cookie', async () => {
    simulateSsrRequest({ 'x-real-ip': '192.0.2.1' })

    await useAuth().getSession()

    expect(getSessionHandler).not.toHaveBeenCalled()
  })

  it('forwards the session cookie and x-real-ip during SSR', async () => {
    simulateSsrRequest({
      'cookie': SESSION_COOKIE,
      'x-real-ip': '192.0.2.1',
      'host': 'monsuivisocial.example',
      'content-length': '42'
    })

    await useAuth().getSession()

    expect(getSessionHandler).toHaveBeenCalledOnce()
    const forwarded = getSessionHandler.mock.calls[0]![0]
    expect(forwarded).toMatchObject({
      'cookie': SESSION_COOKIE,
      'x-real-ip': '192.0.2.1'
    })
    expect(forwarded).not.toHaveProperty('content-length')
  })

  it('still calls get-session on the client, where the httpOnly cookie is unreadable', async () => {
    await useAuth().getSession()

    expect(getSessionHandler).toHaveBeenCalledOnce()
  })

  it('stores the session user', async () => {
    simulateSsrRequest({ cookie: SESSION_COOKIE })
    const user = { id: 'user-id', firstName: 'Jeanne' }
    getSessionHandler.mockReturnValue({ user, permissions: {} })

    await useAuth().getSession()

    expect(useAuthState().user.value).toEqual(user)
  })
})
