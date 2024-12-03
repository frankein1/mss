import { test, expect } from 'vitest'
import { authorize } from './rdvsp-oauth.client'
import { v4 } from 'uuid'

test('Get authorize URL from rdvsp client', async () => {
  const config = {
    clientId: 'test-client-id',
    clientSecret: 'test-client-secret',
    issuer: 'http://demo.rdv.anct.gouv.fr',
    redirectUri: 'http://localhost:3000/callback'
  }
  const state = v4()
  const nonce = v4()

  expect(authorize(config, nonce, state)).toBe(
    `http://demo.rdv.anct.gouv.fr/oauth/authorize?client_id=test-client-id&scope=write&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback&state=${state}&nonce=${nonce}`
  )
})
