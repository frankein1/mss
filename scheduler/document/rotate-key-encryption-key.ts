/* eslint-disable no-console */
import { SCHEDULER_ENV } from '../env'
import { prismaClient } from '~~/server/prisma'
import { getKeyManagerClient } from '~~/server/lib/encryption/kms'

const LOCAL_ENV = {
  batchSize: parseInt(
    process.env.NUXT_DOCUMENT_ROTATE_KEK_BATCH_SIZE || '500',
    10
  )
}

async function query(batchSize: number, lastDocKey: string | undefined) {
  return prismaClient.document.findMany({
    orderBy: { key: 'asc' },
    ...(lastDocKey && { cursor: { key: lastDocKey }, skip: 1 }),
    take: batchSize,
    select: {
      key: true,
      // eslint-disable-next-line no-restricted-syntax -- authorized for key rotation
      encryptedDataKey: true
    }
  })
}

async function fetchDocumentBatch(lastDocKey: string | undefined) {
  const start = performance.now()
  const docs = await query(LOCAL_ENV.batchSize, lastDocKey)
  console.debug(
    `rotate-key-encryption_key: fetching ${LOCAL_ENV.batchSize} documents in ${performance.now() - start} ms`
  )
  return docs
}

export async function rotateKeyEncryptionKey() {
  const kms = await getKeyManagerClient(SCHEDULER_ENV)
  const keyId = SCHEDULER_ENV.kms.keyId

  let lastDocKey: string | undefined = undefined

  const vaultKeyVersion = await kms.getKeyLatestVersion({ keyId })

  console.info(
    `rotate-kek: starting rotation to key version ${vaultKeyVersion}`
  )

  let totalProcessed = 0
  let totalRewrapped = 0

  while (true) {
    const docs = await fetchDocumentBatch(lastDocKey)
    if (docs.length === 0) {
      break
    }
    const results = await Promise.all(
      docs.map(async doc => {
        if (!doc.encryptedDataKey) {
          throw new Error('rotate-kek: missing data key')
        }

        const dekVersion = doc.encryptedDataKey.split(':')[1]

        if (dekVersion === vaultKeyVersion) {
          return null
        }

        const dataKey = await kms.rewrap({
          keyId,
          ciphertext: doc.encryptedDataKey
        })

        return { key: doc.key, encryptedDataKey: dataKey.ciphertext }
      })
    )
    const rewrapped = results.filter(el => el !== null)

    if (rewrapped.length > 0) {
      await prismaClient.$transaction(
        rewrapped.map(el =>
          prismaClient.document.update({
            where: { key: el.key },
            data: { encryptedDataKey: el.encryptedDataKey }
          })
        )
      )
    }

    totalProcessed += docs.length
    totalRewrapped += rewrapped.length
    console.info(
      `rotate-kek: batch done — ${rewrapped.length}/${docs.length} rewrapped (total: ${totalRewrapped}/${totalProcessed})`
    )

    lastDocKey = docs[docs.length - 1]!.key
  }

  console.info(
    `rotate-kek: completed — ${totalRewrapped} rewrapped out of ${totalProcessed} documents`
  )
}
