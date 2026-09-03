import { UserRepo } from '~~/server/database'
import { customAlphabet } from 'nanoid'
import dayjs from 'dayjs'
import { createEmail } from '~~/server/query'
import type { AuthContext } from '~~/server/trpc'
import { VALIDATION_CODE_LENGTH } from '~~/server/utils/constants'
import { createEmailSubject } from '~~/server/email/createEmailSubject'

const nanoid = customAlphabet('123456789', VALIDATION_CODE_LENGTH)

export function createAuthorizationCode(userId: string) {
  return UserRepo.prisma.update({
    where: { id: userId },
    data: {
      authorizationCode: nanoid(),
      authorizationCodeValidity: dayjs().add(10, 'minutes').toDate()
    },
    select: {
      email: true,
      authorizationCode: true
    }
  })
}

export async function sendAuthorizationCode(ctx: AuthContext) {
  const created = await createAuthorizationCode(ctx.user.id)

  const config = useRuntimeConfig()
  await createEmail({
    config,
    to: created.email,
    subject: createEmailSubject(
      'Mon Suivi Social : code de validation pour votre export',
      config
    ),
    text: `Bonjour,

Vous avez effectué un export de données depuis Mon Suivi Social. Afin de confirmer cet export, vous devez renseigner ce code : ${created.authorizationCode}. <strong>Il est valable 10 minutes.</strong>

Pour rappel, nous attirons votre attention sur l'export de données personnelles en dehors de la plateforme de Mon Suivi Social :

- ces données doivent être sécurisées sur votre ordinateur
- elles ne doivent pas être partagées
- une fois utilisées, supprimez le fichier de votre ordinateur et de votre navigateur.

Pour plus d'informations, retrouvez l'article contenant les informations relatives au RGPD : https://mon-suivi-social.gitbook.io/mon-suivi-social/astuces/rgpd-les-bonnes-pratiques`,
    html: `Bonjour,
<br/><br/><br/>
Vous avez effectué un export de données depuis Mon Suivi Social. Afin de confirmer cet export, vous devez renseigner ce code : ${created.authorizationCode}. Il est valable 10 minutes.
<br/><br/>
Pour rappel, nous attirons votre attention sur l'export de données personnelles en dehors de la plateforme de Mon Suivi Social :
<br/><br/>
<ul>
<li>ces données doivent être sécurisées sur votre ordinateur</li>
<li>elles ne doivent pas être partagées</li>
<li>une fois utilisées, supprimez le fichier de votre ordinateur et de votre navigateur.</li>
</ul>
<br/><br/>
Pour plus d'informations, retrouvez <a href="https://mon-suivi-social.gitbook.io/mon-suivi-social/astuces/rgpd-les-bonnes-pratiques"  rel="noopener noreferrer">l'article contenant les informations relatives au RGPD</a>.`
  })
}
