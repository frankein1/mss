import { GetByFamilyFileIdInput } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security'
import { BeneficiaryRepo } from '~/server/database'

export default async function getByFamileFileId({
  ctx,
  input
}: {
  ctx: SecurityRuleContext
  input: GetByFamilyFileIdInput
}) {
  const { familyFileId } = input
  return BeneficiaryRepo.findMany(ctx.user, {
    where: { familyFileId },
    orderBy: [{ usualName: 'asc' }, { birthName: 'asc' }],
    select: {
      id: true,
      usualName: true,
      firstName: true,
      birthName: true,
      birthDate: true,
      relationship: true
    }
  })
}
