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
        v-if="props.user"
        class="fr-col-6"
      >
        <VeeInput
          name="structureId"
          hint="Le changement de structure s'effectue via l'action de transfert."
          :label="userFieldLabels.structureId"
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
    v-if="props.user"
    class="admin-transfer-zone fr-mt-4w"
  >
    <h2 class="fr-h6">Transférer vers une autre structure</h2>
    <p class="fr-text--sm fr-mb-2w">
      Vous pouvez transférer cet utilisateur vers une autre structure. Cette
      opération est sensible : son rôle pourra être modifié et elle devra être
      confirmée par un code envoyé à votre boîte email.
    </p>
    <DsfrButton
      label="Transférer vers une autre structure"
      type="button"
      secondary
      data-testid="open-transfer-modal"
      @click="onOpenTransfer"
    />
  </section>
</template>

<script lang="ts" setup>
  import { UserStatus } from '@prisma/client'
  import { toTypedSchema } from '@vee-validate/zod'
  import type { AdminUserOutput } from './types'
  import { userFieldLabels } from '~~/client/labels'
  import { userRoleKeys, userStatusKeys } from '~~/client/options'
  import type {
    AdminEditUserInput,
    AdminCreateUserInput
  } from '~~/server/schema'
  import { adminEditUserSchema, adminCreateUserSchema } from '~~/server/schema'
  import { toOptions, withEmptyValue } from '~/utils/options'
  import { formatUserDisplayName } from '~/utils/user'
  import AdminTransferUserForm from '~/components/AdminTransferUser/AdminTransferUserForm.vue'

  const trpcClient = useTrpcClient()
  const route = useRoute()
  const urlStructureId = route.query.structureId as string | undefined
  const modal = useModal()

  const props = defineProps<{
    user?: AdminUserOutput
    isSubmitting: boolean
  }>()

  const emit = defineEmits<{
    updateUser: [user: AdminEditUserInput | AdminCreateUserInput]
    transferred: []
  }>()

  const form = useTemplateRef('form')

  const { data: structures } = await trpcClient.admin.getStructures.useQuery()

  const structureOptions = computed(() =>
    structures.value?.structures.length
      ? toOptions(structures.value?.structures, 'id', 'name')
      : []
  )

  const currentStructureName = computed(() => {
    if (!props.user?.structureId) {
      return ''
    }
    return (
      structures.value?.structures.find(s => s.id === props.user?.structureId)
        ?.name ?? ''
    )
  })

  function onOpenTransfer() {
    if (!props.user?.structureId) {
      return
    }
    modal.open(AdminTransferUserForm, {
      title: 'Transférer un utilisateur',
      size: 'lg',
      triggerOpen: true,
      user: {
        id: props.user.id,
        displayName: formatUserDisplayName(props.user),
        currentStructureId: props.user.structureId,
        currentStructureName: currentStructureName.value
      },
      onTransferred: () => emit('transferred')
    })
  }

  const { handleSubmit } = useForm<AdminEditUserInput | AdminCreateUserInput>({
    validationSchema: toTypedSchema(
      props.user ? adminEditUserSchema : adminCreateUserSchema
    ),
    initialValues: {
      id: props.user?.id,
      firstName: props.user?.firstName,
      lastName: props.user?.lastName,
      email: props.user?.email,
      role: props.user?.role as any,
      status: props.user?.status || UserStatus.Active,
      aidantConnectAuthorisation: !!props.user?.aidantConnectAuthorisation,
      structureId: props.user?.structureId || urlStructureId || ''
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
