<template>
  <form
    ref="form"
    class="fr-container--fluid"
    @submit="onInviteUser"
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
        :options="withEmptyValue(nonAdminUserRoleOptions)"
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
  import { useForm } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  import { withEmptyValue } from '~/utils/options'
  import { nonAdminUserRoleOptions } from '~/client/options/user'
  import { userFieldLabels } from '~/client/labels/user.labels'
  import { UserCreationInput, createUserSchema } from '~/server/schema'

  const snackbar = useSnackbar()

  const emit = defineEmits<{
    (e: 'usersRefresh'): void
  }>()

  const isSubmitting = ref(false)
  const form = ref<HTMLFormElement | null>(null)

  const { handleSubmit } = useForm<UserCreationInput>({
    validationSchema: toTypedSchema(createUserSchema)
  })

  const onInviteUser = handleSubmit(async user => {
    isSubmitting.value = true

    try {
      const res = await useTrpcClient().user.add.mutate(user)

      onSuccess(
        `Le nouvel utilisateur ${res.email} a correctement été créé. Il recevra dans quelques instants un email l'invitant à créer son compte Inclusion Connect. Pensez à l'informer de la réception de ce mail et de l'inviter si nécessaire à vérifier ses spams.`,
        10000
      )
      form.value?.reset()
      emit('usersRefresh')
    } catch (err) {
      if (err instanceof TRPCClientError && err.data.code === 'CONFLICT') {
        onError('Cet email est déjà associé à un utilisateur.')
      } else {
        onError("La création de l'utilisateur a échoué.")
      }
    } finally {
      isSubmitting.value = false
    }
  })

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
