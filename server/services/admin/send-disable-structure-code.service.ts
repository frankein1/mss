import { StructureRepo, UserRepo } from '~~/server/database'
import { customAlphabet } from 'nanoid'
import dayjs from 'dayjs'
import { createEmail } from '~~/server/query'
import { createEmailSubject } from '~~/server/email/createEmailSubject'
import { formatUTCTimestamp } from '~~/server/utils/formatUTCTimestamp'
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
      lastAccess: true,
      deactivationAlertEmail: true,
      deactivationAlertEmailDate: true,
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

  const lastAccess = structure.lastAccess
    ? formatUTCTimestamp(structure.lastAccess)
    : 'jamais'
  const isRecentlyActive =
    !!structure.lastAccess &&
    dayjs(structure.lastAccess).isAfter(
      dayjs().subtract(INACTIVITY_MONTHS, 'month')
    )
  const lastAccessHtmlItem = isRecentlyActive
    ? `<li style="color: red; font-weight: bold;">Dernière connexion : ${lastAccess}</li>`
    : `<li>Dernière connexion : ${lastAccess}</li>`
  const firstEmailDateTextLine = structure.deactivationAlertEmailDate
    ? `Date du premier e-mail d'alerte : ${formatUTCTimestamp(structure.deactivationAlertEmailDate)}\n`
    : ''
  const firstEmailDateHtmlItem = structure.deactivationAlertEmailDate
    ? `<li>Date du premier e-mail d'alerte : ${formatUTCTimestamp(structure.deactivationAlertEmailDate)}</li>\n`
    : ''

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
Dernière connexion : ${lastAccess}
Comptes utilisateurs : ${structure._count.users}
Bénéficiaires : ${structure._count.beneficiaries}
Accompagnements : ${structure._count.socialSupports}
E-mails d'alerte de désactivation envoyés : ${structure.deactivationAlertEmail}
${firstEmailDateTextLine}
Pour confirmer, saisissez ce code dans l'interface d'administration : ${created.authorizationCode}
Ce code est valable 10 minutes.

Attention, la désactivation d'une structure est irréversible. 

Une fois confirmée :

- les bénéficiaires et leurs accompagnements seront anonymisés ;
- les notifications, commentaires, documents, budgets et ateliers seront supprimés ;
- les comptes utilisateurs seront anonymisés et désactivés, et leurs titulaires recevront un email les informant de la suppression de leur espace de travail.

Vérifiez qu'il s'agit bien de la structure que vous souhaitez désactiver avant de saisir le code. Si vous n'êtes pas à l'origine de cette demande, ne communiquez ce code à personne et contactez-nous : ${SUPPORT_EMAIL}.

Cordialement,

L'équipe Mon Suivi Social`,
    html: `<p>Bonjour,</p>
<p>Vous venez de demander la désactivation d'une structure sur Mon Suivi Social.</p>
<ul>
<li>Nom de la structure : <strong>${structure.name}</strong></li>
<li>Commune : ${structure.zipcode} ${structure.city}</li>
${lastAccessHtmlItem}
<li>Comptes utilisateurs : ${structure._count.users}</li>
<li>Bénéficiaires : ${structure._count.beneficiaries}</li>
<li>Accompagnements : ${structure._count.socialSupports}</li>
<li>E-mails d'alerte de désactivation envoyés : ${structure.deactivationAlertEmail}</li>
${firstEmailDateHtmlItem}</ul>
<p>Pour confirmer, saisissez ce code dans l'interface d'administration : <strong>${created.authorizationCode}</strong><br/>
Ce code est valable 10 minutes.</p>
<p style="color: red; font-weight: bold;">Attention, la désactivation d'une structure est irréversible.</p>
<p>Une fois confirmée :</p>
<ul>
<li>les bénéficiaires et leurs accompagnements seront anonymisés ;</li>
<li>les notifications, commentaires, documents, budgets et ateliers seront supprimés ;</li>
<li>les comptes utilisateurs seront anonymisés et désactivés, et leurs titulaires recevront un email les informant de la suppression de leur espace de travail.</li>
</ul>
<p>Vérifiez qu'il s'agit bien de la structure que vous souhaitez désactiver avant de saisir le code. Si vous n'êtes pas à l'origine de cette demande, ne communiquez ce code à personne et contactez-nous : ${SUPPORT_EMAIL}.</p>
<p>Cordialement,</p>
<p>L'équipe Mon Suivi Social</p>`
  })
}
