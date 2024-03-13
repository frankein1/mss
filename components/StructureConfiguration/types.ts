import { RouterOutput } from '~/server/trpc/routers'

export type StructureConfigurationInfo =
  RouterOutput['structure']['getCurrentUserStructure']['structure']
