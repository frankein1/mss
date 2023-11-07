import { FollowupType } from '@prisma/client'

export function prepareFollowupTypesMutations(
  inputTypes: string[],
  targetTypes?: FollowupType[]
) {
  return {
    connect: inputTypes.map(id => ({ id })),
    disconnect: targetTypes
      ?.filter(({ id }) => !inputTypes.includes(id))
      .map(({ id }) => ({ id }))
  }
}
