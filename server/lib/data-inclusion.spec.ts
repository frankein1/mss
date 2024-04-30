import { test, expect } from 'vitest'
import { downloadStructures } from './data-inclusion'

test.skip('Data Inclusion Structure download should succeed on real data', async () => {
  const res = await downloadStructures()

  expect(res.data.length).toBeGreaterThan(0)
  expect(res.error).toBe(null)
  expect(res.headers).not.toBe(null)
}, 10000)
