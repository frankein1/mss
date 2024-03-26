import { RouterOutput } from '~/server/trpc/routers'

export type StructureInfo =
  RouterOutput['structure']['getStructure']['structure']

export type SocialSupportSubjects =
  RouterOutput['structure']['getStructure']['socialSupportSubjects']

export type StructureUsers = RouterOutput['admin']['getStructure']['users']
