import { RouterOutput } from '~/server/trpc/routers'

export type StructureInfo =
  RouterOutput['structure']['getCurrentUserStructure']['structure']

export type SocialSupportSubjects =
  RouterOutput['structure']['getCurrentUserStructure']['socialSupportSubjects']
