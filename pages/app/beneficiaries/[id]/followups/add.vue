<template>
  <PageContainer>
    <PageTitle :title="title" />
    <div class="fr-grid-row fr-grid-row--gutters fr-mt-3w">
      <div class="fr-col-12">
        <main
          ref="formContainer"
          class="main-container fr-p-5w"
        >
          <AtomAlert
            v-if="fetchError"
            :alert-type="AlertType.Error"
            :message="fetchError"
          />

          <AtomLoader
            v-if="pending"
            class="fr-mx-auto"
          />
          <FollowupForm
            v-else-if="followupTypes && prescribingOrganizations"
            :is-submitting="isSubmitting"
            :followup-types="followupTypes"
            :beneficiary-id="beneficiaryId"
            :prescribing-organizations="prescribingOrganizations"
            @save-followup="onAddFollowup"
          />
        </main>
      </div>
    </div>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { getBeneficiaryDisplayName } from '~/utils/beneficiary'
  import { HISTORY_TAB } from '~/utils/constants/beneficiary-tabs'
  import { AlertType } from '~/utils/constants/alert'
  import { Routes } from '~/utils/routing/routes'
  import { AddFollowupInput } from '~/server/schema/followup.schema'

  // FIXME: Missing permissions
  // definePageMeta({
  //   middleware: 'is-beneficiary-referent'
  // })

  const snackbar = useSnackbar()
  const trpcClient = useTrpcClient()
  const route = useRoute()

  const isSubmitting = ref<boolean>(false)
  const formContainer = ref<HTMLElement | null>(null)

  const beneficiaryId = computed(() => route.params.id as string)

  // FIXME: Should we define another query to get minimal beneficiary information ?
  const {
    data: beneficiary,
    pending: beneficiaryPending,
    error: beneficiaryError
  } = await trpcClient.beneficiary.getBeneficiaryDetails.useQuery(
    {
      id: beneficiaryId.value
    },
    { transform: ({ beneficiary }) => beneficiary }
  )

  const {
    data: followupTypes,
    pending: followupTypesPending,
    error: followupTypesError
  } = await trpcClient.config.getStructureFollowupTypes.useQuery()

  const {
    data: prescribingOrganizations,
    pending: prescribingOrganizationsPending,
    error: prescribingOrganizationsError
  } = await trpcClient.config.getPrescribingOrganizations.useQuery()

  const pending = computed(
    () =>
      beneficiaryPending.value ||
      followupTypesPending.value ||
      prescribingOrganizationsPending.value
  )

  const fetchError = computed(() => {
    if (beneficiaryError.value) {
      return "Les informations du bénéficiaire n'ont pas pu être chargées."
    }
    if (followupTypesError.value) {
      return "La liste des types d'accompagnement de votre structure n'a pas pu être chargée."
    }
    if (prescribingOrganizationsError.value) {
      return "La liste des organismes prescripteurs de votre structure n'a pas pu être chargée."
    }
    return ''
  })

  const title = computed(() => {
    if (!beneficiary.value) {
      return 'Entretien avec un·e bénéficiaire'
    }
    return `Entretien avec ${getBeneficiaryDisplayName(beneficiary.value)}`
  })

  const beneficiaryHistoryPath = computed(
    () => `${Routes.Beneficiary(beneficiaryId.value)}?tab=${HISTORY_TAB}`
  )

  async function onAddFollowup(followup: AddFollowupInput) {
    isSubmitting.value = true
    try {
      await trpcClient.followup.add.mutate(followup)
      navigateTo(beneficiaryHistoryPath.value)
    } catch {
      snackbar.error("La création de la synthèse d'entretien a échoué.", () =>
        formContainer.value?.querySelector('input')?.focus()
      )
    }
    isSubmitting.value = false
  }
</script>
