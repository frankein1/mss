import { RouterOutput } from '~/server/trpc/routers'

export type StructureConfigurationInfo =
  RouterOutput['structure']['getCurrentUserStructure']['structure']

export type StructureConfigurationSocialSupportSubjects = RouterOutput['structure']['getCurrentUserStructure']['socialSupportSubjects']