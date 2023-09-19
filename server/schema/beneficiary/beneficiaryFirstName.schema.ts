import {
  stringConstraint,
  maxStringLengthMessage,
  minStringLengthMessage
} from '~/utils/zod'

const beneficiaryFirstNameSchema = stringConstraint
  .min(2, minStringLengthMessage(2))
  .max(50, maxStringLengthMessage(50))
  .transform(v => {
    if (!v) {
      return v
    }
    const [firstLetter, ...rest] = v
    return `${firstLetter.toUpperCase()}${rest.join('')}`
  })

export { beneficiaryFirstNameSchema }
