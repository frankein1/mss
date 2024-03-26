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
      <div class="fr-col-6">
        <VeeSearchableSelect
          name="structureId"
          :label="userFieldLabels.structureId"
          :options="withEmptyValue(structureOptions)"
          :required="!isAdmin"
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
      <div
        v-if="!isAdmin"
        class="fr-col-6"
      >
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
      :submitting="isSubmitting"
    >
      Enregistrer
    </button>
  </form>
</template>

<script lang="ts" setup>
  import { UserStatus, UserRole } from '@prisma/client'
  import { toTypedSchema } from '@vee-validate/zod'
  import { AdminUserOutput } from './types'
  import { userFieldLabels } from '~/client/labels'
  import { userRoleKeys, userStatusKeys } from '~/client/options'
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
    updateUser: [user: AdminEditUserInput | AdminCreateUserInput]
  }>()

  const form = ref<HTMLFormElement | null>(null)

  const { data: structures } = await trpcClient.admin.getStructures.useQuery()

  const structureOptions = computed(() =>
    structures.value?.structures.length
      ? toOptions(structures.value?.structures, 'id', 'name')
      : []
  )

  const { handleSubmit, values } = useForm<
    AdminEditUserInput | AdminCreateUserInput
  >({
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

  const isAdmin = computed(() => values.role === UserRole.Administrator)

  const { onSubmit: onUpdateUser, caughtErrors } = useCatchFormErrors(
    handleSubmit,
    user => {
      emit('updateUser', user)
    }
  )

  const { errors } = useDisplayFormErrors(form, caughtErrors, userFieldLabels)
</script>
