<template>
  <FormErrors
    v-if="errors.length > 1"
    :errors="errors"
  />
  <form
    ref="form"
    novalidate
    class="fr-container--fluid"
    @submit.prevent="onInviteUser"
  >
    <div class="fr-grid-row fr-grid-row--gutters form-grid">
      <VeeInput
        name="firstName"
        :label="userFieldLabels.firstName"
        required
      />
      <VeeInput
        name="lastName"
        :label="userFieldLabels.lastName"
        required
      />
      <VeeInput
        name="email"
        :label="userFieldLabels.email"
        type="email"
        required
      />
      <VeeSelect
        name="role"
        :label="userFieldLabels.role"
        :options="withEmptyValue(nonAdminUserRoleKeys.options)"
        required
      />
    </div>

    <button
      class="fr-btn fr-btn--lg submit-btn"
      type="submit"
      :disabled="isSubmitting"
      :submitting="isSubmitting"
    >
      Créer
    </button>
  </form>
</template>

<script lang="ts" setup>
  import { TRPCClientError } from '@trpc/client'
  import { toTypedSchema } from '@vee-validate/zod'
  import { withEmptyValue } from '~/utils/options'
  import { nonAdminUserRoleKeys } from '~/client/options'
  import { userFieldLabels } from '~/client/labels'
  import { UserCreationInput, createUserSchema } from '~/server/schema'
  import { getUserCreationMessage } from '~/utils/user'

  const snackbar = useSnackbar()

  const emit = defineEmits<{
    usersRefresh: []
  }>()

  const isSubmitting = ref(false)
  const form = ref<HTMLFormElement | null>(null)

  const { handleSubmit } = useForm<UserCreationInput>({
    validationSchema: toTypedSchema(createUserSchema)
  })

  const { onSubmit: onInviteUser, caughtErrors } = useCatchFormErrors(
    handleSubmit,
    user => {
      useTrpcMutation({
        mutation: () => useTrpcClient().user.add.mutate(user),
        isSubmitting,
        onSuccess: ({ email }) => {
          onSuccess(getUserCreationMessage(email), 10000)
          form.value?.reset()
          emit('usersRefresh')
        },
        onFailure: err => {
          if (err instanceof TRPCClientError && err.data.code === 'CONFLICT') {
            onError('Cet email est déjà associé à un utilisateur.')
          } else {
            onError("La création de l'utilisateur a échoué.")
          }
        }
      })
    }
  )

  const { errors } = useDisplayFormErrors(form, caughtErrors, userFieldLabels)

  function onSuccess(message: string, duration: number) {
    snackbar.success(
      message,
      () => form.value?.querySelector('input')?.focus(),
      duration
    )
  }

  function onError(message: string) {
    snackbar.error(message, () => form.value?.querySelector('input')?.focus())
  }
</script>

<style lang="scss" scoped>
  @use '@gouvfr/dsfr/src/core/index' as dsfr;
  @use '@gouvfr/dsfr/module/media-query' as dsfr-media-query;

  .form-grid > * {
    @include dsfr.grid-col(12);

    padding: 0.5rem;

    @include dsfr-media-query.respond-from('lg') {
      @include dsfr.grid-col(6);

      padding: 0.75rem;
    }
  }
</style>
