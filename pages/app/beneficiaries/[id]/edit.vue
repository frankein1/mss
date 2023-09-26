<template>
  <PageContainer>
    <DsfrBreadcrumb :links="breadcrumb" />
    <PageTitle :title="title" />
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12">
        <main
          ref="formContainer"
          class="main-container fr-p-5w"
        >
          <AtomLoader
            v-if="pending"
            class="fr-mx-auto"
          />
          <AtomAlert
            v-else-if="fetchError"
            :alert-type="AlertType.Error"
            :message="fetchError"
          />

          <BeneficiaryForm
            v-else-if="beneficiary && agents?.length"
            :beneficiary="beneficiary"
            :agents="agents"
            :is-submitting="isSubmitting"
            :tax-households="taxHouseholds"
            :entourages="entourages"
            :current-beneficiary-id="beneficiaryId"
            :can-set-external-organisations="canSetExternalOrganisations"
            :can-set-health="canSetHealth"
            :can-set-occupation-income="canSetOccupationIncome"
            :can-set-referents="canSetReferents"
            :can-set-relatives="canSetRelatives"
            @save-beneficiary="onUpdateBeneficiary"
          />
        </main>
      </div>
    </div>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { AlertType } from '~/utils/constants/alert'
  import { SaveBeneficiaryInput } from '~/server/schema'
  import {
    canEditBeneficiaryExternalOrganisations,
    canEditBeneficiaryHealthInfo,
    canEditBeneficiaryOccupationIncome,
    canEditBeneficiaryReferents,
    canEditBeneficiaryRelatives
  } from '~/server/security/rules'
  import { useAuthStore } from '~/store/auth'
  import { RoutePath, Breadcrumb, RouteTitle } from '~/utils/routing'
  import { prismaDecimalToNumber } from '~/utils/prismaDecimalToNumber'

  definePageMeta({
    middleware: 'is-beneficiary-referent'
  })

  const route = useRoute()
  const beneficiaryId = route.params.id as string
  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()

  const {
    data,
    pending: beneficiaryPending,
    error: beneficiaryError
  } = await trpcClient.beneficiary.getBeneficiaryDetails.useQuery({
    id: beneficiaryId
  })

  const {
    data: agents,
    pending: agentsPending,
    error: agentsError
  } = await trpcClient.config.getAgents.useQuery()

  const isSubmitting = ref(false)
  const formContainer = ref<HTMLElement | null>(null)

  const pending = computed(
    () => beneficiaryPending.value || agentsPending.value
  )

  const fetchError = computed(() => {
    if (beneficiaryError.value) {
      return "Les informations du bénéficiaires n'ont pas pu être chargées."
    }
    if (agentsError.value) {
      return "La liste des agents référents n'a pas pu être chargée."
    }
    return ''
  })

  const taxHouseholds = computed(() => data.value?.taxHouseholds || [])
  const entourages = computed(() => data.value?.entourages || [])

  const beneficiary = computed(() => {
    if (!data.value) {
      return null
    }
    const b = data.value.beneficiary
    return {
      id: b.id,
      structureId: b.structureId,
      referents: b.referents.map(referent => referent.id),
      aidantConnectAuthorized: b.aidantConnectAuthorized,
      // General Info
      general: {
        status: b.status,
        title: b.title,
        firstName: b.firstName || '',
        usualName: b.usualName,
        birthName: b.birthName || '',
        birthDate: b.birthDate,
        birthPlace: b.birthPlace,
        deathDate: b.deathDate,
        gender: b.gender,
        nationality: b.nationality,
        numeroPegase: b.numeroPegase,
        accommodationMode: b.accommodationMode,
        accommodationName: b.accommodationName,
        accommodationAdditionalInformation:
          b.accommodationAdditionalInformation,
        zipcode: b.zipcode,
        city: b.city,
        region: b.region,
        addressComplement: b.addressComplement,
        accommodationZone: b.accommodationZone,
        streetNumber: b.streetNumber,
        street: b.street,
        noPhone: b.noPhone,
        phone1: b.phone1,
        phone2: b.phone2,
        email: b.email,
        caregiver: b.caregiver,
        mobility: b.mobility
      },
      // external orga
      external: {
        protectionMeasure: b.protectionMeasure,
        representative: b.representative,
        prescribingStructure: b.prescribingStructure,
        orientationType: b.orientationType,
        orientationStructure: b.orientationStructure,
        serviceProviders: b.serviceProviders,
        involvedPartners: b.involvedPartners
      },
      // Health
      health: {
        gir: b.gir,
        doctor: b.doctor,
        healthAdditionalInformation: b.healthAdditionalInformation,
        socialSecurityNumber: b.socialSecurityNumber,
        insurance: b.insurance
      },
      // Occupation
      occupation: {
        socioProfessionalCategory: b.socioProfessionalCategory,
        occupation: b.occupation,
        employer: b.employer,
        employerSiret: b.employerSiret,
        mainIncomeSource: b.mainIncomeSource || [],
        mainIncomeAmount: prismaDecimalToNumber(b.mainIncomeAmount),
        partnerMainIncomeSource: b.partnerMainIncomeSource || [],
        partnerMainIncomeAmount: prismaDecimalToNumber(
          b.partnerMainIncomeAmount
        ),
        majorChildrenMainIncomeSource: b.majorChildrenMainIncomeSource || [],
        majorChildrenMainIncomeAmount: prismaDecimalToNumber(
          b.majorChildrenMainIncomeAmount
        ),
        unemploymentNumber: b.unemploymentNumber,
        pensionOrganisations: b.pensionOrganisations || [],
        otherPensionOrganisations: b.otherPensionOrganisations,
        cafNumber: b.cafNumber,
        bank: b.bank,
        funeralContract: b.funeralContract,
        ministereCategorie: b.ministereCategorie,
        ministereDepartementServiceAc: b.ministereDepartementServiceAc,
        ministereStructure: b.ministereStructure
      },
      // Relatives
      taxHousehold: {
        familySituation: b.familySituation,
        minorChildren: b.minorChildren,
        majorChildren: b.majorChildren,
        taxHouseholds: taxHouseholds.value
      },
      entourage: {
        entourages: entourages.value
      },

      // additionalInformation
      additionalInformation: b.additionalInformation
    }
  })

  const title = computed(() =>
    RouteTitle.AppBeneficiaryEdit(beneficiary.value?.general || null)
  )

  const breadcrumb = computed(() => {
    if (beneficiary.value) {
      return Breadcrumb.AppBeneficiaryEdit({
        id: beneficiary.value.id,
        ...beneficiary.value.general
      })
    }
    return Breadcrumb.AppBeneficiaryEdit(null)
  })

  useHead({ title })

  const authStore = useAuthStore()
  const user = computed(() => authStore.getAuthUser)

  const canSetRelatives = computed(() =>
    beneficiary.value
      ? canEditBeneficiaryRelatives(user.value, beneficiary.value)
      : false
  )
  const canSetReferents = computed(() =>
    beneficiary.value
      ? canEditBeneficiaryReferents(user.value, beneficiary.value)
      : false
  )
  const canSetHealth = computed(() =>
    beneficiary.value
      ? canEditBeneficiaryHealthInfo(user.value, beneficiary.value)
      : false
  )
  const canSetOccupationIncome = computed(() =>
    beneficiary.value
      ? canEditBeneficiaryOccupationIncome(user.value, beneficiary.value)
      : false
  )
  const canSetExternalOrganisations = computed(() =>
    beneficiary.value
      ? canEditBeneficiaryExternalOrganisations(user.value, beneficiary.value)
      : false
  )

  async function onUpdateBeneficiary(beneficiary: SaveBeneficiaryInput) {
    if (!data.value) {
      return
    }

    isSubmitting.value = true

    try {
      await trpcClient.beneficiary.update.mutate({
        id: beneficiaryId,
        structureId: data.value.beneficiary.structureId,
        ...beneficiary
      })

      navigateTo(RoutePath.AppBeneficiary(beneficiaryId))
    } catch {
      snackbar.error(
        'La mise à jour de la synthèse a échoué.',
        () => formContainer.value?.querySelector('input')?.focus()
      )
    } finally {
      isSubmitting.value = false
    }
  }
</script>
