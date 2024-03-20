import { RouterOutput } from '~/server/trpc/routers'

export type StructureFormType =
  RouterOutput['structure']['getStructure']['structure']
export type UsersStructureType = RouterOutput['admin']['getStructure']['users']
