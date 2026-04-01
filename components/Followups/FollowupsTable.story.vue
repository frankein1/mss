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

  const pageItems: FollowupPageItems = [
    {
      followup: {
        id: '1',
        socialSupportId: 'ss-1',
        socialSupportType: 'Followup',
        date: new Date('2024-01-15'),
        structureId: 'structure-1',
        created: new Date('2024-01-15'),
        createdById: 'user-1',
        createdBy: { id: 'user-1', firstName: 'Alice', lastName: 'Martin' },
        status: 'InProgress',
        subjects: [{ id: 'subj-1', name: 'Logement' }],
        familyFile: { id: 'ff-1', structureId: 'structure-1', referents: [] },
        familyFileId: 'ff-1',
        beneficiary: {
          id: 'ben-1',
          firstName: 'Marie',
          usualName: 'DUPONT',
          birthName: 'DUPONT',
          birthDate: new Date('1980-03-12')
        },
        beneficiaryId: 'ben-1',
        dueDate: new Date('2024-02-15'),
        redirected: false,
        medium: 'PlannedInPerson',
        documents: []
      },
      permissions: {
        view: true,
        edit: true,
        delete: false,
        get: { details: true, dueDate: true, privateSynthesis: false },
        set: { privateSynthesis: false }
      }
    },
    {
      followup: {
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
          { id: 'subj-2', name: 'Emploi' },
          { id: 'subj-3', name: 'Santé' }
        ],
        familyFile: { id: 'ff-2', structureId: 'structure-1', referents: [] },
        familyFileId: 'ff-2',
        beneficiary: {
          id: 'ben-2',
          firstName: 'Paul',
          usualName: 'LEROY',
          birthName: 'LEROY',
          birthDate: new Date('1975-07-22')
        },
        beneficiaryId: 'ben-2',
        redirected: true,
        medium: 'PhoneCall',
        documents: []
      },
      permissions: {
        view: true,
        edit: false,
        delete: false,
        get: { details: true, dueDate: true, privateSynthesis: false },
        set: { privateSynthesis: false }
      }
    },
    {
      followup: {
        id: '3',
        socialSupportId: 'ss-3',
        socialSupportType: 'Followup',
        date: new Date('2024-02-20'),
        structureId: 'structure-1',
        created: new Date('2024-02-20'),
        createdById: 'user-1',
        createdBy: { id: 'user-1', firstName: 'Alice', lastName: 'Martin' },
        status: 'Todo',
        subjects: [{ id: 'subj-4', name: 'Budget' }],
        familyFile: { id: 'ff-3', structureId: 'structure-1', referents: [] },
        familyFileId: 'ff-3',
        beneficiary: {
          id: 'ben-3',
          firstName: 'Sophie',
          usualName: 'PETIT',
          birthName: 'MOREAU',
          birthDate: new Date('1992-11-05')
        },
        beneficiaryId: 'ben-3',
        dueDate: new Date('2024-03-20'),
        redirected: false,
        medium: 'BeneficiaryHouseAppointment',
        firstFollowup: true,
        documents: []
      },
      permissions: {
        view: true,
        edit: true,
        delete: true,
        get: { details: true, dueDate: true, privateSynthesis: true },
        set: { privateSynthesis: true }
      }
    },
    {
      followup: {
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
          { id: 'subj-5', name: 'Famille' },
          { id: 'subj-6', name: 'Logement' }
        ],
        familyFile: { id: 'ff-4', structureId: 'structure-1', referents: [] },
        familyFileId: 'ff-4',
        beneficiary: {
          id: 'ben-4',
          firstName: 'Thomas',
          usualName: 'GIRARD',
          birthName: 'GIRARD',
          birthDate: new Date('1968-04-18')
        },
        beneficiaryId: 'ben-4',
        redirected: false,
        medium: 'ExternalAppointment',
        helpRequested: true,
        documents: []
      },
      permissions: {
        view: true,
        edit: false,
        delete: false,
        get: { details: false, dueDate: false, privateSynthesis: false },
        set: { privateSynthesis: false }
      }
    },
    {
      followup: {
        id: '5',
        socialSupportId: 'ss-5',
        socialSupportType: 'Followup',
        subtype: null,
        date: new Date('2024-03-18'),
        structureId: 'structure-1',
        created: new Date('2024-03-18'),
        updated: null,
        createdById: 'user-2',
        createdBy: { id: 'user-2', firstName: 'Jean', lastName: 'Bernard' },
        lastUpdatedBy: null,
        status: 'Done',
        subjects: [],
        familyFile: { id: 'ff-5', structureId: 'structure-1', referents: [] },
        familyFileId: 'ff-5',
        beneficiary: {
          id: 'ben-5',
          firstName: null,
          usualName: 'ROUX',
          birthName: null,
          birthDate: null
        },
        beneficiaryId: 'ben-5',
        dueDate: new Date('2024-04-18'),
        privateSynthesis: null,
        privateSynthesisRichText: null,
        synthesis: null,
        synthesisRichText: null,
        ministerId: null,
        minister: null,
        socialSupportRedirections: null,
        numeroPegase: null,
        structureName: null,
        redirected: null,
        medium: 'Email',
        classified: null,
        forwardedToJustice: null,
        prescribingOrganization: null,
        prescribingOrganizationContact: null,
        firstFollowup: null,
        helpRequested: null,
        thirdPersonName: null,
        place: null,
        duration: null,
        documents: []
      },
      permissions: {
        view: true,
        edit: true,
        delete: false,
        get: { details: true, dueDate: true, privateSynthesis: false },
        set: { privateSynthesis: false }
      }
    },
    {
      followup: {
        id: '6',
        socialSupportId: 'ss-6',
        socialSupportType: 'Followup',
        date: new Date('2024-04-02'),
        structureId: 'structure-1',
        created: new Date('2024-04-02'),
        createdById: 'user-1',
        createdBy: { id: 'user-1', firstName: 'Alice', lastName: 'Martin' },
        status: 'InProgress',
        subjects: [{ id: 'subj-7', name: 'Insertion professionnelle' }],
        familyFile: { id: 'ff-6', structureId: 'structure-1', referents: [] },
        familyFileId: 'ff-6',
        beneficiary: {
          id: 'ben-6',
          firstName: 'Isabelle',
          usualName: 'FOURNIER',
          birthName: 'FOURNIER',
          birthDate: new Date('1985-09-30')
        },
        beneficiaryId: 'ben-6',
        redirected: false,
        medium: 'Videoconference',
        documents: []
      },
      permissions: {
        view: true,
        edit: true,
        delete: true,
        get: { details: true, dueDate: true, privateSynthesis: false },
        set: { privateSynthesis: false }
      }
    },
    {
      followup: {
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
          { id: 'subj-8', name: 'Santé' },
          { id: 'subj-9', name: 'Budget' },
          { id: 'subj-10', name: 'Famille' }
        ],
        familyFile: { id: 'ff-7', structureId: 'structure-1', referents: [] },
        familyFileId: 'ff-7',
        beneficiary: {
          id: 'ben-7',
          firstName: 'Lucas',
          usualName: 'SIMON',
          birthName: 'SIMON',
          birthDate: new Date('2000-01-08')
        },
        beneficiaryId: 'ben-7',
        dueDate: new Date('2024-05-14'),
        redirected: false,
        medium: 'UnplannedInPerson',
        firstFollowup: false,
        documents: []
      },
      permissions: {
        view: true,
        edit: false,
        delete: false,
        get: { details: true, dueDate: false, privateSynthesis: false },
        set: { privateSynthesis: false }
      }
    },
    {
      followup: {
        id: '8',
        socialSupportId: 'ss-8',
        socialSupportType: 'Followup',
        date: new Date('2024-05-06'),
        structureId: 'structure-1',
        created: new Date('2024-05-06'),
        createdById: 'user-2',
        status: 'Done',
        subjects: [{ id: 'subj-11', name: 'Retraite' }],
        familyFile: { id: 'ff-8', structureId: 'structure-1', referents: [] },
        familyFileId: 'ff-8',
        beneficiary: {
          id: 'ben-8',
          firstName: 'Nathalie',
          usualName: 'MICHEL',
          birthName: 'AUBERT',
          birthDate: new Date('1960-06-25')
        },
        beneficiaryId: 'ben-8',
        redirected: true,
        medium: 'PostalMail',
        documents: []
      },
      permissions: {
        view: true,
        edit: true,
        delete: false,
        get: { details: true, dueDate: true, privateSynthesis: false },
        set: { privateSynthesis: false }
      }
    },
    {
      followup: {
        id: '9',
        socialSupportId: 'ss-9',
        socialSupportType: 'Followup',
        date: new Date('2024-05-22'),
        structureId: 'structure-1',
        created: new Date('2024-05-22'),
        createdById: 'user-1',
        createdBy: { id: 'user-1', firstName: 'Alice', lastName: 'Martin' },
        status: 'InProgress',
        subjects: [{ id: 'subj-12', name: 'Handicap' }],
        familyFile: { id: 'ff-9', structureId: 'structure-1', referents: [] },
        familyFileId: 'ff-9',
        beneficiary: {
          id: 'ben-9',
          firstName: 'François',
          usualName: 'BLANC',
          birthName: 'BLANC',
          birthDate: new Date('1978-12-03')
        },
        beneficiaryId: 'ben-9',
        dueDate: new Date('2024-06-22'),
        redirected: false,
        medium: 'ThirdParty',
        helpRequested: true,
        documents: []
      },
      permissions: {
        view: true,
        edit: true,
        delete: true,
        get: { details: true, dueDate: true, privateSynthesis: true },
        set: { privateSynthesis: true }
      }
    },
    {
      followup: {
        id: '10',
        socialSupportId: 'ss-10',
        socialSupportType: 'Followup',
        date: new Date('2024-06-10'),
        structureId: 'structure-1',
        created: new Date('2024-06-10'),
        createdById: 'user-3',
        createdBy: { id: 'user-3', firstName: 'Claire', lastName: 'Dubois' },
        status: 'Todo',
        subjects: [{ id: 'subj-13', name: 'Emploi' }],
        familyFile: { id: 'ff-10', structureId: 'structure-1', referents: [] },
        familyFileId: 'ff-10',
        beneficiary: {
          id: 'ben-10',
          firstName: 'Camille',
          usualName: 'GARCIA',
          birthName: 'GARCIA',
          birthDate: new Date('1995-08-14')
        },
        beneficiaryId: 'ben-10',
        redirected: false,
        medium: 'PlannedInPerson',
        firstFollowup: true,
        documents: []
      },
      permissions: {
        view: true,
        edit: false,
        delete: false,
        get: { details: false, dueDate: false, privateSynthesis: false },
        set: { privateSynthesis: false }
      }
    }
  ] as FollowupPageItems
</script>
