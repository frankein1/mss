import type { DecisionMakerContext } from '~~/server/trpc'
import type { StatFilterInput } from '~~/server/schema'
import { prismaClient } from '~~/server/prisma'
import {
  getBeneficiaryCountQuery,
  getFamilyFileCountQuery,
  getAgeStatsQuery,
  getGenderStatsQuery,
  getCityStatsQuery,
  getHelpRequestCountQuery,
  getHelpRequestStatusStatsQuery,
  getFileInstructionTypeStatsQuery,
  getFollowupCountQuery,
  getFollowupBeneficiaryNumberQuery,
  getFollowupSubjectsStatsQuery,
  getFollowupMediumStatsQuery
} from '~~/server/query/stats'
import {
  prepareBeneficiaryStatFilters,
  prepareDateFilters,
  prepareSocialSupportStatFilters
} from '~~/server/query/stats/helpers'
import {
  BeneficiaryRepo,
  SocialSupportRepo,
  WorkshopAttendeeRepo,
  WorkshopRepo
} from '~~/server/database'
import type { SecurityRuleGrantee } from '~~/server/security'
import {
  resolveSocialSupportSubjectNames,
  scopeToAuthorizedStructures
} from './scope-to-authorized-structures'

/**
 * Routes de consultation du tableau de bord décideur.
 *
 * Toutes sont en lecture seule et passent par decisionMakerProcedure, qui
 * charge le périmètre en base. Aucune ne reçoit d'identifiant de structure
 * de confiance : le filtre du client est intersecté avec le périmètre réel.
 */

/** Structures ayant autorisé ce décideur, pour l'onglet et le filtre */
export async function getAuthorizedStructures(ctx: DecisionMakerContext) {
  if (ctx.authorizedStructureIds.length === 0) {
    return []
  }

  return prismaClient.structure.findMany({
    where: { id: { in: ctx.authorizedStructureIds } },
    select: {
      id: true,
      name: true,
      type: true,
      city: true,
      zipcode: true
    },
    orderBy: { name: 'asc' }
  })
}

/** Organisation du décideur, telle que déduite de ProConnect */
export async function getMyOrganisation(ctx: DecisionMakerContext) {
  const user = await prismaClient.user.findUniqueOrThrow({
    where: { id: ctx.user.id },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      structure: {
        select: { name: true, siret: true, city: true, zipcode: true }
      }
    }
  })

  // Première structure à avoir invité ce décideur : c'est elle qui a créé
  // le compte, l'information est affichée dans l'onglet Configuration.
  const firstSharing = await prismaClient.statisticsSharing.findFirst({
    where: { decisionMakerId: ctx.user.id },
    orderBy: { createdAt: 'asc' },
    select: {
      createdAt: true,
      structure: { select: { name: true } },
      createdBy: { select: { firstName: true, lastName: true } }
    }
  })

  return { user, invitedBy: firstSharing }
}

/** Chiffres de tête du tableau de bord */
export async function getOverviewStats(
  ctx: DecisionMakerContext,
  input: StatFilterInput
) {
  const { user, input: scoped } = await prepare(ctx, input)

  const [beneficiaryCount, fileCount] = await Promise.all([
    getBeneficiaryCountQuery(user, scoped),
    getFamilyFileCountQuery(user, scoped)
  ])

  // Les requêtes sous-jacentes renvoient des objets : `{ count, new }` pour
  // les bénéficiaires, `{ family, beneficiary }` pour les dossiers, selon
  // qu'un dossier regroupe plusieurs personnes ou une seule.
  return {
    beneficiaries: beneficiaryCount.count,
    newBeneficiaries: beneficiaryCount.new,
    files: fileCount.family + fileCount.beneficiary,
    familyFiles: fileCount.family,
    structureCount: await countConcernedStructures(user, 'beneficiary', scoped)
  }
}

/**
 * Prépare le contexte d'une requête de statistiques : restreint le périmètre
 * aux structures sélectionnées, puis traduit le filtre par nom d'objet
 * d'accompagnement en identifiants de ce périmètre.
 */
async function prepare(ctx: DecisionMakerContext, input: StatFilterInput) {
  const user = scopeToAuthorizedStructures(
    ctx.user,
    ctx.authorizedStructureIds,
    input.structureIds
  )
  const scopedInput = await resolveSocialSupportSubjectNames(user, input)
  return { user, input: scopedInput }
}

/** Objets d'accompagnement de toutes les structures autorisées, dédoublonnés
 *  par nom : un même intitulé existe en une ligne par structure. */
export async function getSocialSupportSubjectNames(ctx: DecisionMakerContext) {
  if (ctx.authorizedStructureIds.length === 0) {
    return []
  }
  const subjects = await prismaClient.socialSupportSubject.findMany({
    where: {
      ownedByStructureId: { in: ctx.authorizedStructureIds },
      inactive: false
    },
    select: { name: true },
    distinct: ['name'],
    orderBy: { name: 'asc' }
  })
  return subjects.map(subject => subject.name)
}

