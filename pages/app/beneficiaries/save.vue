<template>
  <PageContainer>
    <DsfrBreadcrumb :links="Breadcrumb.AppBeneficiariesAdd()" />
    <PageTitle :title="title">
      <RequiredFields />
    </PageTitle>
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
            :tax-households="[]"
            :entourages="[]"
            :current-beneficiary-id="null"
            :can-set-external-organisations="canSetExternalOrganisations"
            :can-set-health="canSetHealth"
            :can-set-occupation-income="canSetOccupationIncome"
            :can-set-referents="canSetReferents"
            :can-set-relatives="canSetRelatives"
            @save-beneficiary="onSaveBeneficiary"
          />
        </main>
      </div>
    </div>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { CreateBeneficiaryInput, SaveBeneficiaryInput } from '~/server/schema'
  import { canSaveBeneficiaryWithCompleteInfo } from '~/server/security/rules'
  import { useAuthStore } from '~/store/auth'
  import { CreateBeneficiaryEventAction, EventCategory } from '~/types/matomo'
  import { RoutePath, Breadcrumb, RouteTitle } from '~/utils/routing'

  const title = RouteTitle.AppBeneficiariesAdd()

  useHead({ title })

  const trpcClient = useTrpcClient()
  const { matomo } = useMatomo()

  const { data: agents } = await trpcClient.config.getAgents.useQuery()

  const isSubmitting = ref(false)

  const authStore = useAuthStore()
  const route = useRoute()

  const initialValues = route.query.initialValues
  let values = {} as CreateBeneficiaryInput
  if (initialValues) {
    values = JSON.parse(initialValues.toString())
  }

  const user = authStore.getAuthUser

  const beneficiary = computed<SaveBeneficiaryInput>(() => ({
    structureId: user.structureId,
    referents: values.referents || [],
    aidantConnectAuthorized: values.aidantConnectAuthorized,
    // General Info
    general: {
      status: values.status,
      firstName: values.firstName,
      usualName: values.usualName,
      birthName: values.birthName,
      birthDate: values.birthDate,
      numeroPegase: values.numeroPegase,
      noPhone: false,
      phone1: values.phone1,
      email: values.email,
      caregiver: false
    },
    taxHousehold: {},
    entourage: {},
    external: {},
    occupation: {
      mainIncomeSource: [],
      pensionOrganisations: [],
      majorChildrenMainIncomeSource: [],
      partnerMainIncomeSource: []
    },
    health: {}
  }))

  const canSetRelatives = computed(() =>
    canSaveBeneficiaryWithCompleteInfo(user)
  )
  const canSetReferents = computed(() =>
    canSaveBeneficiaryWithCompleteInfo(user)
  )
  const canSetHealth = computed(() => canSaveBeneficiaryWithCompleteInfo(user))
  const canSetOccupationIncome = computed(() =>
    canSaveBeneficiaryWithCompleteInfo(user)
  )
  const canSetExternalOrganisations = computed(() =>
    canSaveBeneficiaryWithCompleteInfo(user)
  )

  async function onSaveBeneficiary(beneficiary: SaveBeneficiaryInput) {
    isSubmitting.value = true
    // TODO: handle error
    const { id } = await trpcClient.beneficiary.save.mutate({
      ...beneficiary
    })
    isSubmitting.value = false

    matomo.trackEvent(
      EventCategory.CreateBeneficiary,
      CreateBeneficiaryEventAction.SaveCompleteForm
    )

    navigateTo(RoutePath.AppBeneficiary(id))
  }
</script>
