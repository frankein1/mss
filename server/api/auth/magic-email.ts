import { User, UserRole } from '@prisma/client'
import { v4 } from 'uuid'
import { createEmail } from '~/server/lib/email'
import { UserRepo } from '~/server/database'
import { forbiddenError } from '~/server/trpc'
import { RoutePath } from '~/utils/routing'

async function getUser(email: string) {
  try {
    return await UserRepo.prisma.findUniqueOrThrow({
      where: { email }
    })
  } catch (err) {
    // FIXME: Remove log once error is identified
    console.error('[MagicEmail] User not found...', { email })
    throw err
  }
}

export default defineEventHandler(async event => {
  const { email: input } = await readBody(event)

  const user = await getUser(input)

  if (!user || user.role !== UserRole.Administrator) {
    throw forbiddenError()
  }

  const accessToken = v4()

  await UserRepo.prisma.update({
    where: { id: user.id },
    data: {
      accessToken,
      accessTokenValidity: new Date(Date.now() + 60 * 10 * 1000)
    }
  })

  await createEmail({
    to: user.email,
    subject: 'Mon Suivi Social - Espace Administrateur',
    ...getEmailContent(user, accessToken)
  })
  return { success: true }
})

function getEmailContent(user: User, accessToken: string) {
  const config = useRuntimeConfig()
  const text = `Bonjour ${user.firstName} ${user.lastName},

Veuillez cliquer sur le lien ci-dessous pour accéder à votre espace Administrateur :

${config.public.appUrl}${RoutePath.AuthValidateToken()}?token=${accessToken}

L'équipe de Mon Suivi Social
`

  const html = `Bonjour ${user.firstName} ${user.lastName},
<br/><br/>
Veuillez cliquer sur le lien ci-dessous pour accéder à votre espace Administrateur :
<br/><br/>
<a href="${
    config.public.appUrl
  }${RoutePath.AuthValidateToken()}?token=${accessToken}">Accéder à mon Mon Suivi Social</a>
  <br/><br/>
L'équipe de Mon Suivi Social
`

  return { text, html }
}
