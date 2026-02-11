/* eslint-disable  */
import http from 'k6/http'
import { check } from 'k6'
import { Trend, Counter, Rate } from 'k6/metrics'

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'
const AUTH_TOKEN = __ENV.AUTH_TOKEN || ''
const ENDPOINT = __ENV.ENDPOINT || 'document-upload'
const MODE = __ENV.MODE || 'vus' // 'vus' or 'rate'
// vus mode
const VUS = parseInt(__ENV.VUS || '10')
const ITERATIONS = parseInt(__ENV.ITERATIONS || '3')
// rate mode
const RATE = parseInt(__ENV.RATE || '1')
const DURATION = __ENV.DURATION || '1m'
const FAMILY_FILE_ID =
  __ENV.FAMILY_FILE_ID || '5c0f2623-63fb-46c1-ae58-1b4360180a89' // Aurelie APFELMANN
const BENEFICIARY_ID =
  __ENV.BENEFICIARY_ID || '5c0f2623-63fb-46c1-ae58-1b4360180a89'
const REFERENT_ID = __ENV.REFERENT_ID || '7e5c1734-35cb-4047-9035-a944961a67a4' // Jeanne Responsable
const DOCUMENT_KEY =
  __ENV.DOCUMENT_KEY || 'bc0bb82c-7998-4566-a7e3-da2ebe7e79f5'

if (!AUTH_TOKEN) {
  throw new Error('Missing AUTH_TOKEN — pass it with -e AUTH_TOKEN=...')
}

// ---------------------------------------------------------------------------
// Metrics
// ---------------------------------------------------------------------------
const reqDuration = new Trend('req_duration')
const reqSuccess = new Counter('req_success')
const reqFailure = new Counter('req_failure')
const reqRate = new Rate('req_rate')

// ---------------------------------------------------------------------------
// File data (loaded once in init context, only when needed)
// ---------------------------------------------------------------------------
let pdfFile = null
if (ENDPOINT === 'document-upload') {
  pdfFile = open('load-test-file.pdf', 'b')
}

// ---------------------------------------------------------------------------
// Options
// ---------------------------------------------------------------------------
const scenario =
  MODE === 'rate'
    ? {
        executor: 'constant-arrival-rate',
        rate: RATE,
        timeUnit: '1s',
        duration: DURATION,
        preAllocatedVUs: RATE * 2,
        maxVUs: RATE * 5
      }
    : {
        executor: 'per-vu-iterations',
        vus: VUS,
        iterations: ITERATIONS
      }

export const options = {
  scenarios: { main: scenario },
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.1'],
    req_rate: ['rate>0.95']
  }
}
// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function authParams() {
  return {
    headers: { Cookie: `MSS_SESSION_TOKEN=${AUTH_TOKEN}` }
  }
}

function trpcGet(procedure, input) {
  const wrapped = JSON.stringify({ 0: { json: input } })
  const url = `${BASE_URL}/api/trpc/${procedure}?batch=1&input=${encodeURIComponent(wrapped)}`
  return http.get(url, authParams())
}

function trpcPost(procedure, input) {
  const url = `${BASE_URL}/api/trpc/${procedure}?batch=1`
  const body = JSON.stringify({ 0: { json: input } })
  return http.post(url, body, {
    headers: {
      'Cookie': `MSS_SESSION_TOKEN=${AUTH_TOKEN}`,
      'Content-Type': 'application/json'
    }
  })
}

