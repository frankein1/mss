import { StructureRepo, UserRepo } from '~~/server/database'
import { customAlphabet } from 'nanoid'
import dayjs from 'dayjs'
import { createEmail } from '~~/server/query'
import { createEmailSubject } from '~~/server/email/createEmailSubject'
import { VALIDATION_CODE_LENGTH } from '~~/server/utils/constants'
import { INACTIVITY_MONTHS } from '~/utils/structure'
import { SUPPORT_EMAIL } from '~/utils/constants'
import type { AdminContext } from '~~/server/trpc'

const nanoid = customAlphabet('123456789', VALIDATION_CODE_LENGTH)

/** An active structure can only be disabled after the administrator confirms
 * with a single use code sent to their own email address.
 * (see server/services/admin/disable-structure.service.ts)
 */
export async function sendDisableStructureCode({
  ctx,
  id
}: {
  ctx: AdminContext
  id: string
}) {
  const structure = await StructureRepo.findUniqueOrThrow(ctx.user, {
    where: { id },
    select: {
      name: true,
      zipcode: true,
      city: true,
      _count: {
        select: {
          users: true,
          beneficiaries: true,
          socialSupports: true
        }
      }
    }
  })

  const created = await UserRepo.prisma.update({
    where: { id: ctx.user.id },
    data: {
      authorizationCode: nanoid(),
      authorizationCodeValidity: dayjs().add(10, 'minutes').toDate()
    },
    select: {
      email: true,
      authorizationCode: true
    }
  })

  const consequences = [
    'les bénéficiaires et leurs accompagnements seront anonymisés ;',
    'les notifications, commentaires, documents, budgets et ateliers seront supprimés ;',
    'les comptes utilisateurs seront anonymisés et désactivés, et leurs titulaires recevront un email les informant de la suppression de leur espace de travail.'
  ]

  const config = useRuntimeConfig()
  await createEmail({
    config,
    to: created.email,
    subject: createEmailSubject(
      'Mon Suivi Social : code de validation pour la désactivation d’une structure',
      config
    ),
    text: `Bonjour,

Vous venez de demander la désactivation d'une structure sur Mon Suivi Social.

Nom de la structure : ${structure.name}
Commune : ${structure.zipcode} ${structure.city}
Comptes utilisateurs : ${structure._count.users}
Bénéficiaires : ${structure._count.beneficiaries}
Accompagnements : ${structure._count.socialSupports}

Pour confirmer, saisissez ce code dans l'interface d'administration : ${created.authorizationCode}
Ce code est valable 10 minutes.

Attention, cette structure a eu une activité au cours des ${INACTIVITY_MONTHS} derniers mois et la désactivation est irréversible. Une fois confirmée :

${consequences.map(consequence => `- ${consequence}`).join('\n')}

Vérifiez qu'il s'agit bien de la structure que vous souhaitez désactiver avant de saisir le code. Si vous n'êtes pas à l'origine de cette demande, ne communiquez ce code à personne et contactez-nous : ${SUPPORT_EMAIL}.

Cordialement,

L'équipe Mon Suivi Social`,
    html: `<p>Bonjour,</p>
<p>Vous venez de demander la désactivation d'une structure sur Mon Suivi Social.</p>
<ul>
<li>Nom de la structure : <strong>${structure.name}</strong></li>
<li>Commune : ${structure.zipcode} ${structure.city}</li>
<li>Comptes utilisateurs : ${structure._count.users}</li>
<li>Bénéficiaires : ${structure._count.beneficiaries}</li>
<li>Accompagnements : ${structure._count.socialSupports}</li>
</ul>
<p>Pour confirmer, saisissez ce code dans l'interface d'administration : <strong>${created.authorizationCode}</strong><br/>
Ce code est valable 10 minutes.</p>
<p>Attention, cette structure a eu une activité au cours des ${INACTIVITY_MONTHS} derniers mois et la désactivation est irréversible. Une fois confirmée :</p>
<ul>
${consequences.map(consequence => `<li>${consequence}</li>`).join('\n')}
</ul>
<p>Vérifiez qu'il s'agit bien de la structure que vous souhaitez désactiver avant de saisir le code. Si vous n'êtes pas à l'origine de cette demande, ne communiquez ce code à personne et contactez-nous : ${SUPPORT_EMAIL}.</p>
<p>Cordialement,</p>
<p>L'équipe Mon Suivi Social</p>`
  })
}
