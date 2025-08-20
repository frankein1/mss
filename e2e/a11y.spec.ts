import AxeBuilder from '@axe-core/playwright'
import type { Page } from '@playwright/test'
import { test, expect } from '@playwright/test'
import { routes } from '~/utils/routes'

type Options = {
  exclude?: string[]
  disableRules?: string[]
}

// Exclude logo in header
const siteFacileExludeElements = ['.fr-header__service']
// Exclude color contrast error caused by dsfr on links
const siteFacileDisableRules = ['color-contrast']
// for local test only, exclude nuxt additional elements in DOM
const appExcludeElements = ['#nuxt-devtools-container']

const WEBSITE_URL = 'https://monsuivisocial.incubateur.anct.gouv.fr'

async function analyze(page: Page, { exclude, disableRules }: Options) {
  // "RGAA est conforme aux 50 critères de succès des niveaux A et AA de la norme internationale WCAG 2.1"
  const wcagRules = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']
  const results = await new AxeBuilder({ page })
    .withTags(wcagRules)
    .exclude(exclude ? exclude : [])
    .disableRules(disableRules ? disableRules : [])
    .analyze()

  expect
    .soft(results.violations, JSON.stringify(results.violations, undefined, 2))
    .toHaveLength(0)
  expect
    .soft(results.incomplete, JSON.stringify(results.incomplete, undefined, 2))
    .toHaveLength(0)
}

test.describe('a11y - Website', () => {
  // test external pages made with site-facile CMS
  test('Home page', async ({ page }) => {
    await page.goto(WEBSITE_URL)
    await analyze(page, {
      exclude: siteFacileExludeElements,
      disableRules: siteFacileDisableRules
    })
  })
  test('Create account', async ({ page }) => {
    await page.goto(routes.landing.Sinscrire.path(WEBSITE_URL))
    await analyze(page, {
      exclude: siteFacileExludeElements,
      disableRules: siteFacileDisableRules
    })
  })
  test('Contact', async ({ page }) => {
    await page.goto(routes.landing.Contact.path(WEBSITE_URL))
    await analyze(page, {
      exclude: siteFacileExludeElements,
      disableRules: siteFacileDisableRules
    })
  })

  test('Budget', async ({ page }) => {
    await page.goto(routes.landing.Budget.path(WEBSITE_URL))
    await analyze(page, {
      exclude: siteFacileExludeElements,
      disableRules: siteFacileDisableRules
    })
  })

  test('Legals', async ({ page }) => {
    await page.goto(routes.landing.MentionsLegales.path(WEBSITE_URL))
    await analyze(page, {
      exclude: siteFacileExludeElements,
      disableRules: siteFacileDisableRules
    })
  })

  test('Accessibility', async ({ page }) => {
    await page.goto(routes.landing.DeclarationAccessibilite.path(WEBSITE_URL))
    await analyze(page, {
      exclude: siteFacileExludeElements,
      disableRules: siteFacileDisableRules
    })
  })

  test('Site map', async ({ page }) => {
    await page.goto(routes.landing.PlanDuSite.path(WEBSITE_URL))
    await analyze(page, {
      exclude: siteFacileExludeElements,
      disableRules: siteFacileDisableRules
    })
  })
})

test.describe('a11y - Application', () => {
  test.use({ storageState: 'playwright/.auth/structure-manager.json' })

  test('Home', async ({ page }) => {
    await page.goto('/')
    await analyze(page, {
      exclude: appExcludeElements,
      disableRules: siteFacileDisableRules
    })
  })

  test('Dashboard', async ({ page }) => {
    await page.goto('/app/overview')

    await analyze(page, {
      exclude: appExcludeElements,
      disableRules: siteFacileDisableRules
    })
  })

  test('Beneficiaries', async ({ page }) => {
    await page.goto('/app/beneficiaries')

    await analyze(page, {
      exclude: appExcludeElements,
      disableRules: siteFacileDisableRules
    })
  })

  test('Social supports', async ({ page }) => {
    await page.goto('/app/history')

    await analyze(page, {
      exclude: appExcludeElements,
      disableRules: siteFacileDisableRules
    })
  })

  test('Statistics', async ({ page }) => {
    await page.goto('/app/stats')

    await analyze(page, {
      exclude: appExcludeElements,
      disableRules: siteFacileDisableRules
    })
  })

  test('Structure manager - User Management', async ({ page }) => {
    await page.goto('/app/users')

    await analyze(page, {
      exclude: appExcludeElements,
      disableRules: siteFacileDisableRules
    })
  })

  test('Structure manager - Structure configuration', async ({ page }) => {
    await page.goto('/app/structure')

    await analyze(page, {
      exclude: appExcludeElements,
      disableRules: siteFacileDisableRules
    })
  })
})
