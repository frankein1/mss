import { prismaClient } from '~/server/prisma'
import { exportWorkbook } from '~/server/services/followup/export.service'
import type { SecurityRuleContext } from '~/server/security'
import type { ExportFollowupsInput } from '~/server/schema'

const ctx: SecurityRuleContext = {
  user: {
    id: '7e5c1734-35cb-4047-9035-a944961a67a4',
    role: 'StructureManager',
    status: 'Active',
    structureId: '8adcd106-c652-4e4c-80df-beb373fae252'
  },
  structure: {
    id: '8adcd106-c652-4e4c-80df-beb373fae252',
    type: 'Ccas',
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
