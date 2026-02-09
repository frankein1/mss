import type { Structure, User } from '~/prisma/generated/client'
import { UserStatus } from '~/prisma/generated/client'
import dayjs from 'dayjs'
import { formatUTCTimestamp } from '~/server/utils/formatUTCTimestamp'

const BREVO_LIST_ID = 10
const runtimeConfig = useRuntimeConfig()

export function mapUserToBrevoContact(
  user: Pick<
    User,
    | 'email'
    | 'id'
    | 'firstName'
    | 'lastName'
    | 'role'
    | 'created'
    | 'firstAccess'
    | 'lastAccess'
    | 'status'
  > & {
    structure:
      | (Pick<Structure, 'lastAccess' | 'type' | 'siret' | 'name'> & {
          _count: { beneficiaries: number; socialSupports: number }
        })
      | null
  } & {
    _count: { overseenBeneficiaries: number; createdSocialSupports: number }
  }
) {
  const {
    email,
    id,
    firstName,
    lastName,
    role,
    structure,
    created,
    firstAccess,
    lastAccess,
    status,
    _count: { overseenBeneficiaries, createdSocialSupports }
  } = user
  return {
    ext_id: id,
    attributes: {
      email,
      PRENOM: firstName,
      NOM: lastName,
      ROLE: role,
      TYPE_STRUCTURE: structure?.type || '',
      SIRET_STRUCTURE: structure?.siret || '',
      NOM_STRUCTURE: structure?.name || '',
      DERNIERE_CONNEXION_STRUCTURE:
        formatUTCTimestamp(structure?.lastAccess, 'DD-MM-YYYY') || undefined,
      ACCES_MSS: status === UserStatus.Active,
      STRUCTURE_AVEC_1_SUIVI: (structure?._count.socialSupports ?? 0) > 0,
      CREATION_DATE: formatUTCTimestamp(created, 'DD-MM-YYYY') || undefined,
      PREMIERE_CONNEXION:
        formatUTCTimestamp(firstAccess, 'DD-MM-YYYY') || undefined,
      DERNIERE_CONNEXION:
        formatUTCTimestamp(lastAccess, 'DD-MM-YYYY') || undefined,
      UTILISATEUR_AVEC_1_SUIVI: createdSocialSupports > 0,
      NOMBRE_BENEFICIAIRES_UTILISATEUR: overseenBeneficiaries,
      NOMBRE_SUIVIS_UTILISATEUR: createdSocialSupports,
      NOMBRE_BENEFICIAIRES_STRUCTURE: structure?._count.beneficiaries,
      NOMBRE_SUIVIS_STRUCTURE: structure?._count.socialSupports
    },
    listIds: [BREVO_LIST_ID],
    updateEnabled: true
  }
}

export function mapStructureToBrevoCompany(
  structure: Pick<
    Structure,
    | 'id'
    | 'name'
    | 'lastAccess'
    | 'lastActivity'
    | 'created'
    | 'phone'
    | 'email'
    | 'dpoEmail'
    | 'dpoFirstName'
    | 'dpoLastName'
    | 'type'
  > & {
    _count: {
      users: number
      beneficiaries: number
      deactivatedUsers: number
      managerUsers: number
      socialSupports: number
    }
  }
) {
  const {
    id,
    name,
    lastAccess,
    lastActivity,
    created,
    phone,
    email,
    dpoEmail,
    dpoFirstName,
    dpoLastName,
    type
  } = structure

  // Be careful about the case with company attributes:
  // Brevo API seems to be case-sensitive when it wants to.
  // Uppercase attributes will appear in uppercase in the UI,
  // however in the API calls, they need to be lowercase ¯\_(ツ)_/¯.
  return {
    name,
    attributes: {
      ext_id: id,
      number_of_employees: structure._count.users,
      phone,
      domain: `${runtimeConfig.public.appUrl}/admin/structures/${id}`,
      action_30_derniers_jours: dayjs().diff(lastActivity, 'day') <= 30,
      adresse_mail_structure: email,
      creation_compte: formatUTCTimestamp(created, '') || undefined,
      derniere_connexion: formatUTCTimestamp(lastAccess, '') || undefined,
      dpo_renseigne: [dpoEmail, dpoFirstName, dpoLastName].every(
        value => value != null && value !== ''
      ),
      nombre_beneficiaires: structure._count.beneficiaries,
      nombre_compte_utilisateurs_desactives: structure._count.deactivatedUsers,
      nombre_respo_structure: structure._count.managerUsers,
      nombre_suivis: structure._count.socialSupports,
      // premiere_connexion: 0 // We don't have that info
      type_structure: type.toLowerCase()
    }
  }
}
