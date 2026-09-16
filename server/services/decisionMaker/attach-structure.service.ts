import { StructureType } from '@prisma/client'
import { prismaClient } from '~~/server/prisma'
import { structureContextSelect } from '~~/server/utils/fetchUserContext'

/**
 * Informations d'organisation renvoyées par ProConnect.
 *
 * Le scope `siret` est demandé à l'autorisation (voir proconnect.client.ts),
 * le SIRET est donc présent pour un agent rattaché à une organisation.
 * Le libellé n'est pas garanti : selon les fournisseurs d'identité il peut
 * arriver sous `label`, `organizational_unit`, ou ne pas venir du tout.
 */
type ProConnectOrganisation = Record<string, unknown>

function readString(value: unknown) {
  return typeof value === 'string' && value.trim() !== ''
    ? value.trim()
    : undefined
}

/**
 * Rattache un décideur à sa structure, déduite du SIRET fourni par ProConnect.
 *
 * Appelé uniquement à la première connexion d'un décideur, qui a été créé sans
 * structure par l'invitation d'une structure partenaire. Les autres rôles ne
 * passent jamais ici : leur structure est fixée à la création du compte.
 *
 * Si ProConnect ne fournit pas de SIRET, la personne reste sans structure.
 * C'est volontaire : son périmètre vient de ses autorisations de partage, pas
 * de son rattachement, donc elle accède quand même à ses statistiques.
 */
export async function attachDecisionMakerStructure(
  userId: string,
  userInfo: ProConnectOrganisation
) {
  const siret = readString(userInfo.siret)
  if (!siret) {
    return null
  }

  const name =
    readString(userInfo.label) ??
    readString(userInfo.organizational_unit) ??
    `Organisation ${siret}`

  const existing = await prismaClient.structure.findFirst({
    where: { siret, type: StructureType.Decideur },
    select: structureContextSelect
  })

  const structure =
    existing ??
    (await prismaClient.structure.create({
      data: {
        name,
        siret,
        type: StructureType.Decideur,
        // Une structure décideur ne suit aucun bénéficiaire : ces champs sont
        // obligatoires en base mais sans objet ici. Ils pourront être
        // complétés depuis l'espace d'administration si besoin.
        email: '',
        address: '',
        city: '',
        zipcode: '',
        phone: ''
      },
      select: structureContextSelect
    }))

  await prismaClient.user.update({
    where: { id: userId },
    data: { structureId: structure.id }
  })

  return structure
}
