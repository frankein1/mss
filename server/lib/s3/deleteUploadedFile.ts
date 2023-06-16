import { DeleteObjectCommand } from '@aws-sdk/client-s3'
import { s3 } from './s3'

export const deleteUploadedFile = ({ key }: { key: string }) => {
  const config = useRuntimeConfig()
  return s3.send(
    new DeleteObjectCommand({
      Key: key,
      Bucket: config.s3.bucket
    })
  )
}
