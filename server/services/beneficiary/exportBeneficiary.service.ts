import { ExportBeneficiaryInput } from '~/server/schema/beneficiary/exportbeneficiary.schema'
import { SecurityRuleContext } from '~/server/security'
import { BeneficiaryRepo, UserRepo } from '~/server/database'
import { PDFDocument, PageSizes, StandardFonts, rgb } from 'pdf-lib'

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
  const user = await UserRepo.findUniqueOrThrow(ctx.user, {
    where: { id: ctx.user.id }
  })

  // Info about size
  // Size are in typography point (pt) 1pt = 1/72 inch
  // 1pt +/- = 0,188 mm

  const pdfDoc = await PDFDocument.create()
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  // la fiche pdf récapitulative de l'archivage (qui a archivé, quelle date, le motif de l'archivage,
  // la date d'ouverture du dossier, nombre de suivis). Nom du fichier : Résumé_archive

  const introductionText = `– Dossier crée le ${beneficiaryDetails.created?.toLocaleDateString()}
– Dossier archivé le ${new Date().toLocaleDateString()}
– Archive réalisée par ${user.firstName} ${user.lastName}`

  const motiveText = `
Motif de l’archive : 
– ${input.reason}${input.date ? ' (le ' + input.date + ')' : ''}
${input.clarification ? '– ' + input.clarification : ''}`

  const page = pdfDoc.addPage(PageSizes.A4)
  const { width, height } = page.getSize()
  const titleFontSize = 28
  const fontSize = 16

  page.moveTo(20, 20)
  page.drawText(
    beneficiaryDetails.firstName + ' ' + beneficiaryDetails.usualName,
    {
      x: 20,
      y: height - 20 - fontSize,
      size: titleFontSize,
      font: helveticaBold,
      color: rgb(0, 0.53, 0.71)
    }
  )
  page.moveDown(20)
  page.drawText(introductionText + motiveText, {
    size: fontSize,
    font: helvetica,
    maxWidth: width - 40
  })
  page.moveDown(20)
  page.drawText(motiveText, {
    size: fontSize,
    font: helvetica,
    maxWidth: width - 40
  })

  const pdfBytes = await pdfDoc.save()

  const data = await pdfDoc.saveAsBase64({ dataUri: true })

  return { data, beneficiaryDetails }
}
