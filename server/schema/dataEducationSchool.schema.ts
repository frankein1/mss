import { z } from 'zod'
import { RepClassification, SchoolStatus, SchoolType } from '@prisma/client'
import { stringConstraint } from '.'

const schoolTypeMap: Record<string, SchoolType> = {
  'Ecole': SchoolType.Ecole,
  'Collège': SchoolType.College,
  'Lycée': SchoolType.Lycee,
  'EREA': SchoolType.EREA,
  'Médico-social': SchoolType.MedicoSocial,
  'Service administratif': SchoolType.ServiceAdministratif,
  'Information et orientation': SchoolType.InformationOrientation
}

function parseSchoolType(value: string): SchoolType {
  return schoolTypeMap[value] ?? SchoolType.Autre
}

const schoolStatusMap: Record<string, SchoolStatus> = {
  'OUVERT': SchoolStatus.OUVERT,
  'FERME': SchoolStatus.FERME,
  'A OUVRIR': SchoolStatus.AOUVRIR,
  'A FERMER': SchoolStatus.AFERMER
}

function parseSchoolStatus(value: string): SchoolStatus {
  return schoolStatusMap[value] ?? SchoolStatus.OUVERT
}

const repClassificationMap: Record<string, RepClassification> = {
  'REP': RepClassification.Rep,
  'REP+': RepClassification.RepPlus
}

function parseRepClassification(
  value: string | null
): RepClassification | null {
  if (!value) {
    return null
  }
  return repClassificationMap[value] ?? null
}

export const dataEducationSchoolApiSchema = z.object({
  identifiant_de_l_etablissement: z.string(),
  nom_etablissement: z.string(),
  type_etablissement: z.string(),
  libelle_nature: z.string(),
  adresse_1: z.string().nullish(),
  code_postal: z.string(),
  nom_commune: z.string(),
  code_commune: z.string(),
  libelle_departement: z.string(),
  libelle_region: z.string(),
  libelle_academie: z.string(),
  etat: z.string(),
  latitude: z.coerce.number().nullish(),
  longitude: z.coerce.number().nullish(),
  appartenance_education_prioritaire: z.string().nullish(),
  code_quartier_prioritaire: z.string().nullish(),
  nom_quartier_prioritaire: z.string().nullish()
})

export type DataEducationSchoolApiInput = z.infer<
  typeof dataEducationSchoolApiSchema
>

export const dataEducationSchoolServerSchema =
  dataEducationSchoolApiSchema.transform(v => ({
    uai: v.identifiant_de_l_etablissement,
    name: v.nom_etablissement,
    type: parseSchoolType(v.type_etablissement),
    nature: v.libelle_nature,
    address: v.adresse_1 ?? null,
    zipcode: v.code_postal,
    city: v.nom_commune,
    citycode: v.code_commune,
    department: v.libelle_departement,
    region: v.libelle_region,
    academy: v.libelle_academie,
    status: parseSchoolStatus(v.etat),
    latitude: v.latitude ?? null,
    longitude: v.longitude ?? null,
    repClassification: parseRepClassification(
      v.appartenance_education_prioritaire ?? null
    ),
    qpvCode: v.code_quartier_prioritaire ?? null,
    qpvName: v.nom_quartier_prioritaire ?? null
  }))

export type DataEducationSchoolServerInput = z.infer<
  typeof dataEducationSchoolServerSchema
>

export const searchDataEducationSchoolSchema = z.object({
  query: stringConstraint
})

export type SearchDataEducationSchoolInput = z.infer<
  typeof searchDataEducationSchoolSchema
>
