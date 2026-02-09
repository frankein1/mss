import type { User } from '~/prisma/generated/client'
import { apiRoutes } from '~/utils/routes'

const urlGetStarted =
  'https://mon-suivi-social.gitbook.io/mon-suivi-social/configuration-au-demarrage/se-connecter-a-mon-suivi-social-agents'

const getMailContentFromProConnect = (
  email: string,
  siret: string,
  registrationUrl: string,
  from: string
) => ({
  text: `Bonjour,

Votre responsable de structure ou l'équipe de Mon Suivi Social vous a ouvert des accès à l'application Mon Suivi Social.

Pour s'authentifier, Mon Suivi Social utilise l'outil ProConnect.

Afin d'accéder à l'application :

1. Créez votre compte Pro Connect ${registrationUrl} en utilisant ${email} comme adresse e-mail ;
2. Renseignez votre n° de Siret. Celui transmis par votre responsable est le : ${siret} ;
3. Vérifiez votre adresse mail puis connectez-vous à Mon suivi Social !

N’hésitez pas à parcourir notre guide d’utilisation ${urlGetStarted} en cas de difficulté : tous les détails s’y trouvent pour vous connecter pas à pas ( texte lié avec :  https://mon-suivi-social.gitbook.io/mon-suivi-social/configuration-au-demarrage/se-connecter-a-mon-suivi-social-agents) !
Vous pouvez également nous contacter à l’adresse : ${from}.

L'équipe de Mon Suivi Social`,
  html: `Bonjour,
<br/><br/><br/>
Votre responsable de structure ou l'équipe de Mon Suivi Social vous a ouvert des accès à l'application Mon Suivi Social.
<br/><br/>
Pour s'authentifier, Mon Suivi Social utilise l'outil ProConnect.
<br/><br/>
Afin d'accéder à l'application :
<br/><br/>
<ol>
<li><a href=${registrationUrl} rel="noopener noreferrer">Créer son compte ProConnect</a> en utilisant ${email} comme adresse e-mail ;</li>
<li>Renseignez votre n° de Siret. Celui transmis par votre responsable est le : ${siret} ;</li>
<li>Vérifiez votre adresse mail puis connectez-vous à Mon suivi Social !</li>
</ol>
<br/><br/>
N’hésitez pas à parcourir notre <a href=${urlGetStarted} rel="noopener noreferrer">guide d’utilisation</a> en cas de difficulté : tous les détails s’y trouvent pour vous connecter pas à pas !
Vous pouvez également nous contacter à l’adresse : ${from}.
<br/><br/><br/>
L'équipe de Mon Suivi Social`
})

export function getUserCreationEmailContent(user: {
  email: string
  structure: {
    siret: string | null
  } | null
}) {
  const {
    public: {
      appUrl,
      email: { from }
    }
  } = useRuntimeConfig()

  const registrationUrl = `${appUrl}${apiRoutes.proConnect.ApiSignIn.path()}?mtm_campaign=Scalingo`

  return getMailContentFromProConnect(
    user.email,
    user.structure?.siret || 'Siret inconnu',
    registrationUrl,
    from
  )
}
