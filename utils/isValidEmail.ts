import * as EmailValidator from 'email-validator'

export function isValidEmail(email: string) {
  if (!email) {
    return true
  }

  if (email.length > 254) {
    return false
  }

  const valid = EmailValidator.validate(email)
  if (!valid) {
    return false
  }

  // Further checking of some things regex can't handle
  const parts = email.split('@')
  if (parts[0].length > 64) {
    return false
  }

  const domainParts = parts[1].split('.')
  if (
    domainParts.some(function (part) {
      return part.length > 63
    })
  ) {
    return false
  }

  return true
}
