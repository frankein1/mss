<template>
  <PageContainer>
    <DsfrBreadcrumb
      :links="
        Breadcrumb.AppBeneficiaryEdit({
          id: beneficiary.id,
          ...beneficiary.general
        })
      "
    />
    <PageTitle :title="title" />
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12">
        <main
          ref="formContainer"
          class="main-container fr-p-5w"
        >
          <BeneficiaryForm
            v-if="beneficiary && agents?.length"
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
  import { SaveBeneficiaryInput } from 'server/schema'
  import {
    canEditBeneficiaryExternalOrganisations,
    canEditBeneficiaryHealthInfo,
    canEditBeneficiaryOccupationIncome,
    canEditBeneficiaryReferents,
    canEditBeneficiaryRelatives
  } from 'server/security/rules'
  import { useAuthStore } from 'store/auth'
  import { RoutePath, Breadcrumb, RouteTitle } from '~/utils/routing'

  definePageMeta({
    middleware: 'is-beneficiary-referent'
  })

  const route = useRoute()
  const beneficiaryId = route.params.id as string
  const trpcClient = useTrpcClient()

  const { data } = await trpcClient.beneficiary.getBeneficiaryDetails.useQuery({
    id: beneficiaryId
  })

  const { data: agents } = await trpcClient.config.getAgents.useQuery()

  const isSubmitting = ref(false)

  const beneficiary = computed(() => {
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
        mainIncomeAmount: b.mainIncomeAmount,
        partnerMainIncomeSource: b.partnerMainIncomeSource || [],
        partnerMainIncomeAmount: b.partnerMainIncomeAmount,
        majorChildrenMainIncomeSource: b.majorChildrenMainIncomeSource || [],
        majorChildrenMainIncomeAmount: b.majorChildrenMainIncomeAmount,
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
        taxHouseholds: data.value.taxHouseholds || []
      },
      entourage: {
        entourages: data.value.entourages || []
      },

      // additionalInformation
      additionalInformation: b.additionalInformation
    }
  })

  const title = computed(() =>
    RouteTitle.AppBeneficiaryEdit(beneficiary.value.general)
  )

  useHead({ title })

  const taxHouseholds = computed(() => data.value?.taxHouseholds || [])
  const entourages = computed(() => data.value?.entourages || [])

  const authStore = useAuthStore()
  const user = computed(() => authStore.getAuthUser)

  const canSetRelatives = computed(() =>
    canEditBeneficiaryRelatives(user.value, beneficiary.value)
  )
  const canSetReferents = computed(() =>
    canEditBeneficiaryReferents(user.value, beneficiary.value)
  )
  const canSetHealth = computed(() =>
    canEditBeneficiaryHealthInfo(user.value, beneficiary.value)
  )
  const canSetOccupationIncome = computed(() =>
    canEditBeneficiaryOccupationIncome(user.value, beneficiary.value)
  )
  const canSetExternalOrganisations = computed(() =>
    canEditBeneficiaryExternalOrganisations(user.value, beneficiary.value)
  )

  async function onUpdateBeneficiary(beneficiary: SaveBeneficiaryInput) {
    isSubmitting.value = true
    // TODO: handle error
    await trpcClient.beneficiary.update.mutate({
      id: beneficiaryId,
      structureId: data.value.beneficiary.structureId,
      ...beneficiary
    })
    isSubmitting.value = false

    navigateTo(RoutePath.AppBeneficiary(beneficiaryId))
  }
</script>
