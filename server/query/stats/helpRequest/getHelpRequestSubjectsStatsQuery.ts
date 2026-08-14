import {
  prepareHelpRequestStatFilters,
  prepareSocialSupportStatFilters
} from '../helpers'
import {
  SocialSupportConstraints,
  SocialSupportSubjectRepo,
  HousingHelpRequestRepo
} from '~~/server/database'
import type { StatFilterInput } from '~~/server/schema'
import type { SecurityRuleGrantee } from '~~/server/security/rules/types'
import { appendConstraints } from '~~/server/database/repository/helper/appendConstraints'

export async function getHelpRequestSubjectsStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const socialSupportWhere = {
    where: prepareHelpRequestStatFilters(input)
  }
  appendConstraints(user, socialSupportWhere, SocialSupportConstraints.get)

  const getSocialSuportSubjects = SocialSupportSubjectRepo.findMany(user, {
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          socialSupports: {
            where: {
              ...socialSupportWhere.where,
              socialSupportType: 'HelpRequest'
            }
          }
        }
      }
    }
  })
  const getHousingCount = HousingHelpRequestRepo.count(user, {
    where: {
      fileInstruction: {
        socialSupport: prepareSocialSupportStatFilters(input)
      }
    }
  })

  if (
    input.helpRequestSubject != null &&
    input.helpRequestSubject != 'Housing'
  ) {
    const socialSupports = await getSocialSuportSubjects
    return socialSupports.sort(
      (a, b) => b._count.socialSupports - a._count.socialSupports
    )
  }
  if (input.helpRequestSubject === 'Housing') {
    const housingCount = await getHousingCount
    return [
      {
        id: 'housingHelpRequest',
        name: 'Demande de logement',
        _count: { socialSupports: housingCount }
      }
    ]
  }
  const socialSupports = await getSocialSuportSubjects
  const housingCount = await getHousingCount

  const totalSocialSupportsSubjects = [
    ...socialSupports,
    {
      id: 'housingHelpRequest',
      name: 'Demande de logement',
      _count: { socialSupports: housingCount }
    }
  ]

  return totalSocialSupportsSubjects.sort(
    (a, b) => b._count.socialSupports - a._count.socialSupports
  )
}
