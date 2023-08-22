import { ProtectedAppContext } from '~/server/trpc'
import { StatFilterInput } from '~/server/schema'
import { getBeneficiaryCountQuery } from '~/server/query/stats'

export const getBeneficiaryCountHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  return await getBeneficiaryCountQuery(user.structureId, input)
}
