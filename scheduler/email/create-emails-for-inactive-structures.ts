import dayjs from 'dayjs'
import { StructureRepo } from '~/server/database'
import { UserStatus } from '@prisma/client'
import { withErrorCapture } from '../utils'
import { createEmail, createEmailSubject } from './utils'
import { routes } from '~/utils/routes'
import { SCHEDULER_ENV } from '../env'

export function getInactiveStructureAlert() {
  const landingPageUrl = SCHEDULER_ENV.public.landingPageUrl

  const text = `Bonjour,

Après plusieurs mois d'inactivité sur votre espace de travail Mon suivi Social celui-ci va être supprimé ainsi que l'ensemble des données consignées si vous ne vous connectez pas dans les prochains jours.

Rendez-vous sur ${routes.landing.SeConnecter.path(landingPageUrl)} pour consigner les informations de vos bénéficiaires et conserver les données déjà saisies.

Pour toute question, vous pouvez nous contacter par retour de mail.

Toute l'équipe de Mon Suivi social reste à votre disposition.

A bientôt,

L'équipe Mon Suivi Social`

  const html = `Bonjour,
<br/><br/>  
Après plusieurs mois d'inactivité sur votre espace de travail Mon suivi Social celui-ci va être supprimé ainsi que l'ensemble des données consignées si vous ne vous connectez pas dans les prochains jours.
<br/><br/>
Rendez-vous sur <a href="${routes.landing.SeConnecter.path(landingPageUrl)}" rel="noopener noreferrer">${routes.landing.SeConnecter.path(landingPageUrl)}</a> pour consigner les informations de vos bénéficiaires et conserver les données déjà saisies.
<br/><br/>
Pour toute question, vous pouvez nous contacter par retour de mail.
<br/><br/>
Toute l'équipe de Mon Suivi social reste à votre disposition.
<br/><br/>
A bientôt,
<br/><br/>
<b>L'équipe Mon Suivi Social</b>`

  return { text, html }
}

async function sendFirstEmail() {
  const inactiveStructures = await StructureRepo.prisma.findMany({
    where: {
      OR: [
        {
          lastAccess: {
            lte: dayjs().subtract(6, 'month').toDate()
          }
        },
        {
          lastAccess: null,
          created: {
            lte: dayjs().subtract(6, 'month').toDate()
          }
        }
      ],
      deactivationAlertEmail: 0
    },
    select: {
      id: true,
      users: {
        where: {
          status: UserStatus.Active
        }
      }
    }
  })

  await sendEmail(inactiveStructures.flatMap(s => s.users))

  await StructureRepo.prisma.updateMany({
    where: {
      id: {
        in: inactiveStructures.map(s => s.id)
      }
    },
    data: {
      deactivationAlertEmailDate: new Date(),
      deactivationAlertEmail: 1
    }
  })
}

async function sendSecondEmail() {
  const inactiveStructures = await StructureRepo.prisma.findMany({
    where: {
      deactivationAlertEmailDate: {
        lte: dayjs().subtract(2, 'week').toDate()
      },
      deactivationAlertEmail: 1
    },
    select: {
      id: true,
      users: {
        where: {
          status: UserStatus.Active
        }
      }
    }
  })

  await sendEmail(inactiveStructures.flatMap(s => s.users))

  await StructureRepo.prisma.updateMany({
    where: {
      id: {
        in: inactiveStructures.map(s => s.id)
      }
    },
    data: {
      deactivationAlertEmail: 2
    }
  })
}

async function sendEmail(users: { email: string }[]) {
  for (const user of users) {
    await createEmail({
      to: user.email,
      subject: createEmailSubject(
        'Votre espace de travail sur Mon Suivi Social va être supprimé'
      ),
      ...getInactiveStructureAlert()
    })
  }
}

async function createEmailForInactiveStructures() {
  await sendFirstEmail()
  await sendSecondEmail()
}

/** Structure that have had no activity in the last 6 months receive 2 mails spaced of 2 weeks
 * to remind them that their account and data will be deleted
 */
export default async function handler() {
  return await withErrorCapture(createEmailForInactiveStructures)
}
