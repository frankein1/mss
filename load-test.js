/* eslint-disable  */
import http from 'k6/http'
import { check, sleep } from 'k6'
import { Trend, Counter, Rate } from 'k6/metrics'

// Custom metrics
const uploadDuration = new Trend('upload_duration')
const uploadSuccess = new Counter('upload_success')
const uploadFailure = new Counter('upload_failure')
const uploadRate = new Rate('upload_rate')

// Configuration
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'
const AUTH_TOKEN = __ENV.AUTH_TOKEN || ''
const FAMILY_FILE_ID =
  __ENV.FAMILY_FILE_ID || '5c0f2623-63fb-46c1-ae58-1b4360180a89'
const BENEFICIARY_ID =
  __ENV.BENEFICIARY_ID || '5c0f2623-63fb-46c1-ae58-1b4360180a89'

if (!AUTH_TOKEN) {
  console.error('AUTH_TOKEN environment variable is required')
  throw new Error('Missing AUTH_TOKEN')
}

// Read PDF file once in init context (global open(), no import needed)
const pdfFile = open('load-test-file.pdf', 'b')

// export const options = {
//   stages: [
//     { duration: '30s', target: 2 },
//     // { duration: '1m', target: 10 },
//     { duration: '30s', target: 2 },
//     // { duration: '1m', target: 20 },
//     { duration: '30s', target: 0 },
//   ],
//   thresholds: {
//     'http_req_duration': ['p(95)<500', 'p(99)<1000'],
//     'http_req_failed': ['rate<0.1'],
//     'upload_rate': ['rate>0.95'],
//   },
// //   iterations: 1,
// //   vus: 1,
// };

export const options = {
  scenarios: {
    upload: {
      executor: 'constant-arrival-rate',
      rate: 1,
      timeUnit: '1s',
      duration: '1m',
      preAllocatedVUs: 5,
      maxVUs: 10
    }
  },
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.1'],
    upload_rate: ['rate>0.95']
  }
}

export default function () {
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

  const params = {
    headers: {
      Cookie: `MSS_SESSION_TOKEN=${AUTH_TOKEN}`
    }
  }

  const response = http.post(`${BASE_URL}/api/document/upload`, payload, params)

  const success = check(response, {
    'status is 200': r => r.status === 200,
    'response time < 500ms': r => r.timings.duration < 500,
    'response time < 1000ms': r => r.timings.duration < 1000,
    'response has key': r => r.body.length > 0
  })

  uploadDuration.add(response.timings.duration)
  uploadRate.add(success)

  if (success) {
    uploadSuccess.add(1)
  } else {
    uploadFailure.add(1)
    console.error(
      `Upload failed with status ${response.status}: ${response.body}`
    )
  }

  sleep(1)
}

export function handleSummary(data) {
  return {
    'stdout': textSummary(data),
    'k6-summary.json': JSON.stringify(data)
  }
}

function textSummary(data) {
  let summary = '\n\nLoad Test Summary\n'
  summary += '='.repeat(50) + '\n\n'

  if (data.metrics.http_req_duration) {
    const d = data.metrics.http_req_duration.values
    summary += 'HTTP Request Duration:\n'
    summary += `  Min: ${Math.round(d.min)}ms\n`
    summary += `  Max: ${Math.round(d.max)}ms\n`
    summary += `  Avg: ${Math.round(d.avg)}ms\n`
    summary += `  P95: ${Math.round(d['p(95)'])}ms\n`
    summary += `  P99: ${Math.round(d['p(99)'])}ms\n\n`
  }

  if (data.metrics.upload_duration) {
    const d = data.metrics.upload_duration.values
    summary += 'Upload Duration:\n'
    summary += `  Min: ${Math.round(d.min)}ms\n`
    summary += `  Max: ${Math.round(d.max)}ms\n`
    summary += `  Avg: ${Math.round(d.avg)}ms\n`
    summary += `  P95: ${Math.round(d['p(95)'])}ms\n`
    summary += `  P99: ${Math.round(d['p(99)'])}ms\n\n`
  }

  const s = (data.metrics.upload_success || {}).values || {}
  const f = (data.metrics.upload_failure || {}).values || {}
  const success = s.count || 0
  const failure = f.count || 0
  const total = success + failure
  if (total > 0) {
    summary += 'Upload Results:\n'
    summary += `  Success: ${success}/${total}\n`
    summary += `  Failure: ${failure}/${total}\n`
    summary += `  Success Rate: ${((success / total) * 100).toFixed(2)}%\n\n`
  }

  if (data.metrics.http_reqs) {
    summary += `Total Requests: ${data.metrics.http_reqs.values.count}\n`
    summary += `Requests/s: ${data.metrics.http_reqs.values.rate.toFixed(2)}\n`
  }

  summary += '='.repeat(50) + '\n'
  return summary
}
