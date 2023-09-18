import { z } from 'zod'
import { updateBeneficiaryDraftSchema } from '../beneficiaryDraft'

export const saveDraftSchema = updateBeneficiaryDraftSchema.extend({
  id: z.string().uuid().optional()
})

export type SaveDraftInput = z.infer<typeof saveDraftSchema>
