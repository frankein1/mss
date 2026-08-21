import { test, expect } from '@playwright/test'
import type { CDPSession, Page } from '@playwright/test'

const CYCLES = 20
const MAX_HEAP_GROWTH_BYTES = 2 * 1024 * 1024 // 2 MB

const mockArchiveNotification = {
  id: 'perf-test-notification-001',
  created: '2026-01-01T00:00:00.000Z',
  detail: null,
  recipientId: '00000000-0000-0000-0000-000000000000',
  structureId: null,
  beneficiaryId: 'perf-test-beneficiary-001',
  socialSupportId: null,
  itemCreatedById: null,
  documentId: null,
  commentId: null,
  archiveDate: '2025-06-01T00:00:00.000Z',
  read: null,
  type: 'ArchiveDueToday',
  title: 'Archivage',
  description: 'Gérer le dossier',
  descriptionHint:
    "Dossier sans activité depuis 2 ans : suppression prévue aujourd'hui.",
  beneficiary: {
    id: 'perf-test-beneficiary-001',
    firstName: 'PerfTest',
    usualName: 'Beneficiary',
    birthName: null,
    archiveDueDate: null,
    familyFile: { id: 'perf-test-family-001' }
  },
  socialSupport: null,
  itemCreatedBy: null,
  comment: null
}

const superJsonDates: Record<string, string[]> = {
  '0.created': ['Date'],
  '0.archiveDate': ['Date']
}

function buildBatchEntry() {
  return {
    result: {
      data: {
        json: [mockArchiveNotification],
        meta: { values: superJsonDates }
      }
    }
  }
}

async function forceGC(cdp: CDPSession) {
  await cdp.send('HeapProfiler.collectGarbage')
}

async function getHeapUsed(cdp: CDPSession): Promise<number> {
  const metrics = await cdp.send('Performance.getMetrics')
  const heap = metrics.metrics.find(m => m.name === 'JSHeapUsedSize')
  return heap?.value ?? 0
}

async function interceptArchiveNotifications(page: Page) {
  await page.route('**/api/trpc/**', async route => {
    const url = route.request().url()
    if (!url.includes('archiveNotification.get')) {
      return route.continue()
    }

    const response = await route.fetch()
    const body = await response.json()

    const pathname = new URL(url).pathname
    const procedures = pathname.replace(/.*\/api\/trpc\//, '').split(',')
    const idx = procedures.indexOf('archiveNotification.get')

    if (idx >= 0 && Array.isArray(body)) {
      body[idx] = buildBatchEntry()
    }

    await route.fulfill({
      status: response.status(),
      headers: response.headers(),
      body: JSON.stringify(body)
    })
  })
}

async function waitForModalOpen(page: Page) {
  await page.locator('#global-modal.fr-modal--opened').waitFor({
    state: 'visible',
    timeout: 10_000
  })
}

async function closeModal(page: Page) {
  await page.locator('#global-modal button[title="Fermer"]').click()
  await page.locator('#global-modal.fr-modal--opened').waitFor({
    state: 'hidden',
    timeout: 5_000
  })
}

test.skip('Modal memory leak', () => {
  test.use({ storageState: 'playwright/.auth/structure-manager.json' })

  test(`heap does not grow after ${CYCLES} modal open/close cycles`, async ({
    page
  }) => {
    test.setTimeout(120_000)

    const cdp = await page.context().newCDPSession(page)
    await cdp.send('Performance.enable')

    await interceptArchiveNotifications(page)

    // Warm-up: first load to stabilize JIT and caches
    await page.goto('/app/overview')
    await waitForModalOpen(page)
    await closeModal(page)

    await forceGC(cdp)
    const baselineHeap = await getHeapUsed(cdp)

    for (let i = 0; i < CYCLES; i++) {
      await page.reload()
      await waitForModalOpen(page)
      await closeModal(page)
    }

    await forceGC(cdp)
    const finalHeap = await getHeapUsed(cdp)
    const growth = finalHeap - baselineHeap

    console.log(
      `Heap: baseline=${(baselineHeap / 1024 / 1024).toFixed(2)}MB, ` +
        `final=${(finalHeap / 1024 / 1024).toFixed(2)}MB, ` +
        `growth=${(growth / 1024 / 1024).toFixed(2)}MB`
    )

    expect(growth).toBeLessThan(MAX_HEAP_GROWTH_BYTES)
  })
})
