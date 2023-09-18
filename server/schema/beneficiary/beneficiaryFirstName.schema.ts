import { wordConstraint } from '~/utils/zod'

const beneficiaryFirstNameSchema = wordConstraint().transform(v => {
  if (!v) {
    return v
  }
  const [firstLetter, ...rest] = v
  return `${firstLetter.toUpperCase()}${rest.join('')}`
})

export { beneficiaryFirstNameSchema }
