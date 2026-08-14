import type { NotificationType, SocialSupportType } from '@prisma/client'

export type NotificationItemType = {
  id: string
  title: string
  type: NotificationType
  description: string
  descriptionHint: string
  read?: boolean | null
  documentId?: string | null
  socialSupportId?: string | null
  beneficiary?: {
    id: string
    firstName: string | null
    usualName: string | null
    birthName: string | null
    familyFile: {
      id: string
    }
  } | null
  socialSupport?: {
    socialSupportType: SocialSupportType
  } | null
  itemCreatedBy?: {
    firstName: string | null
    lastName: string | null
  } | null
  comment?: {
    content: string | null
  } | null
  detail?: string | null
  created?: Date | null
  onClick?: (() => void) | null
}
