import { StructureType } from '@prisma/client'
import {
  SecurityRuleGrantee,
  SecurityTargetWithReferents,
  SecurityTargetWithStructure
} from './rules'
import { isInSameStructureAs, isReferentFor } from './rules/helpers'

const canReadWriteGeneral = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent'
  ]) || isReferentFor(grantee, beneficiary)

const canReadWriteOther = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor'
  ]) || isReferentFor(grantee, beneficiary)

const canReadWriteNIR = (type: StructureType | undefined): boolean =>
  type === StructureType.Ccas ||
  type === StructureType.Cias ||
  type === StructureType.Commune

const canDelete = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure
): boolean => isInSameStructureAs(grantee, beneficiary, ['StructureManager'])

export const BeneficiaryRules = {
  insert: true,
  select: {
    general: canReadWriteGeneral,
    externalOrganisations: canReadWriteOther,
    healthInfo: canReadWriteOther,
    healthInfoNir: canReadWriteNIR,
    occupationIncome: canReadWriteOther,
    relatives: canReadWriteOther,
    referents: canReadWriteOther
  },
  update: {
    general: canReadWriteGeneral,
    externalOrganisations: canReadWriteOther,
    healthInfo: canReadWriteOther,
    healthInfoNir: canReadWriteNIR,
    occupationIncome: canReadWriteOther,
    relatives: canReadWriteOther,
    referents: canReadWriteOther
  },
  delete: canDelete
}
