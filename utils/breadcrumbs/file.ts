import { breadcrumbs as ben } from './beneficiary'
import { routes } from '~/utils/routes'
import { BeneficiaryNames } from '~/types/beneficiary'

const r = routes.file

function getBreadFamilyFile(
  familyFileId: string,
  fileIdentification: BeneficiaryNames[] | null
) {
  return [
    {
      text: r.AppFile.title(fileIdentification),
      to: r.AppFile.path(familyFileId || '')
    }
  ]
}

export const breadcrumbs = {
  AppFile: (
    familyFileId: string,
    fileIdentification: BeneficiaryNames[] | null
  ) => [
    ...ben.AppBeneficiaries(),
    ...getBreadFamilyFile(familyFileId, fileIdentification)
  ]
}
