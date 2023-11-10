import { GetObjectCommand } from '@aws-sdk/client-s3'
import { s3 } from './s3'

export const createContentUrl = async ({
  key,
  bucket
}: {
  key: string
  bucket: string
}) => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key
  })

  const response = await s3.send(command)
  const url = `data:${
    response.ContentType
  };base64,${await response.Body?.transformToString('base64')}`
  return { url }
}
