<template>
  <BeneficiaryEditFormLayout
    :family-file-id="beneficiary?.familyFileId || ''"
    :family-identification="familyIdentification"
    :beneficiary-identification="beneficiaryIdentification"
    :binded-values="bindedValues"
    :permissions="permissions"
    :schema="updateBeneficiaryHealthSchema"
    :is-submitting="status === 'pending'"
    :current-route="routes.beneficiary.AppBeneficiaryEditHealth.name"
    :small-title="true"
    :title-icon="getFormIcon(familyIdentification.length)"
    @save="onSaveBeneficiary"
  >
    <AtomLazyComponent
      :pending
      :error="Boolean(errorFetch)"
      message="Les informations du bénéficiaire n'ont pas pu être chargées."
    >
      <BeneficiaryFormHealth
        v-if="bindedValues && permissions"
        :permissions
      />
    </AtomLazyComponent>
  </BeneficiaryEditFormLayout>
</template>

<script lang="ts" setup>
  import type { UpdateBeneficiaryHealthInput } from '~~/server/schema'
  import { updateBeneficiaryHealthSchema } from '~~/server/schema'
  import { routes } from '~/utils/routes'

  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()

  const route = useRoute()
  const beneficiaryId = route.params.id as string

  const {
    beneficiary,
    permissions,
    beneficiaryIdentification,
    familyIdentification,
    pending,
    error: errorFetch,
    refresh
  } = await useBeneficiaryDetails(beneficiaryId)

  const bindedValues = computed(() => {
    if (!beneficiary.value) {
      return null
    }

    const { id, structureId, health } = beneficiary.value

    return {
      id,
      structureId,
      ...health
    }
  })

  const router = trpcClient.beneficiary
  const { mutate, error, status } = router.updateHealth.useMutation()

  async function onSaveBeneficiary(
    ben: UpdateBeneficiaryHealthInput,
    target: string | undefined
  ) {
    if (!beneficiary.value) {
      return
    }

    const updated = await mutate(ben)

    if (error.value || !updated) {
      snackbar.error(
        'La mise à jour de la fiche bénéficiaire a échoué.',
        snackbar.focus('.actions-bar', "button[type='submit']" as FocusHTMLTag)
      )
      return
    }

    await refresh()
    navigateTo(target)
  }

  definePageMeta({
    layout: 'second-navigation'
  })
</script>
