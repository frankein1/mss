import { z } from 'zod'
import { stringConstraint } from '../schema'

export const dataInclusionStructureApiSchema = z.object({
  id: z.string(),
  siret: z.string().nullable(),
  rna: z.string().nullable(),
  nom: z.string(),
  commune: z.string().nullable(),
  code_postal: z.string().nullable(),
  // code_insee: z.string(),
  adresse: z.string().nullable(),
  complement_adresse: z.string().nullable(),
  // longitude: z.number(),
  // latitude: z.number(),
  typologie: z.string().nullable(),
  telephone: z.string().nullable(),
  courriel: z.string().nullable(),
  site_web: z.string().nullable(),
  // presentation_resume: z.string(),
  // presentation_detail: z.string(),
  // source: z.string(),
  date_maj: z.number(),
  antenne: z.boolean().nullable(),
  // lien_source: z.string(),
  horaires_ouverture: z.string().nullable(),
  // accessibilite: z.string(),
  // labels_nationaux: z.array(z.string()),
  // labels_autres: z.array(z.string()),
  thematiques: z.array(z.string()).nullable()
})
export type DataInclusionStructureApiInput = z.infer<
  typeof dataInclusionStructureApiSchema
>
export const dataInclusionStructureServerSchema =
  dataInclusionStructureApiSchema.transform(v => ({
    id: v.id,
    siret: v.siret,
    rna: v.rna,
    name: v.nom,
    city: v.commune || 'Commune inconnue',
    zipcode: v.code_postal || 'Code postal inconnu',
    address: v.adresse || 'Adresse inconnue',
    addressComplement: v.complement_adresse,
    type: v.typologie,
    phone: v.telephone,
    email: v.courriel,
    website: v.site_web,
    updated: new Date(v.date_maj),
    isBranch: !!v.antenne,
    workingHours: v.horaires_ouverture,
    topics: v.thematiques || []
  }))
export type DataInclusionStructureServerInput = z.infer<
  typeof dataInclusionStructureServerSchema
>
export const searchDataInclusionStructureSchema = z.object({
  query: stringConstraint
})
export type SearchDataInclusionStructureInput = z.infer<
  typeof searchDataInclusionStructureSchema
>

export const dataInclusionStructureApiSchemaV1 = z.object({
  id: z.string(),
  source: z.string(),
  nom: z.string(),
  date_maj: z.string(),
  siret: z.string().nullish(),
  commune: z.string().nullish(),
  code_postal: z.string().nullish(),
  adresse: z.string().nullish(),
  complement_adresse: z.string().nullish(),
  telephone: z.string().nullish(),
  courriel: z.string().nullish(),
  site_web: z.string().nullish(),
  description: z.string().nullish(),
  horaires_accueil: z.string().nullish(),
  lien_source: z.string().nullish(),
  score_qualite: z.number().nullish(),
  doublons: z.array(z.object({ source: z.string(), id: z.string() })).nullish()
})

export type DataInclusionStructureApiInputV1 = z.infer<
  typeof dataInclusionStructureApiSchemaV1
>

export const dataInclusionStructureServerSchemaV1 =
  dataInclusionStructureApiSchemaV1.transform(v => ({
    id: v.id,
    siret: v.siret,
    name: v.nom,
    city: v.commune || 'Commune inconnue',
    zipcode: v.code_postal || 'Code postal inconnu',
    address: v.adresse || 'Adresse inconnue',
    addressComplement: v.complement_adresse,
    phone: v.telephone,
    email: v.courriel,
    website: v.site_web,
    updated: new Date(v.date_maj),
    workingHours: v.horaires_accueil,
    doublons: v.doublons?.map(d => d.id) ?? []
  }))

export type DataInclusionStructureServerInputV1 = z.infer<
  typeof dataInclusionStructureServerSchemaV1
>
