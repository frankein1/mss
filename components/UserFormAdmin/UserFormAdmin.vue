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
      <div class="fr-col-6">
        <VeeInput
          name="email"
          :label="userFieldLabels.email"
          type="email"
          required
        />
      </div>
      <div class="fr-col-6">
        <VeeSearchableSelect
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
      Enregistrer
    </button>
  </form>
</template>

<script lang="ts" setup>
  import { UserStatus } from '@prisma/client'
  import { useForm } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  import { userFieldLabels } from '~/client/labels'
  import { userRoleOptions, userStatusOptions } from '~/client/options/user'
  import { AdminUserOutput } from '~/server/routers'
  import {
    AdminEditUserInput,
    AdminCreateUserInput,
    adminEditUserSchema,
    adminCreateUserSchema
  } from '~/server/schema'
  import { toOptions, withEmptyValue } from '~/utils/options'

  const trpcClient = useTrpcClient()
  const route = useRoute()
  const urlStructureId = route.query.structureId as string | undefined

  const props = defineProps<{
    user?: AdminUserOutput
    isSubmitting: boolean
  }>()

  const emit = defineEmits<{
    (e: 'updateUser', user: AdminEditUserInput | AdminCreateUserInput): void
  }>()

  const { data: structures } = await trpcClient.admin.getStructures.useQuery({})

  const structureOptions = computed(() =>
    structures.value?.structures.length
      ? toOptions(structures.value?.structures, 'id', 'name')
      : new Map<string, string>()
  )

  const { handleSubmit } = useForm<AdminEditUserInput | AdminCreateUserInput>({
    validationSchema: toTypedSchema(
      props.user ? adminEditUserSchema : adminCreateUserSchema
    ),
    initialValues: {
      id: props.user?.id,
      firstName: props.user?.firstName,
      lastName: props.user?.lastName,
      email: props.user?.email,
      role: props.user?.role,
      status: props.user?.status || UserStatus.Active,
      aidantConnectAuthorisation: !!props.user?.aidantConnectAuthorisation,
      structureId: props.user?.structureId || urlStructureId || ''
    }
  })

  const onUpdateUser = handleSubmit(user => {
    emit('updateUser', user)
  })
</script>
