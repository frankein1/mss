import type { RouterOutput } from '~/server/trpc/routers'

export type StructureInfo =
  RouterOutput['structure']['getStructure']['structure']

export type SocialSupportSubjects =
  RouterOutput['structure']['getActiveSocialSupportSubjects']

export type StructureUsers = RouterOutput['admin']['getStructure']['users']

export type Structures = RouterOutput['admin']['getStructures']['structures']
