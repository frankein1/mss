type PersistentType = {
  id: string
}

export function prepareRelationUpdates<
  T extends PersistentType,
  U extends PersistentType
>(updatedRelations: T[], previousRelations: U[], isUpdatable: boolean = true) {
  const createRelations = updatedRelations.filter(
    ({ id }) => !previousRelations.map(({ id }) => id).includes(id)
  )

  const deleteRelations = previousRelations.filter(
    ({ id }) => !updatedRelations.map(({ id }) => id).includes(id)
  )

  const updateRelations = isUpdatable
    ? updatedRelations.filter(({ id }) =>
        previousRelations.map(({ id }) => id).includes(id)
      )
    : undefined

  return {
    create: createRelations,
    delete: deleteRelations.map(({ id }) => ({ id })),
    update: (updateRelations || []).map(({ id, ...data }) => ({
      where: { id },
      data
    }))
  }
}
