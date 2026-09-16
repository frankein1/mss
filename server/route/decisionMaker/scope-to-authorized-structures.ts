import type { SecurityRuleGrantee } from '~~/server/security'
import type { StatFilterInput } from '~~/server/schema'
import { prismaClient } from '~~/server/prisma'

/**
 * Restreint le périmètre d'un décideur aux structures qu'il a sélectionnées
 * dans le filtre du tableau de bord.
 *
 * Le filtre venant du client ne peut que **réduire** le périmètre : on prend
 * l'intersection avec les structures réellement autorisées, jamais l'union.
 * Un identifiant inconnu ou non autorisé est donc simplement ignoré.
 *
 * Sans sélection, le périmètre complet est conservé.
 */
export function scopeToAuthorizedStructures(
  user: SecurityRuleGrantee,
  authorizedStructureIds: string[],
  requestedStructureIds?: string[] | null
): SecurityRuleGrantee {
  const hasSelection =
    requestedStructureIds !== undefined &&
    requestedStructureIds !== null &&
    requestedStructureIds.length > 0

  const scoped = hasSelection
    ? authorizedStructureIds.filter(id => requestedStructureIds.includes(id))
    : authorizedStructureIds

  return { ...user, authorizedStructureIds: scoped }
}

/**
 * Traduit le filtre par nom d'objet d'accompagnement en identifiants.
 *
 * Un intitulé comme « Logement » existe en une ligne par structure. Le
 * décideur sélectionne un nom, qui est ici résolu en tous les identifiants
 * correspondants **dans son périmètre**, de sorte que le filtrage porte sur
 * les objets équivalents de toutes les structures qu'il consulte.
 *
 * Renvoie l'entrée inchangée s'il n'y a pas de sélection par nom.
 */
export async function resolveSocialSupportSubjectNames(
  user: SecurityRuleGrantee,
  input: StatFilterInput
): Promise<StatFilterInput> {
  const names = input.socialSupportSubjectNames
  if (!names || names.length === 0) {
    return input
  }

  const subjects = await prismaClient.socialSupportSubject.findMany({
    where: {
      name: { in: names },
      ownedByStructureId: { in: user.authorizedStructureIds ?? [] }
    },
    select: { id: true }
  })

  return {
    ...input,
    socialSupportSubjects: subjects.map(subject => subject.id)
  }
}
