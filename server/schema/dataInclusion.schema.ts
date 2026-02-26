import { z } from 'zod'
import { stringConstraint } from '.'

export const dataInclusionStructureApiSchema = z.object({
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
  score_qualite: z.number().nullish()
})

export type DataInclusionStructureApiInput = z.infer<
  typeof dataInclusionStructureApiSchema
>

export const dataInclusionStructureServerSchema =
  dataInclusionStructureApiSchema.transform(v => ({
    id: v.id,
    siret: v.siret,
    rna: null,
    name: v.nom,
    city: v.commune || 'Commune inconnue',
    zipcode: v.code_postal || 'Code postal inconnu',
    address: v.adresse || 'Adresse inconnue',
    addressComplement: v.complement_adresse,
    type: null,
    phone: v.telephone,
    email: v.courriel,
    website: v.site_web,
    updated: new Date(v.date_maj),
    isBranch: false,
    workingHours: v.horaires_accueil,
    topics: [] as string[]
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
