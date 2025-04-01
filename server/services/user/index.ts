import { acceptCGU } from './acceptCGU.service'
import { sendAuthorizationCode } from './send-authorization-code.service'
import { verifyAuthorizationCode } from './verify-authorization-code.service'

export const UserService = {
  acceptCGU,
  sendAuthorizationCode,
  verifyAuthorizationCode
}
