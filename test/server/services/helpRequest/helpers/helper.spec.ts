import { describe, /* it, expect */ } from 'vitest'
import {
  // UserRole,
  // UserStatus,
  // StructureType,
  // HelpRequestStatus,
  // HelpRequestSubject
} from '@prisma/client'
import {} from // prepareHelpRequestCreateData,
// prepareHelpRequestUpdateData
'~/server/services/helpRequest/helper'
// import { NEW_OPTION_PREFIX } from '~/utils/options'

describe('prepareHelpRequestCreateData', () => {
  describe('Subject: Other', () => {
    describe('Status: WaitingAdditionalInformation', () => {
      // it('prepare data for help request creation', () => {
      //   const data = prepareHelpRequestCreateData(
      //     {
      //       beneficiaryId: 'beneficiary-1',
      //       documents: [],
      //       fullFile: true,
      //       isMinistry: true,
      //       openingDate: new Date('2023-12-29'),
      //       status: HelpRequestStatus.WaitingAdditionalInformation,
      //       subject: HelpRequestSubject.Other,
      //       typeId: 'followup-type-1',
      //       externalStructure: 'false',
      //       prescribingOrganizationId: 'prescribing-organization-1',
      //       // Incoherent data
      //       instructorOrganizationId: 'instructor-organization-1',
      //       ministre: 'AgnesFirminLeBodo',
      //       numeroPegase: 'A-00-000000',
      //       decisionDate: new Date('2023-12-30'),
      //       handlingDate: new Date('2023-12-30'),
      //       refusalReason: 'AlreadyExistingHelpRequest',
      //       dispatchDate: new Date('2023-12-30'),
      //       examinationDate: new Date('2023-12-30'),
      //       askedAmount: 250,
      //       allocatedAmount: 250,
      //       paymentMethod: 'Cash',
      //       paymentDate: new Date('2023-12-30'),
      //       isRefundable: 'true'
      //     },
      //     {
      //       user: {
      //         id: 'user-1',
      //         role: UserRole.StructureManager,
      //         status: UserStatus.Active,
      //         structureId: 'structure-1'
      //       },
      //       structure: {
      //         id: 'structure-1',
      //         type: StructureType.Ccas
      //       }
      //     },
      //     { id: 'beneficiary-1', referents: [{ id: 'user-1' }] }
      //   )
      //   expect(data).toEqual({
      //     type: { connect: { id: 'followup-type-1' } },
      //     status: HelpRequestStatus.WaitingAdditionalInformation,
      //     createdBy: { connect: { id: 'user-1' } },
      //     allocatedAmount: null,
      //     askedAmount: null,
      //     beneficiary: {
      //       connect: {
      //         id: 'beneficiary-1'
      //       }
      //     },
      //     decisionDate: null,
      //     dispatchDate: null,
      //     documents: {
      //       connect: [],
      //       disconnect: undefined
      //     },
      //     examinationDate: new Date('2023-12-30'),
      //     externalStructure: false,
      //     fullFile: true,
      //     handlingDate: null,
      //     instructorOrganization: undefined,
      //     isRefundable: null,
      //     notifications: {
      //       createMany: {
      //         data: []
      //       }
      //     },
      //     openingDate: new Date('2023-12-29'),
      //     paymentDate: null,
      //     paymentMethod: null,
      //     prescribingOrganization: {
      //       connect: {
      //         id: 'prescribing-organization-1'
      //       }
      //     },
      //     refusalReason: null,
      //     structure: {
      //       connect: {
      //         id: 'structure-1'
      //       }
      //     },
      //     subject: 'Other'
      //   })
      // })
      // it('prepare data for help request creation - External - StructureType: Minister', () => {
      //   const data = prepareHelpRequestCreateData(
      //     {
      //       beneficiaryId: 'beneficiary-1',
      //       documents: [],
      //       fullFile: true,
      //       isMinistry: true,
      //       openingDate: new Date('2023-12-29'),
      //       status: HelpRequestStatus.WaitingAdditionalInformation,
      //       subject: HelpRequestSubject.Other,
      //       typeId: 'followup-type-1',
      //       externalStructure: 'true',
      //       instructorOrganizationId: 'instructor-organization-1',
      //       ministre: 'AgnesFirminLeBodo',
      //       numeroPegase: 'A-00-000000',
      //       dispatchDate: new Date('2023-12-30'),
      //       // Incoherent data
      //       decisionDate: new Date('2023-12-30'),
      //       handlingDate: new Date('2023-12-30'),
      //       refusalReason: 'AlreadyExistingHelpRequest',
      //       examinationDate: new Date('2023-12-30')
      //     },
      //     {
      //       user: {
      //         id: 'user-1',
      //         role: UserRole.StructureManager,
      //         status: UserStatus.Active,
      //         structureId: 'structure-1'
      //       },
      //       structure: {
      //         id: 'structure-1',
      //         type: StructureType.Ministere
      //       }
      //     },
      //     { id: 'beneficiary-1', referents: [{ id: 'user-1' }] }
      //   )
      //   expect(data).toEqual({
      //     type: { connect: { id: 'followup-type-1' } },
      //     status: HelpRequestStatus.WaitingAdditionalInformation,
      //     createdBy: { connect: { id: 'user-1' } },
      //     allocatedAmount: null,
      //     askedAmount: null,
      //     beneficiary: {
      //       connect: {
      //         id: 'beneficiary-1'
      //       }
      //     },
      //     decisionDate: null,
      //     dispatchDate: new Date('2023-12-30'),
      //     documents: {
      //       connect: [],
      //       disconnect: undefined
      //     },
      //     examinationDate: null,
      //     externalStructure: true,
      //     fullFile: true,
      //     handlingDate: null,
      //     instructorOrganization: {
      //       connect: {
      //         id: 'instructor-organization-1'
      //       }
      //     },
      //     isRefundable: null,
      //     notifications: {
      //       createMany: {
      //         data: []
      //       }
      //     },
      //     openingDate: new Date('2023-12-29'),
      //     paymentDate: null,
      //     paymentMethod: null,
      //     prescribingOrganization: undefined,
      //     refusalReason: null,
      //     structure: {
      //       connect: {
      //         id: 'structure-1'
      //       }
      //     },
      //     subject: 'Other',
      //     ministre: 'AgnesFirminLeBodo',
      //     numeroPegase: 'A-00-000000'
      //   })
      // })
      // it('prepare data for help request creation - External - Create prescribing and instructor organization', () => {
      //   const data = prepareHelpRequestCreateData(
      //     {
      //       beneficiaryId: 'beneficiary-1',
      //       documents: [],
      //       fullFile: true,
      //       isMinistry: true,
      //       openingDate: new Date('2023-12-29'),
      //       status: HelpRequestStatus.WaitingAdditionalInformation,
      //       subject: HelpRequestSubject.Other,
      //       typeId: 'followup-type-1',
      //       externalStructure: 'true',
      //       instructorOrganizationId: `${NEW_OPTION_PREFIX}instructor-organization-1`,
      //       prescribingOrganizationId: `${NEW_OPTION_PREFIX}prescribing-organization-1`,
      //       dispatchDate: new Date('2023-12-30'),
      //       // Incoherent data
      //       decisionDate: new Date('2023-12-30'),
      //       handlingDate: new Date('2023-12-30'),
      //       refusalReason: 'AlreadyExistingHelpRequest',
      //       examinationDate: new Date('2023-12-30')
      //     },
      //     {
      //       user: {
      //         id: 'user-1',
      //         role: UserRole.StructureManager,
      //         status: UserStatus.Active,
      //         structureId: 'structure-1'
      //       },
      //       structure: {
      //         id: 'structure-1',
      //         type: StructureType.Ccas
      //       }
      //     },
      //     { id: 'beneficiary-1', referents: [{ id: 'user-1' }] }
      //   )
      //   expect(data).toEqual({
      //     type: { connect: { id: 'followup-type-1' } },
      //     status: HelpRequestStatus.WaitingAdditionalInformation,
      //     createdBy: { connect: { id: 'user-1' } },
      //     allocatedAmount: null,
      //     askedAmount: null,
      //     beneficiary: {
      //       connect: {
      //         id: 'beneficiary-1'
      //       }
      //     },
      //     decisionDate: null,
      //     dispatchDate: new Date('2023-12-30'),
      //     documents: {
      //       connect: [],
      //       disconnect: undefined
      //     },
      //     examinationDate: null,
      //     externalStructure: true,
      //     fullFile: true,
      //     handlingDate: null,
      //     instructorOrganization: {
      //       create: {
      //         name: 'instructor-organization-1',
      //         structureId: 'structure-1',
      //         createdById: 'user-1'
      //       }
      //     },
      //     isRefundable: null,
      //     notifications: {
      //       createMany: {
      //         data: []
      //       }
      //     },
      //     openingDate: new Date('2023-12-29'),
      //     paymentDate: null,
      //     paymentMethod: null,
      //     prescribingOrganization: {
      //       create: {
      //         name: 'prescribing-organization-1',
      //         structureId: 'structure-1',
      //         createdById: 'user-1'
      //       }
      //     },
      //     refusalReason: null,
      //     structure: {
      //       connect: {
      //         id: 'structure-1'
      //       }
      //     },
      //     subject: 'Other'
      //   })
      // })
    })

    describe('Status: Accepted', () => {
      // it('prepare data for help request creation', () => {
      //   const data = prepareHelpRequestCreateData(
      //     {
      //       beneficiaryId: 'beneficiary-1',
      //       documents: [],
      //       fullFile: true,
      //       isMinistry: true,
      //       openingDate: new Date('2023-12-29'),
      //       status: HelpRequestStatus.Accepted,
      //       subject: HelpRequestSubject.Other,
      //       typeId: 'followup-type-1',
      //       externalStructure: 'false',
      //       decisionDate: new Date('2023-12-30'),
      //       handlingDate: new Date('2023-12-30'),
      //       examinationDate: new Date('2023-12-30'),
      //       // Incoherent data
      //       refusalReason: 'AlreadyExistingHelpRequest'
      //     },
      //     {
      //       user: {
      //         id: 'user-1',
      //         role: UserRole.StructureManager,
      //         status: UserStatus.Active,
      //         structureId: 'structure-1'
      //       },
      //       structure: {
      //         id: 'structure-1',
      //         type: StructureType.Ccas
      //       }
      //     },
      //     { id: 'beneficiary-1', referents: [{ id: 'user-1' }] }
      //   )
      //   expect(data).toEqual({
      //     type: { connect: { id: 'followup-type-1' } },
      //     status: HelpRequestStatus.Accepted,
      //     createdBy: { connect: { id: 'user-1' } },
      //     allocatedAmount: null,
      //     askedAmount: null,
      //     beneficiary: {
      //       connect: {
      //         id: 'beneficiary-1'
      //       }
      //     },
      //     decisionDate: new Date('2023-12-30'),
      //     dispatchDate: null,
      //     documents: {
      //       connect: [],
      //       disconnect: undefined
      //     },
      //     examinationDate: new Date('2023-12-30'),
      //     externalStructure: false,
      //     fullFile: true,
      //     handlingDate: new Date('2023-12-30'),
      //     instructorOrganization: undefined,
      //     isRefundable: null,
      //     notifications: {
      //       createMany: {
      //         data: []
      //       }
      //     },
      //     openingDate: new Date('2023-12-29'),
      //     paymentDate: null,
      //     paymentMethod: null,
      //     prescribingOrganization: undefined,
      //     refusalReason: null,
      //     structure: {
      //       connect: {
      //         id: 'structure-1'
      //       }
      //     },
      //     subject: 'Other'
      //   })
      // })
    })

    describe('Status: Refused', () => {
      // it('prepare data for help request creation', () => {
      //   const data = prepareHelpRequestCreateData(
      //     {
      //       beneficiaryId: 'beneficiary-1',
      //       documents: [],
      //       fullFile: true,
      //       isMinistry: true,
      //       openingDate: new Date('2023-12-29'),
      //       status: HelpRequestStatus.Refused,
      //       subject: HelpRequestSubject.Other,
      //       typeId: 'followup-type-1',
      //       externalStructure: 'false',
      //       decisionDate: new Date('2023-12-30'),
      //       handlingDate: new Date('2023-12-30'),
      //       examinationDate: new Date('2023-12-30'),
      //       refusalReason: 'AlreadyExistingHelpRequest'
      //     },
      //     {
      //       user: {
      //         id: 'user-1',
      //         role: UserRole.StructureManager,
      //         status: UserStatus.Active,
      //         structureId: 'structure-1'
      //       },
      //       structure: {
      //         id: 'structure-1',
      //         type: StructureType.Ccas
      //       }
      //     },
      //     { id: 'beneficiary-1', referents: [{ id: 'user-1' }] }
      //   )
      //   expect(data).toEqual({
      //     type: { connect: { id: 'followup-type-1' } },
      //     status: HelpRequestStatus.Refused,
      //     createdBy: { connect: { id: 'user-1' } },
      //     allocatedAmount: null,
      //     askedAmount: null,
      //     beneficiary: {
      //       connect: {
      //         id: 'beneficiary-1'
      //       }
      //     },
      //     decisionDate: new Date('2023-12-30'),
      //     dispatchDate: null,
      //     documents: {
      //       connect: [],
      //       disconnect: undefined
      //     },
      //     examinationDate: new Date('2023-12-30'),
      //     externalStructure: false,
      //     fullFile: true,
      //     handlingDate: null,
      //     instructorOrganization: undefined,
      //     isRefundable: null,
      //     notifications: {
      //       createMany: {
      //         data: []
      //       }
      //     },
      //     openingDate: new Date('2023-12-29'),
      //     paymentDate: null,
      //     paymentMethod: null,
      //     prescribingOrganization: undefined,
      //     refusalReason: 'AlreadyExistingHelpRequest',
      //     refusalReasonOther: null,
      //     structure: {
      //       connect: {
      //         id: 'structure-1'
      //       }
      //     },
      //     subject: 'Other'
      //   })
      // })
    })
  })

  describe('Subject: Financial', () => {
    describe('Status: Accepted', () => {
      // it('prepare data for help request creation', () => {
      //   const data = prepareHelpRequestCreateData(
      //     {
      //       beneficiaryId: 'beneficiary-1',
      //       documents: [],
      //       fullFile: true,
      //       isMinistry: true,
      //       openingDate: new Date('2023-12-29'),
      //       status: HelpRequestStatus.Accepted,
      //       subject: HelpRequestSubject.Financial,
      //       typeId: 'followup-type-1',
      //       externalStructure: 'false',
      //       decisionDate: new Date('2023-12-30'),
      //       handlingDate: new Date('2023-12-30'),
      //       examinationDate: new Date('2023-12-30'),
      //       askedAmount: 250,
      //       allocatedAmount: 250,
      //       paymentMethod: 'Cash',
      //       paymentDate: new Date('2023-12-30'),
      //       isRefundable: 'true'
      //     },
      //     {
      //       user: {
      //         id: 'user-1',
      //         role: UserRole.StructureManager,
      //         status: UserStatus.Active,
      //         structureId: 'structure-1'
      //       },
      //       structure: {
      //         id: 'structure-1',
      //         type: StructureType.Ccas
      //       }
      //     },
      //     { id: 'beneficiary-1', referents: [{ id: 'user-1' }] }
      //   )
      //   expect(data).toEqual({
      //     type: { connect: { id: 'followup-type-1' } },
      //     status: HelpRequestStatus.Accepted,
      //     createdBy: { connect: { id: 'user-1' } },
      //     allocatedAmount: 250,
      //     askedAmount: 250,
      //     beneficiary: {
      //       connect: {
      //         id: 'beneficiary-1'
      //       }
      //     },
      //     decisionDate: new Date('2023-12-30'),
      //     dispatchDate: null,
      //     documents: {
      //       connect: [],
      //       disconnect: undefined
      //     },
      //     examinationDate: new Date('2023-12-30'),
      //     externalStructure: false,
      //     fullFile: true,
      //     handlingDate: new Date('2023-12-30'),
      //     instructorOrganization: undefined,
      //     isRefundable: true,
      //     notifications: {
      //       createMany: {
      //         data: []
      //       }
      //     },
      //     openingDate: new Date('2023-12-29'),
      //     paymentDate: new Date('2023-12-30'),
      //     paymentMethod: 'Cash',
      //     prescribingOrganization: undefined,
      //     refusalReason: null,
      //     structure: {
      //       connect: {
      //         id: 'structure-1'
      //       }
      //     },
      //     subject: 'Financial'
      //   })
    })

    // it('prepare data for help request creation - External', () => {
    //   const data = prepareHelpRequestCreateData(
    //     {
    //       beneficiaryId: 'beneficiary-1',
    //       documents: [],
    //       fullFile: true,
    //       isMinistry: true,
    //       openingDate: new Date('2023-12-29'),
    //       status: HelpRequestStatus.Accepted,
    //       subject: HelpRequestSubject.Financial,
    //       typeId: 'followup-type-1',
    //       externalStructure: 'true',
    //       decisionDate: new Date('2023-12-30'),
    //       handlingDate: new Date('2023-12-30'),
    //       dispatchDate: new Date('2023-12-29'),
    //       examinationDate: new Date('2023-12-30'),
    //       askedAmount: 250,
    //       allocatedAmount: 250,
    //       paymentMethod: 'Cash',
    //       paymentDate: new Date('2023-12-30')
    //     },
    //     {
    //       user: {
    //         id: 'user-1',
    //         role: UserRole.StructureManager,
    //         status: UserStatus.Active,
    //         structureId: 'structure-1'
    //       },
    //       structure: {
    //         id: 'structure-1',
    //         type: StructureType.Ccas
    //       }
    //     },
    //     { id: 'beneficiary-1', referents: [{ id: 'user-1' }] }
    //   )

    //   expect(data).toEqual({
    //     type: { connect: { id: 'followup-type-1' } },
    //     status: HelpRequestStatus.Accepted,
    //     createdBy: { connect: { id: 'user-1' } },
    //     allocatedAmount: 250,
    //     askedAmount: 250,
    //     beneficiary: {
    //       connect: {
    //         id: 'beneficiary-1'
    //       }
    //     },
    //     decisionDate: new Date('2023-12-30'),
    //     dispatchDate: new Date('2023-12-29'),
    //     documents: {
    //       connect: [],
    //       disconnect: undefined
    //     },
    //     examinationDate: null,
    //     externalStructure: true,
    //     fullFile: true,
    //     handlingDate: new Date('2023-12-30'),
    //     instructorOrganization: undefined,
    //     isRefundable: null,
    //     notifications: {
    //       createMany: {
    //         data: []
    //       }
    //     },
    //     openingDate: new Date('2023-12-29'),
    //     paymentDate: null,
    //     paymentMethod: null,
    //     prescribingOrganization: undefined,
    //     refusalReason: null,
    //     structure: {
    //       connect: {
    //         id: 'structure-1'
    //       }
    //     },
    //     subject: 'Financial'
    //   })
    // })
    // })
  })
})

