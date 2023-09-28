export function prepareRelationConnections(
  updatedRelationIds: string[],
  previousRelationIds: string[]
) {
  const connectIds =
    updatedRelationIds
      .filter(updatedId => !previousRelationIds.includes(updatedId))
      .map(id => ({ id })) || []

  const disconnectIds =
    previousRelationIds
      .filter(id => !updatedRelationIds.includes(id))
      .map(id => ({ id })) || []

  return {
    connect: connectIds,
    disconnect: disconnectIds
  }
}
