import type { Prisma } from '@prisma/client'
import dayjs from 'dayjs'
import { prismaClient } from '~/server/prisma'
import { withErrorCapture } from '../utils'
import { getDocumentNotificationRecipientIds } from './getNotificationRecipientIds'

const documentSelect = {
  key: true,
  name: true,
  createdById: true,
  beneficiaryId: true,
  confidential: true,
  familyFile: {
    select: {
      referents: {
        select: {
          id: true,
          role: true
        }
      }
    }
  }
} satisfies Prisma.DocumentSelect

type DocumentForNotification = Prisma.DocumentGetPayload<{
  select: typeof documentSelect
}>

const getRecipientIds = (doc: DocumentForNotification): Set<string> =>
  getDocumentNotificationRecipientIds({
    createdById: doc.createdById,
    confidential: doc.confidential,
    referents: doc.familyFile.referents
  })

async function createNotifications(
  type: 'DocumentExpirationToday' | 'DocumentExpirationOneMonth'
) {
  const expirationDate =
    type === 'DocumentExpirationToday'
      ? new Date()
      : dayjs().add(1, 'month').toDate()

  const docs = await prismaClient.document.findMany({
    select: documentSelect,
    where: { expirationDate }
  })

  const data = docs.flatMap(d =>
    Array.from(getRecipientIds(d)).map(recipientId => ({
      recipientId,
      beneficiaryId: d.beneficiaryId,
      documentId: d.key,
      detail: d.name,
      type
    }))
  ) satisfies Prisma.NotificationCreateManyInput[]

  const res = await prismaClient.notification.createMany({ data })

  console.log(
    `create-document-expiration-notifications [${new Date().toISOString()}]: ` +
      `${res.count} notifications created for document expiration ` +
      `${type === 'DocumentExpirationToday' ? 'today' : 'in a month'}`
  )
}

export default {
  createDueInAMonthDocumentNotifications: async () =>
    await withErrorCapture(() =>
      createNotifications('DocumentExpirationOneMonth')
    ),
  createDueTodayDocumentNotifications: async () =>
    await withErrorCapture(() => createNotifications('DocumentExpirationToday'))
}
