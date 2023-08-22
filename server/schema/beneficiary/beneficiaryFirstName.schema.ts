import { z } from 'zod'

const beneficiaryFirstNameSchema = z
  .string()
  .nullish()
  .transform(v => {
    if (!v) {
      return v
    }
    const [firstLetter, ...rest] = v
    return `${firstLetter.toUpperCase()}${rest.join('')}`
  })

export { beneficiaryFirstNameSchema }
