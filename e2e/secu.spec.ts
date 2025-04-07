import { test, expect } from '@playwright/test'

test.describe.skip('[nuxt-security]', async () => {
  test.use({ storageState: 'playwright/.auth/structure-manager.json' })

  test('[nuxt-security] Default Headers', async ({ page }) => {
    const response = await page.goto(
      'https://monsuivisocial-app.dev.incubateur.anct.gouv.fr/app/overview'
    )

    expect(response, 'could not access page').toBeTruthy()

    if (!response) {
      return
    }
    const headers = await response.allHeaders()

    const cspHeaderValue = headers['content-security-policy']
    const nonceValue = cspHeaderValue?.match(/'nonce-(.*?)'/)?.[1]
    expect(cspHeaderValue).toBeTruthy()
    expect(cspHeaderValue).toBe(
      `base-uri 'none'; font-src 'self' https: data:; form-action 'self'; frame-ancestors 'self'; img-src 'self' data:; object-src 'none'; script-src-attr 'none'; style-src 'self' https: 'unsafe-inline'; script-src 'self' https: 'unsafe-inline' 'strict-dynamic' 'nonce-${nonceValue}'; upgrade-insecure-requests; connect-src 'self' https://api-adresse.data.gouv.fr https://geo.api.gouv.fr https://matomo.dev.incubateur.anct.gouv.fr https://matomo.incubateur.anct.gouv.fr https://sentry.incubateur.net https://conversations-widget.brevo.com/;`
    )
    expect(nonceValue).toBeTruthy()
    expect(nonceValue).toHaveLength(24)

    const coepHeaderValue = headers['cross-origin-embedder-policy']
    expect.soft(coepHeaderValue).toBeUndefined()

    const corpHeaderValue = headers['cross-origin-resource-policy']
    expect.soft(corpHeaderValue).toBeTruthy()
    expect.soft(corpHeaderValue).toBe('same-origin')

    const oacHeaderValue = headers['origin-agent-cluster']
    expect.soft(oacHeaderValue).toBeTruthy()
    expect.soft(oacHeaderValue).toBe('?1')

    const ppHeaderValue = headers['permissions-policy']
    expect.soft(ppHeaderValue).toBeTruthy()
    expect
      .soft(ppHeaderValue)
      .toBe(
        'camera=(), display-capture=(), fullscreen=(), geolocation=(), microphone=()'
      )

    const rpHeaderValue = headers['referrer-policy']
    expect.soft(rpHeaderValue).toBeTruthy()
    expect.soft(rpHeaderValue).toBe('no-referrer')

    const stsHeaderValue = headers['strict-transport-security']
    expect.soft(stsHeaderValue).toBeTruthy()
    expect.soft(stsHeaderValue).toBe('max-age=15552000; includeSubDomains;')

    const xctpHeaderValue = headers['x-content-type-options']
    expect.soft(xctpHeaderValue).toBeTruthy()
    expect.soft(xctpHeaderValue).toBe('nosniff')

    const xdpcHeaderValue = headers['x-dns-prefetch-control']
    expect.soft(xdpcHeaderValue).toBeTruthy()
    expect.soft(xdpcHeaderValue).toBe('off')

    const xdoHeaderValue = headers['x-download-options']
    expect.soft(xdoHeaderValue).toBeTruthy()
    expect.soft(xdoHeaderValue).toBe('noopen')

    const xfoHeaderValue = headers['x-frame-options']
    expect.soft(xfoHeaderValue).toBeTruthy()
    expect.soft(xfoHeaderValue).toBe('SAMEORIGIN')

    const xpcdpHeaderValue = headers['x-permitted-cross-domain-policies']
    expect.soft(xpcdpHeaderValue).toBeTruthy()
    expect.soft(xpcdpHeaderValue).toBe('none')

    const xssHeaderValue = headers['x-xss-protection']
    expect.soft(xssHeaderValue).toBeTruthy()
    expect.soft(xssHeaderValue).toBe('0')
  })
})
