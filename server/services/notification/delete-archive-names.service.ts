import dayjs from 'dayjs'
import { ArchivedBeneficiaryRepo } from '~/server/database'

export const deleteArchivedNames = async () => {
  const oneYearAgo = dayjs().subtract(1, 'year').toDate()

  const res = await ArchivedBeneficiaryRepo.prisma.updateMany({
    where: {
      updated: { lte: oneYearAgo }
    },
    data: {
      title: null,
      usualName: null,
      birthName: null,
      firstName: null
    }
  })

  console.log(
    `delete-archive-names: [${new Date().toISOString()}]: ${res.count} archived beneficiaries anonymized`
  )
}
