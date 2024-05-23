import supertest, { Agent } from 'supertest'
import { defineEventHandler, App, createApp, toNodeListener } from 'h3'
import { describe, test, beforeEach, expect, vi } from 'vitest'
import { signJwt } from '../lib/jwt'
import { createContext } from './createContext'
import { JwtUser } from '~/types/user'
import { fixturesUsers } from '~/prisma/fixtures'

/** Nuxt composables are mocked */
const mockedRuntimeConfig = {
  auth: { jwtKey: 'secretJWT' },
  public: {
    auth: { cookieKey: 'session_token', tokenValidationInMinutes: 30 },
    cguVersion: '1.0'
  }
}
vi.stubGlobal('useRuntimeConfig', () => mockedRuntimeConfig)

let app: App
let request: Agent

/** Inspired from h3 unit tests, we use supertest to generate a custom handler
 * that
 * https://github.com/unjs/h3/blob/main/test/
 */
beforeEach(() => {
  app = createApp({ debug: false })
  request = supertest(toNodeListener(app))

  app.use(
    '/',
    defineEventHandler(async event => await createContext(event))
  )
})

const jwtUser: JwtUser = {
  ...fixturesUsers[3],
  structureId: fixturesUsers[3].structureId || null,
  structureType: 'Ccas',
  CGUHistoryVersion: mockedRuntimeConfig.public.cguVersion
}

describe('trpc context creation', () => {
  test('should not add user to context if no session token is sent', async () => {
    const res = await request.get('/')

    expect(res.statusCode).toBe(200)
    expect(res.body.event).not.toBe(undefined)
    expect(res.body.user).toBe(undefined)
  })

  test('should not add user to context if session token key is incorrect', async () => {
    const sessionToken = signJwt(
      jwtUser,
      mockedRuntimeConfig.auth.jwtKey,
      mockedRuntimeConfig.public.auth.tokenValidationInMinutes
    )

    const res = await request
      .get('/')
      .set('Cookie', [`wrongcookiekey=${sessionToken}`])

    expect(res.statusCode).toBe(200)
    expect(res.body.event).not.toBe(undefined)
    expect(res.body.user).toBe(undefined)
  })

  test('should fail if session token content is incorrect', async () => {
    const res = await request
      .get('/')
      .set('Cookie', [
        `${mockedRuntimeConfig.public.auth.cookieKey}=wrongsessiontoken`
      ])

    expect(res.statusCode).toBe(500)
    expect(res.error).not.toBe(undefined)
  })

  test('should not add user to context if user does not exist', async () => {
    const sessionToken = signJwt(
      {
        ...jwtUser,
        id: '5df231b7-492c-453f-a9fd-629b873abbef'
      },
      mockedRuntimeConfig.auth.jwtKey,
      mockedRuntimeConfig.public.auth.tokenValidationInMinutes
    )

    const res = await request
      .get('/')
      .set('Cookie', [
        `${mockedRuntimeConfig.public.auth.cookieKey}=${sessionToken}`
      ])

    expect(res.statusCode).toBe(200)
    expect(res.body.event).not.toBe(undefined)
    expect(res.body.user).toBe(null)
  })

  test('should add user to context if exist', async () => {
    const sessionToken = signJwt(
      jwtUser,
      mockedRuntimeConfig.auth.jwtKey,
      mockedRuntimeConfig.public.auth.tokenValidationInMinutes
    )

    const res = await request
      .get('/')
      .set('Cookie', [
        `${mockedRuntimeConfig.public.auth.cookieKey}=${sessionToken}`
      ])

    expect(res.statusCode).toBe(200)
    expect(res.body.user.id).toBe(jwtUser.id)
  })
})
