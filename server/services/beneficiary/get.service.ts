import { getOne } from './queries'
import type { SecurityRuleContext } from '~/server/security'

export async function get({
  ctx,
  id
}: {
  ctx: SecurityRuleContext
  id: string
}) {
  return await getOne(ctx, id)
}
