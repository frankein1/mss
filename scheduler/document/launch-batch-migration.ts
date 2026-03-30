import { withErrorCapture } from '../utils'
import { scalingoRun } from './utils'

export default async function handler() {
  return await withErrorCapture(() =>
    scalingoRun('tsx scheduler/document/migrate-to-s3-bucket.ts')
  )
}
