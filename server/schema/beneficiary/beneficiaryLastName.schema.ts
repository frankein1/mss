import { wordConstraint } from '~/utils/zod'

const beneficiaryLastNameSchema = wordConstraint().toUpperCase()

export { beneficiaryLastNameSchema }
