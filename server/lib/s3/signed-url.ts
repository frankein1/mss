import {
  createPresignedPost,
  type PresignedPostOptions
} from '@aws-sdk/s3-presigned-post'
import { MAX_UPLOAD_SIZE_BYTES } from '~/utils/constants'
import { getS3Client } from './config'
import type { RuntimeConfig } from 'nuxt/schema'

export function getPresignedUrlForUploadWithPOST(
  runtimeConfig: RuntimeConfig['s3'],
  key: string,
  expiresInSeconds = 60
) {
  const client = getS3Client()

  const command: PresignedPostOptions = {
    Bucket: runtimeConfig.bucket,
    Key: key,
    Conditions: [['content-length-range', 0, MAX_UPLOAD_SIZE_BYTES]],
    Expires: expiresInSeconds
  }

  return createPresignedPost(client, command)
}
