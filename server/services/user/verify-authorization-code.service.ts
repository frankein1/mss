import { timingSafeEqual } from 'crypto'
import { UserRepo } from '~~/server/database'
import type { AuthContext } from '~~/server/trpc'
import { forbiddenError } from '~~/server/trpc'
import dayjs from 'dayjs'

export async function verifyAuthorizationCode({
  ctx,
  input
}: {
  ctx: AuthContext
  input: { code: string }
}) {
  const user = await UserRepo.findUniqueOrThrow(ctx.user, {
    where: { id: ctx.user.id },
    select: {
      authorizationCode: true,
      authorizationCodeValidity: true
    }
  })

  const expired = dayjs().isAfter(dayjs(user.authorizationCodeValidity))
  const codeMatch =
    user.authorizationCode != null &&
    user.authorizationCode.length === input.code.length &&
    timingSafeEqual(
      Buffer.from(user.authorizationCode),
      Buffer.from(input.code)
    )

  if (expired || !codeMatch) {
    throw forbiddenError('Invalid code')
  }

  await UserRepo.prisma.update({
    where: { id: ctx.user.id },
    data: { authorizationCode: null, authorizationCodeValidity: null }
  })
}
