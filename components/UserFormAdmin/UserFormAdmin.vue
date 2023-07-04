<template>
  <form
    class="fr-container--fluid"
    @submit="onUpdateUser"
  >
    <div class="fr-grid-row fr-grid-row--gutters">
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
      <div class="fr-col-12">
        <VeeInput
          name="email"
          :label="userFieldLabels.email"
          type="email"
          required
        />
      </div>
      <div class="fr-col-6">
        <VeeSelect
          name="role"
          :label="userFieldLabels.role"
          :options="withEmptyValue(userRoleOptions)"
          required
        />
      </div>
      <div class="fr-col-6">
        <VeeSelect
          name="status"
          :label="userFieldLabels.status"
          :options="userStatusOptions"
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
      class="fr-btn fr-btn--lg submit-btn"
      type="submit"
      :disabled="isSubmitting"
      :submitting="isSubmitting"
    >
      Modifier
    </button>
  </form>
</template>

<script lang="ts" setup>
  import { useForm } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  import { userFieldLabels } from '~/client/labels'
  import { userRoleOptions, userStatusOptions } from '~/client/options/user'
  import { withEmptyValue } from '~/utils/options'
  import { AdminUserOutput } from '~/server/routers'
  import { AdminEditUserInput, adminEditUserSchema } from '~/server/schema'

  const props = defineProps<{
    user?: AdminUserOutput
    isSubmitting: boolean
  }>()

  const emit = defineEmits<{
    (e: 'updateUser', user: AdminEditUserInput): void
  }>()

  const { handleSubmit } = useForm<AdminEditUserInput>({
    validationSchema: toTypedSchema(adminEditUserSchema),
    initialValues: {
      id: props.user?.id,
      firstName: props.user?.firstName,
      lastName: props.user?.lastName,
      email: props.user?.email,
      role: props.user?.role,
      status: props.user?.status,
      aidantConnectAuthorisation: !!props.user?.aidantConnectAuthorisation
    }
  })

  const onUpdateUser = handleSubmit(user => {
    emit('updateUser', user)
  })
</script>
