import { prismaClient } from '~~/server/prisma'
import { getPageDocuments } from '~~/server/services/familyFile/getPageDocuments.service'
import type { SecurityRuleContext } from '~~/server/security'
import type { GetDocumentsInput } from '~~/server/schema'
import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole
} from './fixtures'

const structure = fixtureStructures[FixtureStructure.Test]
const user = fixturesUsers[FixtureUserRole.StructureManager]

const ctx: SecurityRuleContext = {
  user: {
    id: user.id,
    role: user.role,
    status: user.status,
    structureId: structure.id
  },
  structure: {
    id: structure.id,
    type: structure.type,
    externalRdvspActive: null
  }
}

async function main() {
  const familyFile = await prismaClient.familyFile.findFirst({
    where: { structureId: ctx.structure.id },
    select: {
      id: true,
      _count: { select: { documents: true, beneficiaries: true } }
    },
    orderBy: { documents: { _count: 'desc' } }
  })

  if (!familyFile) {
    console.error('No family file found for this structure')
    process.exit(1)
  }

  console.log(
    `Family file: ${familyFile.id} (${familyFile._count.documents} documents, ${familyFile._count.beneficiaries} beneficiaries)`
  )

  const input: GetDocumentsInput = {
    familyFileId: familyFile.id,
    page: 1,
    perPage: 20
  }

  // Warm up: first call to avoid cold-start bias
  await getPageDocuments({ ctx, input })

  const iterations = 10
  const durations: number[] = []

  for (let i = 0; i < iterations; i++) {
    const start = performance.now()
    const result = await getPageDocuments({ ctx, input })
    const duration = performance.now() - start
    durations.push(duration)

    if (i === 0) {
      console.log(`Documents returned: ${result.documents.length}`)
      console.log(`Total count: ${result.count}`)
      console.log(`Total pages: ${result.totalPages}`)
    }
  }

  durations.sort((a, b) => a - b)
  const avg = durations.reduce((s, d) => s + d, 0) / durations.length
  const p50 = durations[Math.floor(durations.length * 0.5)]
  const p95 = durations[Math.floor(durations.length * 0.95)]
  const min = durations[0]
  const max = durations[durations.length - 1]

  console.log(`\n--- ${iterations} iterations ---`)
  console.log(`avg: ${avg.toFixed(1)}ms`)
  console.log(`p50: ${p50!.toFixed(1)}ms`)
  console.log(`p95: ${p95!.toFixed(1)}ms`)
  console.log(`min: ${min!.toFixed(1)}ms`)
  console.log(`max: ${max!.toFixed(1)}ms`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prismaClient.$disconnect())
