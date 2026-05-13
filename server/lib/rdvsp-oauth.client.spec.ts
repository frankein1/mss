import { test, expect } from 'vitest'
import { authorize } from './rdvsp-oauth.client'
import { randomUUID } from 'node:crypto'

test('Get authorize URL from rdvsp client', async () => {
  const config = {
    clientId: 'test-client-id',
    clientSecret: 'test-client-secret',
    issuer: 'http://demo.rdv.anct.gouv.fr',
    redirectUri: 'http://localhost:3000/callback'
  }
  const state = randomUUID()
  const nonce = randomUUID()

  expect(authorize(config, nonce, state)).toBe(
    `http://demo.rdv.anct.gouv.fr/oauth/authorize?client_id=test-client-id&scope=write&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback&state=${state}&nonce=${nonce}`
  )
})
