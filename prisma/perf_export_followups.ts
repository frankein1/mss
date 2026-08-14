import { prismaClient } from '~~/server/prisma'
import { exportWorkbook } from '~~/server/services/followup/export.service'
import type { SecurityRuleContext } from '~~/server/security'
import type { ExportFollowupsInput } from '~~/server/schema'
import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole
} from './fixtures'

const user = fixturesUsers[FixtureUserRole.StructureManager]
const structure = fixtureStructures[FixtureStructure.Test]

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

const input: ExportFollowupsInput = {
  code: '',
  filters: {},
  orderBy: { socialSupport: { date: 'desc' } }
}

async function main() {
  const count = await prismaClient.socialSupport.count({
    where: {
      structureId: ctx.structure.id,
      socialSupportType: 'Followup'
    }
  })
  console.log(`Followups in structure: ${count}`)

  console.time('exportWorkbook')
  const workbook = await exportWorkbook({ ctx, input })
  console.timeEnd('exportWorkbook')

  const worksheet = workbook.getWorksheet('Entretiens')!
  console.log(`Exported rows: ${worksheet.rowCount - 1}`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prismaClient.$disconnect())
