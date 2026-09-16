<template>
  <FormErrors
    v-if="errors.length > 1"
    :errors="errors"
  />
  <form
    ref="form"
    novalidate
    class="fr-container--fluid"
    @submit.prevent="onUpdateUser"
  >
    <p class="fr-mb-2w">
      <RequiredFields />
    </p>
    <div class="fr-grid-row fr-grid-row--gutters form-grid">
      <div class="fr-col-6">
        <VeeInput
          name="firstName"
          :label="userFieldLabels.firstName"
          required
        />
      </div>
      <div class="fr-col-6">
        <VeeInput
          name="lastName"
          :label="userFieldLabels.lastName"
          required
        />
      </div>
      <div class="fr-col-6">
        <VeeInput
          name="email"
          :label="userFieldLabels.email"
          type="email"
          required
        />
      </div>
      <div
        v-if="user"
        class="fr-col-6"
      >
        <VeeSelect
          name="structureId"
          hint="Le changement de structure s'effectue via l'action de transfert."
          :label="userFieldLabels.structureId"
          :options="[{ value: user.structureId!, label: currentStructureName }]"
          disabled
        />
      </div>
      <div
        v-else
        class="fr-col-6"
      >
        <VeeCombobox
          name="structureId"
          :label="userFieldLabels.structureId"
          :options="withEmptyValue(structureOptions)"
          required
        />
      </div>
      <div class="fr-col-6">
        <VeeSelect
          name="role"
          :label="userFieldLabels.role"
          :options="withEmptyValue(userRoleKeys.options)"
          required
        />
      </div>
      <div class="fr-col-6">
        <VeeSelect
          name="status"
          :label="userFieldLabels.status"
          :options="userStatusKeys.options"
          required
        />
      </div>
      <div class="fr-col-6">
        <VeeCheckbox
          :label="userFieldLabels.aidantConnectAuthorisation"
          name="aidantConnectAuthorisation"
        />
      </div>
    </div>

    <button
      class="fr-btn fr-btn--lg submit-btn fr-mt-2w"
      type="submit"
      :disabled="isSubmitting"
      :data-submitting="isSubmitting"
    >
      Enregistrer
    </button>
  </form>

  <section
    v-if="user"
    class="admin-transfer-zone fr-mt-4w"
  >
    <h2 class="fr-h6">Transfert vers une autre structure</h2>
    <p class="fr-text--sm fr-mb-2w">
      Le transfert d'utilisateur vers une autre structure est une opération
      sensible. Cette action devra être confirmée par un code envoyé à votre
      adresse email.
    </p>
    <DsfrButton
      label="Transférer vers une autre structure"
      type="button"
      secondary
      data-testid="open-transfer-modal"
      @click="onOpenTransfer"
    />
    <DsfrAlert
      v-if="canTransfer === false"
      class="fr-mt-2v"
      type="warning"
      title="Le transfert est impossible"
      :description="
        check?.isLastStructureManager
          ? 'L\'utilisateur est le ou la dernière responsable de structure'
          : 'L\'utilisateur est encore référent de certains bénéficiaires de la structure. Un transfert de référent doit d\'abord être effectué par la structure.'
      "
    />
  </section>
</template>

<script lang="ts" setup>
  import { UserStatus } from '@prisma/client'
  import { toTypedSchema } from '@vee-validate/zod'
  import type { AdminCheckTransferUserOutput, AdminUserOutput } from './types'
  import { userFieldLabels } from '~~/client/labels'
  import { userRoleKeys, userStatusKeys } from '~~/client/options'
  import type {
    AdminEditUserInput,
    AdminCreateUserInput
  } from '~~/server/schema'
  import { adminEditUserSchema, adminCreateUserSchema } from '~~/server/schema'
  import { withEmptyValue } from '~/utils/options'
  import type { Options } from '~/utils/options'
  import { formatUserDisplayName } from '~/utils/user'
  import AdminTransferUserForm from '~/components/AdminTransferUser/AdminTransferUserForm.vue'

  const trpcClient = useTrpcClient()
  const route = useRoute()
  const urlStructureId = route.query.structureId as string | undefined
  const modal = useModal()
  const snackbar = useSnackbar()

  const {
    user = undefined,
    isSubmitting,
    structureOptions = []
  } = defineProps<{
    user?: AdminUserOutput
    isSubmitting: boolean
    structureOptions?: Options
  }>()

  const emit = defineEmits<{
    updateUser: [user: AdminEditUserInput | AdminCreateUserInput]
    transferred: []
  }>()

  const form = useTemplateRef('form')

  const currentStructureName = computed(() => user?.structure?.name ?? '')

  const check = ref<AdminCheckTransferUserOutput | undefined>(undefined)
  const validateCanTransfer = (c: AdminCheckTransferUserOutput | undefined) => {
    return (
      c !== undefined &&
      c.isLastStructureManager === false &&
      c.nBeneficiaries === 0
    )
  }
  const canTransfer = computed(
    () => check.value === undefined || validateCanTransfer(check.value)
  )

  async function onOpenTransfer() {
    if (!user?.structureId) {
      return
    }
    try {
      check.value = await trpcClient.admin.checkTransferUser.query({
        id: user.id
      })
      if (!validateCanTransfer(check.value)) {
        return
      }
    } catch {
      snackbar.error('La vérification de la possibilité de transfert a échoué.')
      return
    }

    const displayName = formatUserDisplayName(user)

    modal.open(AdminTransferUserForm, {
      title: `Transférer ${displayName}`,
      size: 'lg',
      triggerOpen: true,
      user: {
        id: user.id,
        displayName,
        email: user.email,
        currentStructureId: user.structureId,
        currentStructureName: currentStructureName.value
      },
      onTransferred: () => emit('transferred')
    })
  }

  const { handleSubmit } = useForm<AdminEditUserInput | AdminCreateUserInput>({
    validationSchema: toTypedSchema(
      user ? adminEditUserSchema : adminCreateUserSchema
    ),
    initialValues: {
      id: user?.id,
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      role: user?.role as any,
      status: user?.status || UserStatus.Active,
      aidantConnectAuthorisation: !!user?.aidantConnectAuthorisation,
      structureId: user?.structureId || urlStructureId || ''
    }
  })

  const { onSubmit: onUpdateUser, caughtErrors } = useCatchFormErrors(
    handleSubmit,
    user => {
      emit('updateUser', user)
    }
  )

  const { errors } = useDisplayFormErrors(form, caughtErrors, userFieldLabels)
</script>
