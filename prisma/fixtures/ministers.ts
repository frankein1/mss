import type { Prisma } from '@prisma/client'

export const fixturesMinisters = [
  {
    id: 'f4a2c3b1-7e8d-4f5a-9b6c-2d3e4f5a6b7c',
    firstName: 'Test',
    lastName: 'Minister',
    function: 'Solidarités',
    government: 'Gouvernement Test',
    status: 'Current'
  }
] satisfies Prisma.MinisterEntityCreateManyInput[]
