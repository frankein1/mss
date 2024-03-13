import { RouterOutput } from '~/server/trpc/routers'

export type StructureConfigurationOutput =
  RouterOutput['structure']['getCurrentUserStructure']['structure']
