import v8 from 'node:v8'
import path from 'node:path'

function toMB(bytes: number): string {
  return (bytes / 1024 / 1024).toFixed(2) + ' MB'
}

// Track previous readings for delta calculation
let previousReading: {
  heapUsed: number
  rss: number
  external: number
} | null = null
let readingCount = 0

export default defineEventHandler(async event => {
  if (process.env.NODE_ENV === 'production') {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  }

  const query = getQuery(event)

  // Force GC if available (start server with NODE_OPTIONS="--expose-gc")
  let gcRan = false
  if (globalThis.gc) {
    globalThis.gc()
    gcRan = true
  }

  // Take a heap snapshot if ?snapshot is passed
  // Usage: GET /api/debug/memory?snapshot
  // Writes a .heapsnapshot file that can be loaded in Chrome DevTools
  let snapshotPath: string | null = null
  if ('snapshot' in query) {
    const filename = `mss-heap-${Date.now()}.heapsnapshot`
    snapshotPath = path.resolve(filename)
    const snapshotContent = v8.writeHeapSnapshot(snapshotPath)
    snapshotPath = snapshotContent || snapshotPath
  }

  const mem = process.memoryUsage()
  readingCount++

  // Calculate delta from previous reading
  let delta: { heapUsed: string; rss: string; external: string } | null = null
  if (previousReading) {
    delta = {
      heapUsed: toMB(mem.heapUsed - previousReading.heapUsed),
      rss: toMB(mem.rss - previousReading.rss),
      external: toMB(mem.external - previousReading.external)
    }
  }
  previousReading = {
    heapUsed: mem.heapUsed,
    rss: mem.rss,
    external: mem.external
  }

  // Count h3 session storage keys to detect session accumulation
  let sessionKeyCount: number | null = null
  try {
    const storage = useStorage('sessions')
    const keys = await storage.getKeys()
    sessionKeyCount = keys.length
  } catch {
    // Storage may not be available
  }

  // V8 heap statistics for more detail
  const heapStats = v8.getHeapStatistics()

  return {
    timestamp: new Date().toISOString(),
    readingNumber: readingCount,
    gcRan,
    gcAvailable: typeof globalThis.gc === 'function',
    memory: {
      rss: toMB(mem.rss),
      heapUsed: toMB(mem.heapUsed),
      heapTotal: toMB(mem.heapTotal),
      external: toMB(mem.external),
      arrayBuffers: toMB(mem.arrayBuffers)
    },
    delta,
    heapDetails: {
      totalHeapSize: toMB(heapStats.total_heap_size),
      usedHeapSize: toMB(heapStats.used_heap_size),
      heapSizeLimit: toMB(heapStats.heap_size_limit),
      numberOfNativeContexts: heapStats.number_of_native_contexts,
      numberOfDetachedContexts: heapStats.number_of_detached_contexts
    },
    sessionKeyCount,
    ...(snapshotPath ? { snapshotPath } : {})
  }
})
