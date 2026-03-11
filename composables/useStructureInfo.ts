import type { RouterOutput } from '~/server/trpc/routers'

export const useStructureInfo = () => {
  const trpcClient = useTrpcClient()

  const structure = useState<
    RouterOutput['structure']['getStructure']['structure'] | undefined | null
  >('structure:state', () => undefined)

  async function getStructure() {
    const res = await trpcClient.structure.getStructure.query()
    structure.value = res.structure
  }
  if (!structure.value) {
    getStructure().catch(() =>
      console.log('[useStructureInfo] Could not retrieve structure')
    )
  }
  return structure
}
