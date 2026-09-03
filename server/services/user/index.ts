import {
  createAuthorizationCode,
  sendAuthorizationCode
} from './send-authorization-code.service'
import { verifyAuthorizationCode } from './verify-authorization-code.service'

export const UserService = {
  createAuthorizationCode,
  sendAuthorizationCode,
  verifyAuthorizationCode
}
