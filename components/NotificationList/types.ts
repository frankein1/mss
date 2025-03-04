import { NotificationType, SocialSupportType } from '@prisma/client'

export type NotificationItemType = {
  id: string
  read: boolean | null
  documentId: string | null
  socialSupportId: string | null
  type: NotificationType
  beneficiary: {
    id: string
    firstName: string | null
    usualName: string | null
    birthName: string | null
    familyFile: {
      id: string
    }
  } | null
  socialSupport: {
    socialSupportType: SocialSupportType
  } | null
  itemCreatedBy: {
    firstName: string | null
    lastName: string | null
  } | null
  comment: {
    content: string | null
  } | null
  detail: string | null
  created: Date | null
  title: string | null
  description: string | null
  descriptionHint: string | null
}
