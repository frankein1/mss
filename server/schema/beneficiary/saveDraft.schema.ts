import { z } from 'zod'
import { updateBeneficiaryDraftSchema } from '../beneficiaryDraft'

export const saveDraftSchema = updateBeneficiaryDraftSchema.extend({
  id: z.string().uuid()
})

export type SaveDraftInput = z.infer<typeof saveDraftSchema>
