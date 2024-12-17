import { ExportBeneficiaryInput } from '~/server/schema/beneficiary/exportbeneficiary.schema'
import { SecurityRuleContext } from '~/server/security'
import { BeneficiaryRepo } from '~/server/database'
import PDFDocument from 'pdfkit'

export const exportBeneficiary = async ({
  ctx,
  input
}: {
  ctx: SecurityRuleContext
  input: ExportBeneficiaryInput
}) => {
  const beneficiaryDetails = await BeneficiaryRepo.findUniqueOrThrow(ctx.user, {
    where: { id: input.beneficiaryId }
  })

  const stream = await new Promise<Buffer>(resolve => {
    const pdfDoc = new PDFDocument()
    const buffs: unknown[] = []
    pdfDoc.on('data', d => {
      buffs.push(d as readonly Uint8Array[])
    })
    pdfDoc.on('end', () => {
      resolve(Buffer.concat(buffs as readonly Uint8Array[]))
    })
    pdfDoc.fontSize(25).text('Some text with an embedded font!', 100, 100)
    pdfDoc.end()
  })

  const data = stream.toString('base64')

  return { data }
}
