import { createEmail } from '~~/server/query'
import type { AuthContext } from '~~/server/trpc'
import { createEmailSubject } from '~~/server/email/createEmailSubject'
import { persistAuthorizationCode } from './helper'

export async function sendAuthorizationCode(
  ctx: AuthContext,
  type: 'export' | 'admin-user-transfer' = 'export'
) {
  const created = await persistAuthorizationCode(ctx.user.id)

  const config = useRuntimeConfig()
  await createEmail({
    config,
    to: created.email,
    ...getMailContent(created.authorizationCode, type)
  })
}

function getMailContent(
  authorizationCode: string | null,
  type: 'export' | 'admin-user-transfer' = 'export'
) {
  const config = useRuntimeConfig()

  if (type === 'export') {
    return {
      subject: createEmailSubject(
        'Mon Suivi Social : code de validation pour votre export',
        config
      ),
      text: `Bonjour,

Vous avez effectué un export de données depuis Mon Suivi Social. Afin de confirmer cet export, vous devez renseigner ce code : ${authorizationCode}. <strong>Il est valable 10 minutes.</strong>

Pour rappel, nous attirons votre attention sur l'export de données personnelles en dehors de la plateforme de Mon Suivi Social :

- ces données doivent être sécurisées sur votre ordinateur
- elles ne doivent pas être partagées
- une fois utilisées, supprimez le fichier de votre ordinateur et de votre navigateur.

Pour plus d'informations, retrouvez l'article contenant les informations relatives au RGPD : https://mon-suivi-social.gitbook.io/mon-suivi-social/astuces/rgpd-les-bonnes-pratiques`,
      html: `Bonjour,
<br/><br/><br/>
Vous avez effectué un export de données depuis Mon Suivi Social. Afin de confirmer cet export, vous devez renseigner ce code : ${authorizationCode}. Il est valable 10 minutes.
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
    }
  }

  if (type === 'admin-user-transfer') {
    return {
      subject: createEmailSubject(
        "Mon Suivi Social : code de confirmation pour un transfert d'utilisateur",
        config
      ),
      text: `Bonjour,

Vous vous apprêtez à transférer un utilisateur vers une autre structure sur Mon Suivi Social. Afin de confirmer cette opération sensible, vous devez renseigner ce code : ${authorizationCode}. Il est valable 10 minutes.

Si vous n'êtes pas à l'origine de cette action, veuillez immédiatement contacter l'équipe support de Mon Suivi Social.`,
      html: `Bonjour,
<br/><br/><br/>
Vous vous apprêtez à transférer un utilisateur vers une autre structure sur Mon Suivi Social. Afin de confirmer cette opération sensible, vous devez renseigner ce code : <strong>${authorizationCode}</strong>. Il est valable 10 minutes.
<br/><br/>
Si vous n'êtes pas à l'origine de cette action, veuillez immédiatement contacter l'équipe support de Mon Suivi Social.`
    }
  }

  throw new Error('not implemented')
}
