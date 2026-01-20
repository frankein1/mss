import { SocialSupportStatus } from '@prisma/client'
import { RdvspStatus } from '~/types/rdvsp'

export function mapRdvspRdvStatusToAppointmentStatus(status: RdvspStatus) {
  switch (status) {
    case RdvspStatus.Excused:
      return SocialSupportStatus.RdvExcused
    case RdvspStatus.NoShow:
      return SocialSupportStatus.RdvNoShow
    case RdvspStatus.Revoked:
      return SocialSupportStatus.RdvRevoked
    case RdvspStatus.Seen:
      return SocialSupportStatus.RdvSeen
    case RdvspStatus.Unknown:
      return SocialSupportStatus.RdvUnknown
  }
}
