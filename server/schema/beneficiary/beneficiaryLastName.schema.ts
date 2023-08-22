import { z } from 'zod'

const beneficiaryLastNameSchema = z.string().toUpperCase().nullish()

export { beneficiaryLastNameSchema }
