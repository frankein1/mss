import dayjs from 'dayjs'
import { withErrorCapture } from '../utils'
import { StructureRepo } from '~/server/database'
import { SCHEDULER_ENV } from '../env'
import { disableStructure } from '~/server/services/admin/disable-structure.service'

const MAX_BENEFICIARIES = 10

async function disableInactiveStructures() {
  const limitDate = dayjs().subtract(6, 'months').subtract(2, 'weeks').toDate()

  const structures = await StructureRepo.prisma.findMany({
    where: {
      deactivationAlertEmail: 2,
      disabled: false,
      OR: [
        { lastAccess: { lte: limitDate } },
        { lastAccess: null, created: { lte: limitDate } }
      ]
    },
    select: {
      id: true,
      _count: { select: { beneficiaries: true } }
    }
  })

  const structuresToDisable = structures.filter(
    structure => structure._count.beneficiaries < MAX_BENEFICIARIES
  )

  if (structuresToDisable.length === 0) {
    console.log(`auto-disable-inactive-structures: no structure to disable`)
  } else {
    console.log(
      `auto-disable-inactive-structures: ${structuresToDisable.length} structure(s) to disable`
    )

    for (const structure of structuresToDisable) {
      await disableStructure({
        id: structure.id,
        disabledById: null,
        config: SCHEDULER_ENV
      })
      console.log(
        `auto-disable-inactive-structures: disabled structure ${structure.id}`
      )
    }
  }
}

export default async function handler() {
  return await withErrorCapture(disableInactiveStructures)
}
