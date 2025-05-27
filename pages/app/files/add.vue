<template>
  <PageContainer class="page-container">
    <AtomBreadcrumb :links="breadcrumbs.beneficiary.AppBeneficiariesAdd()" />
    <PageTitle
      :title="title"
      icon="fr-icon-user-add-line"
    >
      <RequiredFields />
    </PageTitle>
    <AtomAlert
      v-if="error"
      class="fr-mb-2w"
      :alert-type="AlertType.Error"
      message="La liste des référents n'a pas pu être chargée."
    />
    <AtomLoader
      v-else-if="pending"
      class="fr-mx-auto"
    />
    <BeneficiaryCreationForm
      v-else-if="agents?.length"
      :agents="agents"
      :is-submitting="isSubmitting"
      @cancel="onCancel"
      @save-beneficiary="onCreateBeneficiary"
    />
  </PageContainer>
</template>

<script setup lang="ts">
  import { CreateBeneficiaryEventAction, EventCategory } from '~/types/matomo'
  import { CreateBeneficiaryInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { routes } from '~/utils/routes'
  import { breadcrumbs } from '~/utils/breadcrumbs'

  const title = routes.beneficiary.AppBeneficiariesAdd.title

  useHead({ title })

  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()

  const matomo = useMatomo()

  const {
    data: agents,
    pending,
    error
  } = await trpcClient.config.getAgents.useQuery()

  const isSubmitting = ref(false)

  const onCancel = () => {
    useRouter().back()
  }

  function onCreateBeneficiary(
    beneficiary: CreateBeneficiaryInput,
    complete: boolean
  ) {
    useTrpcMutation({
      mutation: () => trpcClient.beneficiary.create.mutate(beneficiary),
      isSubmitting,
      onSuccess: ({ id, familyFileId }) => {
        matomo.trackEvent(
          EventCategory.CreateBeneficiary,
          CreateBeneficiaryEventAction.SavePartialForm
        )
        if (complete) {
          navigateTo(routes.beneficiary.AppBeneficiaryEditInfo.path(id))
        } else {
          navigateTo(
            routes.file.AppFile.path(familyFileId, { beneficiaryId: id })
          )
        }
      },
      onFailure: () => {
        snackbar.error('La création de la fiche bénéficiaire a échoué.')
      }
    })
  }
</script>

<style scoped>
  .page-container {
    padding-left: 10em;
    padding-right: 10em;
  }
</style>
