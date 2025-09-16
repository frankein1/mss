import { z } from 'zod'

const beneficiaryMessage = 'Veuillez sélectionner au moins un bénéficiaire.'
const workshopMessage = 'Veuillez sélectionner au moins un atelier.'

export const registerBeneficiariesSchema = z.object({
  beneficiaryIds: z.array(z.string().nonempty(beneficiaryMessage), {
    required_error: beneficiaryMessage
  }),
  workshopIds: z.array(z.string().nonempty(workshopMessage), {
    required_error: workshopMessage
  })
})

export type RegisterBeneficiariesInput = z.infer<
  typeof registerBeneficiariesSchema
>
