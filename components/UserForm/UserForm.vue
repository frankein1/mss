<template>
  <form
    class="fr-container--fluid"
    @submit.prevent="onInviteUser"
  >
    <div class="fr-grid-row fr-grid-row--gutters form-grid">
      <AtomInput
        name="firstName"
        :label="userFieldLabels.firstName"
        required
      />
      <AtomInput
        name="lastName"
        :label="userFieldLabels.lastName"
        required
      />
      <AtomInput
        name="email"
        :label="userFieldLabels.email"
        type="email"
        required
      />
      <AtomSelect
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
  import { withEmptyValue } from '~/utils/options'
  import { nonAdminUserRoleOptions } from '~/client/options/user'
  import { userFieldLabels } from '~/client/labels/user.labels'
  import { UserCreationInput } from '~/server/schema/user.schema'

  const snackbar = useSnackbar()

  const emit = defineEmits<{
    (e: 'usersRefresh'): void
  }>()

  const isSubmitting = ref(false)

  async function onInviteUser(event: Event) {
    isSubmitting.value = true
    const { form, data: user } = useFormData<UserCreationInput>(event)

    try {
      const res = await useTrpcClient().user.add.mutate(user)

      onSuccess(
        `Le nouvel utilisateur ${res.email} a correctement été créé. Il recevra dans quelques instants un email l'invitant à créer son compte Inclusion Connect. Pensez à l'informer de la réception de ce mail et de l'inviter si nécessaire à vérifier ses spams.`,
        form,
        10000
      )
      form.reset()
      emit('usersRefresh')
    } catch (err) {
      if (err instanceof TRPCClientError && err.data.code === 'CONFLICT') {
        onError('Cet email est déjà associé à un utilisateur.', form)
      } else onError("La création de l'utilisateur a échoué.", form)
    } finally {
      isSubmitting.value = false
    }
  }

  function onSuccess(message: string, form: HTMLFormElement, duration: number) {
    snackbar.success(
      message,
      () => form.querySelector('input')?.focus(),
      duration
    )
  }

  function onError(message: string, form: HTMLFormElement) {
    snackbar.error(message, () => form.querySelector('input')?.focus())
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
