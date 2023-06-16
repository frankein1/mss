import { PutObjectCommand } from '@aws-sdk/client-s3'
import { createKey } from './key'
import { s3 } from './s3'
import { MultiPartData } from './types'

export const uploadFile = async (file: MultiPartData) => {
  const config = useRuntimeConfig()
  const key = createKey(file)
  const command = new PutObjectCommand({
    Bucket: config.s3.bucket,
    Body: file.data,
    Key: key,
    ContentType: file.type
  })

  await s3.send(command)
  return key
}