describe('prepareHelpRequestUpdateData', () => {
  describe('Subject: Other', () => {
    describe('Status: WaitingAdditionalInformation', () => {
      // it('prepare data for help request edition', () => {
      //   const data = prepareHelpRequestUpdateData(
      //     {
      //       id: 'help-request-1',
      //       beneficiaryId: 'beneficiary-1',
      //       documents: [],
      //       fullFile: true,
      //       isMinistry: true,
      //       openingDate: new Date('2023-12-29'),
      //       status: HelpRequestStatus.WaitingAdditionalInformation,
      //       typeId: 'followup-type-1',
      //       externalStructure: 'true',
      //       prescribingOrganizationId: 'prescribing-organization-1',
      //       instructorOrganizationId: undefined,
      //       dispatchDate: new Date('2023-12-29')
      //     },
      //     {
      //       user: {
      //         id: 'user-1',
      //         role: UserRole.StructureManager,
      //         status: UserStatus.Active,
      //         structureId: 'structure-1'
      //       },
      //       structure: {
      //         id: 'structure-1',
      //         type: StructureType.Ccas
      //       }
      //     },
      //     {
      //       id: 'help-request-1',
      //       instructorOrganization: {
      //         id: 'instructor-organization-1'
      //       } as any,
      //       instructorOrganizationId: 'instructor-organization-1'
      //     } as any
      //   )
      //   expect(data).toEqual({
      //     type: { connect: { id: 'followup-type-1' } },
      //     status: HelpRequestStatus.WaitingAdditionalInformation,
      //     allocatedAmount: null,
      //     askedAmount: null,
      //     beneficiaryId: 'beneficiary-1',
      //     decisionDate: null,
      //     dispatchDate: new Date('2023-12-29'),
      //     documents: {
      //       connect: [],
      //       disconnect: undefined
      //     },
      //     instructorOrganizationId: undefined,
      //     isMinistry: true,
      //     examinationDate: null,
      //     externalStructure: true,
      //     fullFile: true,
      //     handlingDate: null,
      //     id: 'help-request-1',
      //     instructorOrganization: { disconnect: true },
      //     isRefundable: null,
      //     openingDate: new Date('2023-12-29'),
      //     paymentDate: null,
      //     paymentMethod: null,
      //     prescribingOrganization: {
      //       connect: {
      //         id: 'prescribing-organization-1'
      //       }
      //     },
      //     refusalReason: null
      //   })
      // })
    })
  })
})
