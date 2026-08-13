import { toOptions } from '~/utils/options'

export const useGetStructureInfo = async () => {
  const trpcClient = useTrpcClient()

  /** Inputs */

  /** API call */

  // Batch call for structure agents and active social support subjects
  const [agents, subjects] = await Promise.all([
    trpcClient.config.getAgents.useQuery(undefined, {
      transform: agents => toOptions(agents, 'id', 'name'),
      queryKey: 'config.getAgents.options'
    }),
    trpcClient.structure.getActiveOrUsedSocialSupportSubjects.useQuery(
      undefined,
      {
        transform: socialSupportSubjects =>
          toOptions(socialSupportSubjects, 'id', 'name'),
        queryKey: 'structure.getActiveOrUsedSocialSupportSubjects.options'
      }
    )
  ])

  return {
    agents,
    subjects
  }
}

export type GetStructureInfo = Awaited<ReturnType<typeof useGetStructureInfo>>

export const getStructureInfoInjectionKey: InjectionKey<GetStructureInfo> =
  Symbol('getStructureInfo')
