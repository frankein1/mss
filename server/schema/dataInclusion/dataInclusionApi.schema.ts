import { z } from 'zod'

export const dataInclusionStructureApiSchema = z.object({
  id: z.string(),
  siret: z.string().optional(),
  rna: z.string().optional(),
  nom: z.string(),
  commune: z.string(),
  code_postal: z.string(),
  // code_insee: z.string(),
  adresse: z.string(),
  complement_adresse: z.string().optional(),
  // longitude: z.number(),
  // latitude: z.number(),
  typologie: z.string().optional(),
  telephone: z.string().optional(),
  courriel: z.string().optional(),
  site_web: z.string().optional(),
  // presentation_resume: z.string(),
  // presentation_detail: z.string(),
  // source: z.string(),
  date_maj: z.date(),
  antenne: z.boolean(),
  // lien_source: z.string(),
  horaires_ouverture: z.string().optional(),
  // accessibilite: z.string(),
  // labels_nationaux: z.array(z.string()),
  // labels_autres: z.array(z.string()),
  thematiques: z.array(z.string())
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
    city: v.commune,
    zipcode: v.code_postal,
    address: v.adresse,
    addressComplement: v.complement_adresse,
    type: v.typologie,
    phone: v.telephone,
    email: v.courriel,
    website: v.site_web,
    updated: v.date_maj,
    isBranch: v.antenne,
    workingHours: v.horaires_ouverture,
    topics: v.thematiques
  }))

export type dataInclusionStructureServerInput = z.infer<
  typeof dataInclusionStructureServerSchema
>
