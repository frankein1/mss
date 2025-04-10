import { RouterOutput } from '~/server/trpc/routers'

/** Detect structures in West-Indies/Guyana timezones */
export function useStructureState() {
  const trpcClient = useTrpcClient()

  const structure = useState<
    RouterOutput['structure']['getStructure']['structure'] | undefined | null
  >('structure:state', () => undefined)

  async function getStructure() {
    const res = await trpcClient.structure.getStructure.query()
    structure.value = res.structure
  }

  const guadeloupe = '971'
  const martinique = '972'
  const guyane = '973'

  const isAntillesGuyane = computed(() => {
    const code = structure.value?.zipcode.trim() || ''
    return (
      code.startsWith(martinique) ||
      code.startsWith(guadeloupe) ||
      code.startsWith(guyane)
    )
  })

  if (!structure.value) {
    getStructure().catch(() =>
      console.log('[useStructureState] Could not retrieve structure')
    )
  }

  return {
    isAntillesGuyane
  }
}