/**
 * Nombre de structures qui contribuent réellement aux chiffres affichés.
 *
 * Ce n'est pas la taille du périmètre : un filtre sur l'objet
 * d'accompagnement ou sur la période peut ne laisser de données que dans
 * une partie des structures autorisées. Le décideur doit savoir sur combien
 * de structures porte ce qu'il lit.
 */
async function countConcernedStructures(
  user: SecurityRuleGrantee,
  source: 'beneficiary' | 'socialSupport' | 'workshop',
  input: StatFilterInput
) {
  if (source === 'beneficiary') {
    const rows = await BeneficiaryRepo.findMany(user, {
      where: prepareBeneficiaryStatFilters(input),
      select: { structureId: true },
      distinct: ['structureId']
    })
    return rows.length
  }

  if (source === 'socialSupport') {
    const rows = await SocialSupportRepo.findMany(user, {
      where: prepareSocialSupportStatFilters(input),
      select: { structureId: true },
      distinct: ['structureId']
    })
    return rows.length
  }

  const period = prepareDateFilters(input)
  const rows = await WorkshopRepo.findMany(user, {
    where: period ? { date: period } : {},
    select: { structureId: true },
    distinct: ['structureId']
  })
  return rows.length
}

/** Onglet « Entretiens » */
export async function getFollowupStats(
  ctx: DecisionMakerContext,
  input: StatFilterInput
) {
  const prepared = await prepare(ctx, input)

  const [count, beneficiaries, subjects, mediums] = await Promise.all([
    getFollowupCountQuery(prepared.user, prepared.input),
    getFollowupBeneficiaryNumberQuery(prepared.user, prepared.input),
    getFollowupSubjectsStatsQuery(prepared.user, prepared.input),
    getFollowupMediumStatsQuery(prepared.user, prepared.input)
  ])

  // Un même intitulé existe en une ligne par structure : on additionne pour
  // que le décideur lise un total, et non une ligne par structure. Le
  // regroupement porte sur l'intitulé exact.
  const bySubject = new Map<string, number>()
  for (const subject of subjects) {
    bySubject.set(
      subject.name,
      (bySubject.get(subject.name) ?? 0) + subject._count.socialSupports
    )
  }

  return {
    count,
    beneficiaries,
    mediums,
    structureCount: await countConcernedStructures(
      prepared.user,
      'socialSupport',
      prepared.input
    ),
    subjects: [...bySubject.entries()]
      .map(([name, total]) => ({ name, count: total }))
      .filter(entry => entry.count > 0)
      .sort((a, b) => b.count - a.count)
  }
}

/** Onglet « Instructions de dossiers » */
export async function getFileInstructionStats(
  ctx: DecisionMakerContext,
  input: StatFilterInput
) {
  const { user, input: scoped } = await prepare(ctx, input)

  const [count, types, statuses] = await Promise.all([
    getHelpRequestCountQuery(user, scoped),
    getFileInstructionTypeStatsQuery(user, scoped),
    getHelpRequestStatusStatsQuery(user, scoped)
  ])

  return {
    count,
    types,
    statuses,
    structureCount: await countConcernedStructures(
      user,
      'socialSupport',
      scoped
    )
  }
}

/**
 * Onglet « Ateliers ».
 *
 * Les requêtes d'ateliers existantes prennent un ProtectedAppContext et
 * filtrent sur `ctx.structure.id`, donc sur une structure unique : elles ne
 * sont pas réutilisables ici. Les décomptes passent par les repositories,
 * dont les contraintes appliquent le périmètre du décideur.
 */
export async function getWorkshopStats(
  ctx: DecisionMakerContext,
  input: StatFilterInput
) {
  const { user } = await prepare(ctx, input)

  const period = prepareDateFilters(input)
  const where = period ? { date: period } : {}

  const [workshops, attendees, byName] = await Promise.all([
    WorkshopRepo.count(user, { where }),
    WorkshopAttendeeRepo.count(user, { where: { workshop: where } }),
    WorkshopRepo.findMany(user, {
      where,
      select: { workshopName: { select: { id: true, name: true } } }
    })
  ])

  // Regroupement par nom d'atelier, fait ici faute de groupBy sur une
  // relation dans Prisma.
  const counts = new Map<string, { name: string; count: number }>()
  for (const workshop of byName) {
    const name = workshop.workshopName?.name ?? null
    if (!name) {
      continue
    }
    const entry = counts.get(name) ?? { name, count: 0 }
    entry.count += 1
    counts.set(name, entry)
  }

  return {
    workshops,
    attendees,
    structureCount: await countConcernedStructures(user, 'workshop', input),
    byName: [...counts.values()].sort((a, b) => b.count - a.count)
  }
}

/** Répartitions affichées en cartes */
export async function getDistributionStats(
  ctx: DecisionMakerContext,
  input: StatFilterInput
) {
  const { user, input: scoped } = await prepare(ctx, input)

  const [age, gender, city] = await Promise.all([
    getAgeStatsQuery(user, scoped),
    getGenderStatsQuery(user, scoped),
    getCityStatsQuery(user, scoped)
  ])

  return { age, gender, city }
}
