import { defineEventHandler, readBody } from 'h3'
import { prismaClient } from '~/server/prisma'
import {
  AppointmentRepo,
  BeneficiaryRepo,
  CommentRepo,
  SocialSupportRepo,
  StructureRepo,
  UserRepo
} from '~/server/database'
import { forbiddenError } from '~/server/trpc'
import { JwtUser } from '~/types/user'
import { customAlphabet } from 'nanoid'

export default defineEventHandler(async event => {
  const { user }: { user: JwtUser } = event.context.auth
  if (!user || user.role !== 'Administrator') {
    throw forbiddenError()
  }

  const { exec } = await readBody(event)

  // L'anonymisation a été effectuée de manière incomplète dans la première version
  // Les structures partiellement anonymisées sont rattrapées ici.

  // 1. Compter le nombre de structures désactivées qui ont un nom non anonymisé (name non null)
  const structures = await StructureRepo.prisma.findMany({
    where: {
      disabled: true,
      name: { not: '' }
    },
    select: {
      id: true,
      created: true,
      lastAccess: true,
      name: true,
      users: {
        select: {
          id: true,
          status: true,
          email: true
        }
      }
    }
  })

  // Pour ces structures
  // - supprimer commentaires
  // - anonymiser structure : nom adresse phone email rdvsp
  // - anonymiser rdv
  // - supprimer account des utilisateurs de la structure
  // - supprimer external account
  // - anonymuser tous les users firstname lastname email status aidantConnect accestoken validity rdvsp

  // exécution de la migration
  if (exec) {
    for (const structure of structures) {
      await AppointmentRepo.prisma.updateMany({
        where: {
          socialSupport: { structureId: structure.id }
        },
        data: {
          draft: false,
          externalDraftId: null,
          time: null,
          durationInMin: null,
          place: null,
          externalRdvspId: null
        }
      })

      const deleteComments = CommentRepo.prisma.deleteMany({
        where: {
          socialSupport: {
            structureId: structure.id
          }
        }
      })

      const updateSocialSupports = SocialSupportRepo.prisma.updateMany({
        where: { structureId: structure.id },
        data: {
          synthesis: null,
          privateSynthesis: null,
          synthesisRichText: null,
          privateSynthesisRichText: null,
          numeroPegase: '',
          ministre: null,
          dueDate: null
        }
      })

      const updateBeneficiaries = BeneficiaryRepo.prisma.updateMany({
        where: { structureId: structure.id },
        data: {
          // no need to update this, it has already been done, we simply clean the fields
          // archivedById: ctx.user.id,
          // archived: new Date(),
          title: null,
          pensionOrganisations: {
            set: []
          },
          usualName: null,
          birthName: null,
          firstName: null,
          birthPlace: null,
          deathDate: null,
          gender: null,
          nationality: null,
          relationship: null,
          aidantConnectAuthorized: false,
          accommodationMode: null,
          accommodationName: null,
          accommodationAdditionalInformation: null,
          street: null,
          addressComplement: null,
          zipcode: null,
          city: null,
          department: null,
          region: null,
          qpv: null,
          noPhone: false,
          phone1: null,
          phone2: null,
          email: null,
          familySituation: null,
          weddingDate: null,
          divorceDate: null,
          caregiver: false,
          minorChildren: null,
          majorChildren: null,
          mobility: null,
          vulnerablePerson: false,
          ministereCategorie: null,
          ministereDepartementServiceAc: null,
          ministereStructure: null,
          gir: null,
          doctor: null,
          healthAdditionalInformation: null,
          socialSecurityNumber: null,
          insurance: null,
          socioProfessionalCategory: null,
          studyLevel: null,
          occupation: null,
          employer: null,
          employerSiret: null,
          unemploymentNumber: null,
          otherPensionOrganisations: null,
          cafNumber: null,
          bank: null,
          funeralContract: null,
          protectionMeasure: null,
          representative: null,
          prescribingStructure: null,
          orientationType: null,
          orientationStructure: null,
          serviceProviders: null,
          involvedPartners: null,
          additionalInformation: null,
          numeroPegase: null,
          accommodationZone: null
        }
      })

      const updateStructure = StructureRepo.prisma.update({
        where: { id: structure.id },
        data: {
          name: '',
          address: '',
          phone: '',
          email: '',
          dpoFirstName: null,
          dpoLastName: null,
          dpoEmail: null,
          externalRdvspActive: false,
          externalRdvspId: null
        }
      })

      await prismaClient.$transaction([
        deleteComments,
        updateSocialSupports,
        updateBeneficiaries,
        updateStructure
      ])

      // Deactivate and anonymize all users of the structure while keeping the uniqueness of the email
      const nanoid = customAlphabet('123456789abcdefghijk', 5)
      const anonstructure = nanoid()

      for (const user of structure.users) {
        const deleteAccount = prismaClient.account.deleteMany({
          where: {
            userId: user.id
          }
        })

        const deleteExternalAccount = prismaClient.externalAccount.deleteMany({
          where: {
            userId: user.id
          }
        })

        const updateUser = UserRepo.prisma.update({
          where: { id: user.id },
          data: {
            firstName: '',
            lastName: '',
            email: `${nanoid()}@disabled-structure-${anonstructure}.org`,
            status: 'Disabled',
            aidantConnectAuthorisation: null,
            accessToken: null,
            accessTokenValidity: null,
            externalRdvspId: null
          }
        })

        await prismaClient.$transaction([
          deleteAccount,
          deleteExternalAccount,
          updateUser
        ])
      }
    }
  }

  return structures
})
