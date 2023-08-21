import { User } from '@prisma/client'
import { getInclusionConnectClient } from '~/server/lib'

export function getEmailContent(user: User) {
  const {
    public: {
      email: { from }
    }
  } = useRuntimeConfig()

  const client = getInclusionConnectClient()
  const registrationUrl = client.getRegistrationUrl()

  const content = `Bonjour,
</br></br></br>
  Votre responsable de structure ou l'équipe de Mon Suivi Social vous a ouvert des accès à l'application Mon Suivi Social.
</br></br>
Pour s'authentifier, Mon Suivi Social utilise l'outil Inclusion Connect.
</br></br>
Afin d'accéder à l'application, veuillez créer un compte InclusionConnect en utilisant <b>${user.email}</b> comme adresse e-mail.
</br></br>
<a href=${registrationUrl}>Créer son compte Inclusion Connect</a>
</br></br>
En cas de difficulté, contactez-nous à ${from}.
</br></br></br>
L'équipe de Mon Suivi Social`

  return content
}
