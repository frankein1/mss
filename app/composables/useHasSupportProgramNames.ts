export async function useHasSupportProgramNames() {
  const trpcClient = useTrpcClient()

  const { data: supportProgramNames } =
    await trpcClient.supportProgram.getNameList.useQuery()

  const hasSupportProgramNames = computed(
    () => (supportProgramNames.value ?? []).length > 0
  )

  return { hasSupportProgramNames }
}
