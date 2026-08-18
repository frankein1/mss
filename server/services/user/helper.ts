import { UserRepo } from '~~/server/database'
import { customAlphabet } from 'nanoid'
import dayjs from 'dayjs'
import { VALIDATION_CODE_LENGTH } from '~~/server/utils/constants'

const nanoid = customAlphabet('123456789', VALIDATION_CODE_LENGTH)

export async function persistAuthorizationCode(userId: string) {
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
