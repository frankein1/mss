import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { s3 } from './s3'

export const createSignedGetUrl = async ({
  key,
  bucket
}: {
  key: string
  bucket: string
}): Promise<{ url: string }> => {
  // Signed URL
  const url = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Key: key,
      Bucket: bucket
    }),
    {
      expiresIn: 600
    }
  )
  return { url }
}
