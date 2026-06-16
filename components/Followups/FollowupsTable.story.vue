<template>
  <h3>Followups Table</h3>
  <FollowupsTable
    v-model:sort="orderBy"
    :items="pageItems"
    :pending="false"
  />
</template>

<script setup lang="ts">
  import { SortOrder, type FollowupSort } from '~/types/table'
  import type { FollowupPageItems } from '~/server/trpc/routers'

  const orderBy = ref<FollowupSort>({ socialSupport: { date: SortOrder.Desc } })

  const baseFollowup = {
    subtype: null,
    updated: null,
    lastUpdatedBy: null,
    dueDate: null,
    privateSynthesis: null,
    privateSynthesisRichText: null,
    synthesis: null,
    synthesisRichText: null,
    ministerId: null,
    minister: null,
    socialSupportRedirections: null,
    numeroPegase: null,
    endOfSocialSupport: false,
    classified: null,
    forwardedToJustice: null,
    prescribingOrganization: null,
    prescribingOrganizationContact: null,
    firstFollowup: null,
    helpRequested: null,
    thirdPersonName: null,
    place: null,
    duration: null,
    documents: [] as { key: string; name: string }[],
    supportProgramId: null,
    supportProgram: null
  }

  const pageItems: FollowupPageItems = [
    {
      followup: {
        ...baseFollowup,
        id: '1',
        socialSupportId: 'ss-1',
        socialSupportType: 'Followup',
        date: new Date('2024-01-15'),
        structureId: 'structure-1',
        created: new Date('2024-01-15'),
        createdById: 'user-1',
        createdBy: { id: 'user-1', firstName: 'Alice', lastName: 'Martin' },
        status: 'InProgress',
        subjects: [
          {
            id: 'subj-1',
            name: 'Logement',
            createdById: 'user-1',
            ownedByStructureId: 'structure-1',
            default: null,
            created: new Date('2024-01-15'),
            inactive: false,
            used: true
          }
        ],
        familyFile: { id: 'ff-1', structureId: 'structure-1', referents: [] },
        familyFileId: 'ff-1',
        beneficiary: {
          id: 'ben-1',
          firstName: 'Marie',
          usualName: 'DUPONT',
          birthName: 'DUPONT',
          birthDate: new Date('1980-03-12'),
          fileNumber: 'ben-1'
        },
        beneficiaryId: 'ben-1',
        dueDate: new Date('2024-02-15'),
        medium: 'PlannedInPerson'
      },
      permissions: {
        view: true,
        edit: true,
        delete: false,
        get: { details: true, privateSynthesis: false },
        set: { privateSynthesis: false }
      }
    },
    {
      followup: {
        ...baseFollowup,
        id: '2',
        socialSupportId: 'ss-2',
        socialSupportType: 'Followup',
        date: new Date('2024-02-03'),
        structureId: 'structure-1',
        created: new Date('2024-02-03'),
        createdById: 'user-2',
        createdBy: { id: 'user-2', firstName: 'Jean', lastName: 'Bernard' },
        status: 'Done',
        subjects: [
          {
            id: 'subj-2',
            name: 'Emploi',
            createdById: 'user-1',
            ownedByStructureId: 'structure-1',
            default: null,
            created: new Date('2024-01-15'),
            inactive: false,
            used: true
          },
          {
            id: 'subj-3',
            name: 'Santé',
            createdById: 'user-1',
            ownedByStructureId: 'structure-1',
            default: null,
            created: new Date('2024-01-15'),
            inactive: false,
            used: true
          }
        ],
        familyFile: { id: 'ff-2', structureId: 'structure-1', referents: [] },
        familyFileId: 'ff-2',
        beneficiary: {
          id: 'ben-2',
          firstName: 'Paul',
          usualName: 'LEROY',
          birthName: 'LEROY',
          birthDate: new Date('1975-07-22'),
          fileNumber: 'ben-2'
        },
        beneficiaryId: 'ben-2',
        medium: 'PhoneCall'
      },
      permissions: {
        view: true,
        edit: false,
        delete: false,
        get: { details: true, privateSynthesis: false },
        set: { privateSynthesis: false }
      }
    },
    {
      followup: {
        ...baseFollowup,
        id: '3',
        socialSupportId: 'ss-3',
        socialSupportType: 'Followup',
        date: new Date('2024-02-20'),
        structureId: 'structure-1',
        created: new Date('2024-02-20'),
        createdById: 'user-1',
        createdBy: { id: 'user-1', firstName: 'Alice', lastName: 'Martin' },
        status: 'Todo',
        subjects: [
          {
            id: 'subj-4',
            name: 'Budget',
            createdById: 'user-1',
            ownedByStructureId: 'structure-1',
            default: null,
            created: new Date('2024-01-15'),
            inactive: false,
            used: true
          }
        ],
        familyFile: { id: 'ff-3', structureId: 'structure-1', referents: [] },
        familyFileId: 'ff-3',
        beneficiary: {
          id: 'ben-3',
          firstName: 'Sophie',
          usualName: 'PETIT',
          birthName: 'MOREAU',
          birthDate: new Date('1992-11-05'),
          fileNumber: 'ben-3'
        },
        beneficiaryId: 'ben-3',
        dueDate: new Date('2024-03-20'),
        synthesis: 'Accompagnement logement en cours',
        medium: 'BeneficiaryHouseAppointment',
        firstFollowup: true
      },
      permissions: {
        view: true,
        edit: true,
        delete: true,
        get: { details: true, privateSynthesis: true },
        set: { privateSynthesis: true }
      }
    },
    {
      followup: {
        ...baseFollowup,
        id: '4',
        socialSupportId: 'ss-4',
        socialSupportType: 'Followup',
        date: new Date('2024-03-05'),
        structureId: 'structure-1',
        created: new Date('2024-03-05'),
        createdById: 'user-3',
        createdBy: { id: 'user-3', firstName: 'Claire', lastName: 'Dubois' },
        status: 'InProgress',
        subjects: [
          {
            id: 'subj-5',
            name: 'Famille',
            createdById: 'user-1',
            ownedByStructureId: 'structure-1',
            default: null,
            created: new Date('2024-01-15'),
            inactive: false,
            used: true
          },
          {
            id: 'subj-6',
            name: 'Logement',
            createdById: 'user-1',
            ownedByStructureId: 'structure-1',
            default: null,
            created: new Date('2024-01-15'),
            inactive: false,
            used: true
          }
        ],
        familyFile: { id: 'ff-4', structureId: 'structure-1', referents: [] },
        familyFileId: 'ff-4',
        beneficiary: {
          id: 'ben-4',
          firstName: 'Thomas',
          usualName: 'GIRARD',
          birthName: 'GIRARD',
          birthDate: new Date('1968-04-18'),
          fileNumber: 'ben-4'
        },
        beneficiaryId: 'ben-4',
        medium: 'ExternalAppointment',
        helpRequested: true
      },
      permissions: {
        view: true,
        edit: false,
        delete: false,
        get: { details: false, privateSynthesis: false },
        set: { privateSynthesis: false }
      }
    },
    {
      followup: {
        ...baseFollowup,
        id: '5',
        socialSupportId: 'ss-5',
        socialSupportType: 'Followup',
        date: new Date('2024-03-18'),
        structureId: 'structure-1',
        created: new Date('2024-03-18'),
        createdById: 'user-2',
        createdBy: { id: 'user-2', firstName: 'Jean', lastName: 'Bernard' },
        status: 'Done',
        subjects: [],
        familyFile: { id: 'ff-5', structureId: 'structure-1', referents: [] },
        familyFileId: 'ff-5',
        beneficiary: {
          id: 'ben-5',
          firstName: null,
          usualName: 'ROUX',
          birthName: null,
          birthDate: null,
          fileNumber: 'ben-5'
        },
        beneficiaryId: 'ben-5',
        dueDate: new Date('2024-04-18'),
        medium: 'Email'
      },
      permissions: {
        view: true,
        edit: true,
        delete: false,
        get: { details: true, privateSynthesis: false },
        set: { privateSynthesis: false }
      }
    },
    {
      followup: {
        ...baseFollowup,
        id: '6',
        socialSupportId: 'ss-6',
        socialSupportType: 'Followup',
        date: new Date('2024-04-02'),
        structureId: 'structure-1',
        created: new Date('2024-04-02'),
        createdById: 'user-1',
        createdBy: { id: 'user-1', firstName: 'Alice', lastName: 'Martin' },
        status: 'InProgress',
        subjects: [
          {
            id: 'subj-7',
            name: 'Insertion professionnelle',
            createdById: 'user-1',
            ownedByStructureId: 'structure-1',
            default: null,
            created: new Date('2024-01-15'),
            inactive: false,
            used: true
          }
        ],
        familyFile: { id: 'ff-6', structureId: 'structure-1', referents: [] },
        familyFileId: 'ff-6',
        beneficiary: {
          id: 'ben-6',
          firstName: 'Isabelle',
          usualName: 'FOURNIER',
          birthName: 'FOURNIER',
          birthDate: new Date('1985-09-30'),
          fileNumber: 'ben-6'
        },
        beneficiaryId: 'ben-6',
        medium: 'Videoconference'
      },
      permissions: {
        view: true,
        edit: true,
        delete: true,
        get: { details: true, privateSynthesis: false },
        set: { privateSynthesis: false }
      }
    },
    {
      followup: {
        ...baseFollowup,
        id: '7',
        socialSupportId: 'ss-7',
        socialSupportType: 'Followup',
        date: new Date('2024-04-14'),
        structureId: 'structure-1',
        created: new Date('2024-04-14'),
        createdById: 'user-3',
        createdBy: { id: 'user-3', firstName: 'Claire', lastName: 'Dubois' },
        status: 'Todo',
        subjects: [
          {
            id: 'subj-8',
            name: 'Santé',
            createdById: 'user-1',
            ownedByStructureId: 'structure-1',
            default: null,
            created: new Date('2024-01-15'),
            inactive: false,
            used: true
          },
          {
            id: 'subj-9',
            name: 'Budget',
            createdById: 'user-1',
            ownedByStructureId: 'structure-1',
            default: null,
            created: new Date('2024-01-15'),
            inactive: false,
            used: true
          },
          {
            id: 'subj-10',
            name: 'Famille',
            createdById: 'user-1',
            ownedByStructureId: 'structure-1',
            default: null,
            created: new Date('2024-01-15'),
            inactive: false,
            used: true
          }
        ],
        familyFile: { id: 'ff-7', structureId: 'structure-1', referents: [] },
        familyFileId: 'ff-7',
        beneficiary: {
          id: 'ben-7',
          firstName: 'Lucas',
          usualName: 'SIMON',
          birthName: 'SIMON',
          birthDate: new Date('2000-01-08'),
          fileNumber: 'ben-7'
        },
        beneficiaryId: 'ben-7',
        dueDate: new Date('2024-05-14'),
        medium: 'UnplannedInPerson',
        firstFollowup: false
      },
      permissions: {
        view: true,
        edit: false,
        delete: false,
        get: { details: true, privateSynthesis: false },
        set: { privateSynthesis: false }
      }
    },
    {
      followup: {
        ...baseFollowup,
        id: '8',
        socialSupportId: 'ss-8',
        socialSupportType: 'Followup',
        date: new Date('2024-05-06'),
        structureId: 'structure-1',
        created: new Date('2024-05-06'),
        createdById: 'user-2',
        createdBy: { id: 'user-3', firstName: 'Claire', lastName: 'Dubois' },

        status: 'Done',
        subjects: [
          {
            id: 'subj-11',
            name: 'Retraite',
            createdById: 'user-1',
            ownedByStructureId: 'structure-1',
            default: null,
            created: new Date('2024-01-15'),
            inactive: false,
            used: true
          }
        ],
        familyFile: { id: 'ff-8', structureId: 'structure-1', referents: [] },
        familyFileId: 'ff-8',
        beneficiary: {
          id: 'ben-8',
          firstName: 'Nathalie',
          usualName: 'MICHEL',
          birthName: 'AUBERT',
          birthDate: new Date('1960-06-25'),
          fileNumber: 'ben-8'
        },
        beneficiaryId: 'ben-8',
        medium: 'PostalMail'
      },
      permissions: {
        view: true,
        edit: true,
        delete: false,
        get: { details: true, privateSynthesis: false },
        set: { privateSynthesis: false }
      }
    },
    {
      followup: {
        ...baseFollowup,
        id: '9',
        socialSupportId: 'ss-9',
        socialSupportType: 'Followup',
        date: new Date('2024-05-22'),
        structureId: 'structure-1',
        created: new Date('2024-05-22'),
        createdById: 'user-1',
        createdBy: { id: 'user-1', firstName: 'Alice', lastName: 'Martin' },
        status: 'InProgress',
        subjects: [
          {
            id: 'subj-12',
            name: 'Handicap',
            createdById: 'user-1',
            ownedByStructureId: 'structure-1',
            default: null,
            created: new Date('2024-01-15'),
            inactive: false,
            used: true
          }
        ],
        familyFile: { id: 'ff-9', structureId: 'structure-1', referents: [] },
        familyFileId: 'ff-9',
        beneficiary: {
          id: 'ben-9',
          firstName: 'François',
          usualName: 'BLANC',
          birthName: 'BLANC',
          birthDate: new Date('1978-12-03'),
          fileNumber: 'ben-9'
        },
        beneficiaryId: 'ben-9',
        dueDate: new Date('2024-06-22'),
        medium: 'ThirdParty',
        helpRequested: true
      },
      permissions: {
        view: true,
        edit: true,
        delete: true,
        get: { details: true, privateSynthesis: true },
        set: { privateSynthesis: true }
      }
    },
    {
      followup: {
        ...baseFollowup,
        id: '10',
        socialSupportId: 'ss-10',
        socialSupportType: 'Followup',
        date: new Date('2024-06-10'),
        structureId: 'structure-1',
        created: new Date('2024-06-10'),
        createdById: 'user-3',
        createdBy: { id: 'user-3', firstName: 'Claire', lastName: 'Dubois' },
        status: 'Todo',
        subjects: [
          {
            id: 'subj-13',
            name: 'Emploi',
            createdById: 'user-1',
            ownedByStructureId: 'structure-1',
            default: null,
            created: new Date('2024-06-10'),
            inactive: false,
            used: true
          }
        ],
        familyFile: { id: 'ff-10', structureId: 'structure-1', referents: [] },
        familyFileId: 'ff-10',
        beneficiary: {
          id: 'ben-10',
          firstName: 'Camille',
          usualName: 'GARCIA',
          birthName: 'GARCIA',
          birthDate: new Date('1995-08-14'),
          fileNumber: 'ben-10'
        },
        beneficiaryId: 'ben-10',
        medium: 'PlannedInPerson',
        firstFollowup: true
      },
      permissions: {
        view: true,
        edit: false,
        delete: false,
        get: { details: false, privateSynthesis: false },
        set: { privateSynthesis: false }
      }
    }
  ]
</script>
