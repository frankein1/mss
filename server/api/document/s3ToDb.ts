import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { defineEventHandler } from 'h3'
import { DocumentRepo } from '~/server/database'
import { forbiddenError } from '~/server/trpc'
import { JwtUser } from '~/types/user'
import { prismaClient } from '~/server/prisma'

const config = useRuntimeConfig()

const s3 = new S3Client({
  credentials: {
    accessKeyId: config.s3.key,
    secretAccessKey: config.s3.secret
  },
  region: config.s3.region,
  endpoint: `https://${config.s3.host}`
})

export default defineEventHandler(async event => {
  const { user }: { user: JwtUser } = event.context.auth
  if (!user || user.role !== 'Administrator') {
    throw forbiddenError()
  }
  const ids = await DocumentRepo.findMany(user, {
    where: {
      migrated: false
    },
    select: {
      key: true,
      filenameDisk: true
    }
  })

  let counter = 0
  console.log(`${ids.length}`)
  for (const { filenameDisk, key } of ids) {
    try {
      await migrateFile(key, filenameDisk, config.s3.bucket)
      counter++
      console.log(`${counter}/${ids.length} documents migrated`)
    } catch (e) {
      console.log(`Error with key ${key}, filenameDisk ${filenameDisk}`)
    }
  }
  console.log('END')

  return send(event)
})

async function migrateFile(key: string, filenameDisk: string, bucket: string) {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: filenameDisk
  })

  const response = await s3.send(command)
  const content = await response.Body?.transformToByteArray()
  if (content) {
    await prismaClient.document.update({
      where: {
        key
      },
      data: {
        migrated: true,
        documentContent: {
          create: {
            content: Buffer.from(content)
          }
        }
      }
    })
  }
}
