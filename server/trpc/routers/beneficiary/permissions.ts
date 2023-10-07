import { shield, allow, deny } from 'trpc-shield'
import { AppContext } from '~/server/trpc'

export const beneficiaryPermissions = shield<AppContext>(
  {
    query: {
      search: allow,
      isBeneficiaryReferent: allow,
      getBeneficiaryMinimalInfo: allow,
      getBeneficiaryDetails: allow,
      getBeneficiarySecurityTarget: allow,
      getBeneficiaryDocuments: allow,
      getBeneficiaryHistory: allow,
      getBeneficiaries: allow,
      exportBeneficiaries: allow,
      getBeneficiaryFollowupTypes: allow
    },
    mutation: {
      create: allow,
      update: allow,
      updateGeneralInformation: allow,
      delete: allow,
      saveDraft: allow
    }
  },
  { fallbackRule: deny }
)
