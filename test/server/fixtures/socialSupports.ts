import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  fixturesSocialSupportSubjects,
  FixtureUserRole,
  fixturesPartnerOrganizations,
  FixturePartnerOrganization,
  fixturesPartnerOrganizationContacts
} from '~~/prisma/fixtures'
import { prismaClient } from '~~/server/prisma'

const defaultStructureId = fixtureStructures[FixtureStructure.Test].id
const defaultReferentId = fixturesUsers[FixtureUserRole.Referent].id
const defaultStructureManagerId =
  fixturesUsers[FixtureUserRole.StructureManager].id
const defaultPartnerOrganizationId = fixturesPartnerOrganizations[
  FixturePartnerOrganization.FranceTravail
].id as string
const defaultPartnerOrganizationContactId =
  fixturesPartnerOrganizationContacts[2].id as string
const defaultSocialSupportSubjectId = fixturesSocialSupportSubjects[0].id

export async function createSocialSupports(
  date: Date,
  familyFileId: string,
  beneficiaryId: string,
  structureId = defaultStructureId,
  referentId = defaultReferentId,
  structureManagerId = defaultStructureManagerId,
  partnerOrganizationId = defaultPartnerOrganizationId,
  partnerOrganizationContactId = defaultPartnerOrganizationContactId,
  socialSupportSubjectId = defaultSocialSupportSubjectId
) {
  const createFollowup = prismaClient.socialSupport.create({
    select: {
      id: true,
      followup: {
        select: {
          id: true
        }
      }
    },
    data: {
      created: date,
      updated: date,
      date,
      structure: {
        connect: { id: structureId }
      },
      familyFile: { connect: { id: familyFileId } },
      beneficiary: { connect: { id: beneficiaryId } },
      createdBy: {
        connect: { id: referentId }
      },
      lastUpdatedBy: {
        connect: { id: structureManagerId }
      },
      status: 'InProgress',
      socialSupportType: 'Followup',
      synthesis: 'Synthesis',
      privateSynthesis: 'Private synthesis',
      synthesisRichText: 'Synthesis rich text',
      privateSynthesisRichText: 'Private synthesis rich text',
      numeroPegase: '12345ABCD',
      comments: {
        create: {
          created: date,
          updated: date,
          content: 'Compte Rendu validé ce jour.',
          createdBy: {
            connect: {
              id: structureManagerId
            }
          },
          notification: {
            create: [
              {
                created: date,
                type: 'NewComment',
                read: true,
                detail:
                  'Une commentaire a été ajouté par la responsable de structure',
                recipient: {
                  connect: { id: referentId }
                },
                itemCreatedBy: {
                  connect: {
                    id: structureManagerId
                  }
                }
              }
            ]
          }
        }
      },
      notifications: {
        create: {
          created: date,
          type: 'NewFollowupElement',
          read: false,
          detail: 'Un entretien a été ajouté par le référent du dossier',
          recipient: {
            connect: {
              id: structureManagerId
            }
          },
          itemCreatedBy: {
            connect: {
              id: referentId
            }
          }
        }
      },
      followup: {
        create: {
          updated: date,
          prescribingOrganization: {
            connect: {
              id: partnerOrganizationId
            }
          },
          prescribingOrganizationContact: {
            connect: {
              id: partnerOrganizationContactId
            }
          },
          medium: 'PlannedInPerson',
          helpRequested: true,
          place: 'CCAS de Lyon',
          thirdPersonName: 'Mme Dubois',
          classified: true,
          firstFollowup: true,
          forwardedToJustice: true,
          duration: 'MoreThanHour'
        }
      }
    }
  })

  const createFinancialHelpRequest = prismaClient.socialSupport.create({
    select: {
      id: true,
      fileInstruction: {
        select: {
          id: true,
          helpRequest: {
            select: {
              id: true
            }
          }
        }
      }
    },
    data: {
      created: date,
      updated: date,
      date,
      structure: {
        connect: { id: structureId }
      },
      familyFile: { connect: { id: familyFileId } },
      beneficiary: { connect: { id: beneficiaryId } },
      createdBy: {
        connect: { id: referentId }
      },
      lastUpdatedBy: {
        connect: { id: structureManagerId }
      },
      status: 'Refused',
      socialSupportType: 'HelpRequest',
      synthesis: 'Synthesis',
      privateSynthesis: 'Private synthesis',
      synthesisRichText: 'Synthesis rich text',
      privateSynthesisRichText: 'Private synthesis rich text',
      numeroPegase: '986532ADPE',
      comments: {
        create: {
          created: date,
          updated: date,
          content:
            "Cette aide financière d'urgence a été refusée pour cause de dette trop importante. Prévoir mise en place d'un dossier de surendettement.",
          createdBy: {
            connect: {
              id: structureManagerId
            }
          },
          notification: {
            create: {
              created: date,
              type: 'NewComment',
              read: true,
              detail:
                'Une commentaire a été ajouté par la responsable de structure',
              recipient: {
                connect: { id: referentId }
              },
              itemCreatedBy: {
                connect: {
                  id: structureManagerId
                }
              }
            }
          }
        }
      },
      notifications: {
        create: {
          created: date,
          type: 'NewFileInstructionElement',
          read: true,
          detail: "Une demande d'aide financière d'urgence a été ajoutée",
          recipient: {
            connect: {
              id: structureManagerId
            }
          },
          itemCreatedBy: {
            connect: {
              id: referentId
            }
          }
        }
      },
      fileInstruction: {
        create: {
          updated: date,
          type: 'Financial',
          instructorOrganization: {
            connect: {
              id: partnerOrganizationId
            }
          },
          instructorOrganizationContact: {
            connect: {
              id: partnerOrganizationContactId
            }
          },
          externalStructure: true,
          examinationDate: date,
          decisionDate: date,
          refusalReason: 'Debt',
          refusalReasonOther: null,
          dispatchDate: date,
          fullFile: true,
          helpRequest: {
            create: {
              subject: {
                connect: {
                  id: socialSupportSubjectId
                }
              },
              prescribingOrganization: {
                connect: {
                  id: partnerOrganizationId
                }
              },
              prescribingOrganizationContact: {
                connect: {
                  id: partnerOrganizationContactId
                }
              },
              financialSupport: true,
              isRefundable: true,
              askedAmount: 1000,
              allocatedAmount: 0,
              paymentMethod: 'Check',
              paymentDate: date,
              handlingDate: date
            }
          }
        }
      }
    }
  })

  return await Promise.all([createFollowup, createFinancialHelpRequest])
}
