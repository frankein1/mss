import { User, UserRole } from '@prisma/client'
import { v4 } from 'uuid'
import { sendEmail } from '~/server/lib/email'
import { prismaClient } from '~/server/prisma'
import { forbiddenError } from '~/server/trpc'
import { RoutePath } from '~/utils/routing'

export default defineEventHandler(async event => {
  const { email: input } = await readBody(event)

  const user = await prismaClient.user.findUnique({
    where: {
      email: input
    }
  })
  if (!user) {
    throw forbiddenError()
  }
  if (user.role !== UserRole.Administrator) {
    throw forbiddenError()
  }

  const accessToken = v4()

  await prismaClient.user.update({
    where: { id: user.id },
    data: {
      accessToken,
      accessTokenValidity: new Date(Date.now() + 60 * 10 * 1000)
    }
  })

  await sendEmail({
    to: user.email,
    subject: 'Mon Suivi Social | Espace Administrateur',
    html: getEmailContent(user, accessToken)
  })
  return { success: true }
})

function getEmailContent(user: User, accessToken: string) {
  const config = useRuntimeConfig()
  return `Bonjour ${user.firstName} ${user.lastName},
</br></br>
Veuillez cliquer sur le lien ci-dessous pour accéder à votre espace Administrateur:
</br></br>
<a href="${
    config.public.appUrl
  }${RoutePath.AuthValidateToken()}?token=${accessToken}">Accéder à mon Mon Suivi Social</a>
  </br></br>
L'équipe de Mon Suivi Social
`
}
