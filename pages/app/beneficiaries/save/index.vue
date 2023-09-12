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
          <AtomAlert
            v-if="fetchError"
            class="fr-mb-2w"
            :alert-type="AlertType.Error"
            :message="fetchError"
          />
          <AtomLoader
            v-else-if="pending"
            class="fr-mx-auto"
          />
          <BeneficiaryForm
            v-else-if="beneficiary && agents?.length"
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
  import { UserStatus } from '@prisma/client'
  import { CreateBeneficiaryInput, SaveBeneficiaryInput } from '~/server/schema'
  import { canSaveBeneficiaryWithCompleteInfo } from '~/server/security/rules'
  import { useAuthStore } from '~/store/auth'
  import { CreateBeneficiaryEventAction, EventCategory } from '~/types/matomo'
  import { AlertType } from '~/utils/constants/alert'
  import { RoutePath, Breadcrumb, RouteTitle } from '~/utils/routing'

  const title = RouteTitle.AppBeneficiariesAdd()

  useHead({ title })

  const trpcClient = useTrpcClient()
  const { matomo } = useMatomo()

  const isSubmitting = ref(false)

  const authStore = useAuthStore()
  const route = useRoute()

  const {
    data: agents,
    pending: agentsPending,
    error: agentsError
  } = await trpcClient.config.getAgents.useQuery()

  const { data: beneficiaryDraft, pending: beneficiaryDraftPending } =
    await useAsyncData(loadBeneficiaryDraft)

  const user = authStore.getAuthUser

  const pending = computed(
    () => agentsPending.value || beneficiaryDraftPending.value
  )

  const fetchError = computed(() => {
    if (agentsError.value) {
      return "La liste des référents n'a pas pu être chargée."
    }
    return ''
  })

  const beneficiary = computed<SaveBeneficiaryInput>(() => ({
    structureId: user.structureId,
    referents: beneficiaryDraft.value?.general?.referents || [],
    aidantConnectAuthorized:
      beneficiaryDraft.value?.general?.aidantConnectAuthorized || false,
    // General Info
    general: {
      status: beneficiaryDraft.value?.general?.status || UserStatus.Active,
      firstName: beneficiaryDraft.value?.general?.firstName,
      usualName: beneficiaryDraft.value?.general?.usualName,
      birthName: beneficiaryDraft.value?.general?.birthName,
      birthDate: beneficiaryDraft.value?.general?.birthDate,
      numeroPegase: beneficiaryDraft.value?.general?.numeroPegase,
      noPhone: false,
      phone1: beneficiaryDraft.value?.general?.phone1,
      email: beneficiaryDraft.value?.general?.email,
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

  async function loadBeneficiaryDraft() {
    const draftId = route.query.draftId as string | null

    if (!draftId) {
      return undefined
    }

    const beneficiaryDraft = await trpcClient.beneficiaryDraft.get.query({
      id: route.query.draftId as string
    })

    return {
      ...beneficiaryDraft,
      general: beneficiaryDraft.general
        ? (JSON.parse(beneficiaryDraft.general) as CreateBeneficiaryInput)
        : null
    }
  }

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
