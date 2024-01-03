import { getOne } from './queries'
import { SecurityRuleGrantee } from '~/server/security'

export async function get({
  user,
  id
}: {
  user: SecurityRuleGrantee
  id: string
}) {
  return await getOne(user, id)
}
