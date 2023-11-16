export function prepareBeneficiarySearchConditions(query: string) {
  const tokens = query.trim().replace(/%/g, '').split(/\s+/g)

  const fields = ['firstName', 'birthName', 'usualName', 'fileNumber'] as const

  const searchConditions = tokens.map(token => ({
    OR: fields.map(field => ({
      [field]: {
        contains: token,
        mode: 'insensitive'
      }
    }))
  }))

  return { AND: searchConditions }
}