// ---------------------------------------------------------------------------
// Endpoint definitions
// ---------------------------------------------------------------------------
const endpoints = {
  // POST /api/document/upload (multipart)
  'document-upload': function () {
    const payload = {
      file: http.file(pdfFile, 'load-test-file.pdf', 'application/pdf'),
      input: JSON.stringify({
        familyFileId: FAMILY_FILE_ID,
        beneficiaryId: BENEFICIARY_ID,
        type: 'Rapports',
        tags: [],
        confidential: false,
        file: {
          name: 'load-test-file.pdf',
          mimeType: 'application/pdf',
          size: pdfFile.byteLength
        }
      })
    }
    return http.post(`${BASE_URL}/api/document/upload`, payload, authParams())
  },

  // GET /api/document/download?key=...
  'document-download': function () {
    return http.get(
      `${BASE_URL}/api/document/download?key=${DOCUMENT_KEY}`,
      authParams()
    )
  },

  // tRPC: beneficiary.create (mutation)
  'beneficiary-create': function () {
    const i = __ITER
    return trpcPost('beneficiary.create', {
      status: 'Active',
      referents: [REFERENT_ID],
      title: 'Mister',
      firstName: `Loadtest`,
      usualName: `TEST-${Date.now()}-${i}`,
      birthDate: '1990-01-15',
      phone1: '',
      email: '',
      street: '',
      zipcode: '',
      city: ''
    })
  },

  // tRPC: beneficiary.getBeneficiaryList
  'beneficiary-list': function () {
    return trpcGet('beneficiary.getBeneficiaryList', {
      page: 1,
      perPage: 60,
      orderBy: { usualName: 'asc' },
      filters: {}
    })
  },

  // tRPC: beneficiary.getBeneficiaryDetails
  'beneficiary-get': function () {
    return trpcGet('beneficiary.getBeneficiaryDetails', {
      id: BENEFICIARY_ID
    })
  },

  // tRPC: file.getFamilyFileMinimalInfo
  'family-file-get': function () {
    return trpcGet('file.getFamilyFileMinimalInfo', {
      id: FAMILY_FILE_ID
    })
  },

  // tRPC: file.getSocialSupports
  'social-supports': function () {
    return trpcGet('file.getSocialSupports', {
      familyFileId: FAMILY_FILE_ID,
      filters: {}
    })
  },

  // tRPC: file.getDocuments
  'file-documents': function () {
    return trpcGet('file.getDocuments', {
      familyFileId: FAMILY_FILE_ID,
      page: 1,
      perPage: 20
    })
  },

  // tRPC: notification.get
  'notification-list': function () {
    return trpcGet('notification.get', {
      onlyUnread: false,
      page: 1,
      perPage: 20
    })
  },

  // tRPC: stat.getBeneficiaryCount
  'stat-beneficiary-count': function () {
    return trpcGet('stat.getBeneficiaryCount', {})
  },

  // tRPC: stat.getFamilyFileCount
  'stat-family-file-count': function () {
    return trpcGet('stat.getFamilyFileCount', {})
  },

  // tRPC: stat.getGenderStats
  'stat-gender': function () {
    return trpcGet('stat.getGenderStats', {})
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const handler = endpoints[ENDPOINT]
if (!handler) {
  throw new Error(
    `Unknown ENDPOINT "${ENDPOINT}". Available: ${Object.keys(endpoints).join(', ')}`
  )
}

export default function () {
  const response = handler()

  const success = check(response, {
    'status is 200': r => r.status === 200,
    'response time < 500ms': r => r.timings.duration < 500,
    'response time < 1000ms': r => r.timings.duration < 1000
  })

  reqDuration.add(response.timings.duration)
  reqRate.add(success)

  if (success) {
    reqSuccess.add(1)
  } else {
    reqFailure.add(1)
    console.error(`[${ENDPOINT}] ${response.status}: ${response.body}`)
  }
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
export function handleSummary(data) {
  return {
    'stdout': textSummary(data),
    'k6-summary.json': JSON.stringify(data)
  }
}

function textSummary(data) {
  let s = `\n\nLoad Test Summary — endpoint: ${ENDPOINT}\n`
  s += '='.repeat(50) + '\n\n'

  if (data.metrics.http_req_duration) {
    const d = data.metrics.http_req_duration.values
    s += 'HTTP Request Duration:\n'
    s += `  Min: ${Math.round(d.min)}ms\n`
    s += `  Max: ${Math.round(d.max)}ms\n`
    s += `  Avg: ${Math.round(d.avg)}ms\n`
    s += `  P95: ${Math.round(d['p(95)'])}ms\n`
    s += `  P99: ${Math.round(d['p(99)'])}ms\n\n`
  }

  const ok = ((data.metrics.req_success || {}).values || {}).count || 0
  const ko = ((data.metrics.req_failure || {}).values || {}).count || 0
  const total = ok + ko
  if (total > 0) {
    s += 'Results:\n'
    s += `  Success: ${ok}/${total}\n`
    s += `  Failure: ${ko}/${total}\n`
    s += `  Success Rate: ${((ok / total) * 100).toFixed(2)}%\n\n`
  }

  if (data.metrics.http_reqs) {
    s += `Total Requests: ${data.metrics.http_reqs.values.count}\n`
    s += `Requests/s: ${data.metrics.http_reqs.values.rate.toFixed(2)}\n`
  }

  s += '='.repeat(50) + '\n'
  return s
}
