import {
  FollowupMedium,
  SocialSupportStatus,
  FollowupDuration
} from '@prisma/client'
import { buildKeys } from '~/utils/keys/keyBuilder'
import { FilterFollowupNotFilled } from '~/utils/constants/filters'
import { followupFieldLabels } from '../labels'

export const followupMediumKeys = buildKeys({
  [FollowupMedium.UnplannedInPerson]: 'Accueil physique spontané',
  [FollowupMedium.PlannedInPerson]: 'Accueil physique sur rendez-vous',
  [FollowupMedium.PostalMail]: 'Courrier',
  [FollowupMedium.ThirdParty]: 'Entretien avec un tiers',
  [FollowupMedium.PhoneCall]: 'Entretien téléphonique',
  [FollowupMedium.Email]: 'E-mail',
  [FollowupMedium.BeneficiaryHouseAppointment]: 'Rendez-vous à domicile',
  [FollowupMedium.ExternalAppointment]: 'Rendez-vous extérieur',
  [FollowupMedium.Videoconference]: 'Visioconférence'
})

export const followupStatusKeys = buildKeys({
  [SocialSupportStatus.Todo]: 'À traiter',
  [SocialSupportStatus.InProgress]: 'En cours',
  [SocialSupportStatus.Done]: 'Terminé'
})

export const followupDurationKeys = buildKeys({
  [FollowupDuration.Quarter]: '15 min',
  [FollowupDuration.Half]: '30 min',
  [FollowupDuration.ThreeQuarter]: '45 min',
  [FollowupDuration.Hour]: '1 heure',
  [FollowupDuration.MoreThanHour]: '+ de 1 heure'
})

export const followupNotFilledKeys = buildKeys({
  [FilterFollowupNotFilled.PrescribingOrganization]:
    followupFieldLabels['prescribingOrganizationId']
})
