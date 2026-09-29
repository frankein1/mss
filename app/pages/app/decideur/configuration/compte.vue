<template>
  <AtomLazyComponent
    :error="Boolean(organisationError)"
    message="Les informations de votre compte n'ont pas pu être chargées."
    :pending="organisationStatus === 'pending'"
  >
    <section class="feature-section fr-p-5v fr-p-md-10v fr-mb-5w">
      <h3 class="fr-h5">Mon organisation</h3>

      <ul class="information-list">
        <li>
          <span class="fr-text--bold">Organisation&nbsp;:</span>
          {{ organisation?.user.structure?.name ?? 'Non identifiée' }}
        </li>
        <li>
          <span class="fr-text--bold">SIRET&nbsp;:</span>
          {{ organisation?.user.structure?.siret ?? '—' }}
        </li>
        <li v-if="organisation?.invitedBy">
          <span class="fr-text--bold"
            >Compte créé à l'invitation de&nbsp;:</span
          >
          {{ organisation.invitedBy.structure.name }}
          <template v-if="organisation.invitedBy.createdBy">
            par {{ organisation.invitedBy.createdBy.firstName }}
            {{ organisation.invitedBy.createdBy.lastName }}
          </template>
          le {{ formatDate(organisation.invitedBy.createdAt) }}
        </li>
      </ul>

      <p
        v-if="!organisation?.user.structure"
        class="fr-text--sm text--muted fr-mt-2w fr-mb-0"
      >
        Votre organisation n'a pas pu être identifiée lors de votre connexion.
        Cela n'empêche pas la consultation des statistiques qui vous sont
        partagées.
      </p>
    </section>

    <form
      novalidate
      @submit.prevent="onSubmit"
    >
      <section class="feature-section fr-p-5v fr-p-md-10v">
        <h3 class="fr-h5">Informations de profil</h3>

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

        <!-- L'e-mail identifie la personne auprès de ProConnect : il n'est pas
             modifiable ici, comme pour les comptes des structures. -->
        <div class="fr-input-group fr-input-group--disabled">
          <label
            class="fr-label"
            for="decision-maker-email"
          >
            {{ userFieldLabels.email }}
            <span class="fr-hint-text">
              Pour modifier votre adresse e-mail, contactez le support.
            </span>
          </label>
          <input
            id="decision-maker-email"
            class="fr-input"
            type="email"
            disabled
            :value="organisation?.user.email"
          />
        </div>

        <button
          class="fr-btn fr-mt-4v"
          type="submit"
          :data-submitting="status === 'pending'"
          :disabled="status === 'pending'"
        >
          Enregistrer
        </button>
      </section>
    </form>
  </AtomLazyComponent>
</template>

<script lang="ts" setup>
  import {
    updateDecisionMakerProfileSchema,
    type UpdateDecisionMakerProfileInput
  } from '~~/server/schema'
  import { userFieldLabels } from '~~/client/labels'

  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()

  const {
    data: organisation,
    error: organisationError,
    status: organisationStatus,
    refresh
  } = await trpcClient.decisionMaker.getMyOrganisation.useQuery()

  const { handleSubmit } = useForm<UpdateDecisionMakerProfileInput>({
    validationSchema: toTypedSchema(updateDecisionMakerProfileSchema),
    initialValues: {
      firstName: organisation.value?.user.firstName ?? '',
      lastName: organisation.value?.user.lastName ?? ''
    }
  })

  const { mutate, error, status } =
    trpcClient.decisionMakerAccount.updateProfile.useMutation()

  const onSubmit = handleSubmit(async values => {
    const updated = await mutate(values)
    if (error.value || !updated) {
      snackbar.error('La mise à jour de votre profil a échoué.')
      return
    }
    await refresh()
    snackbar.success('Vos informations ont été mises à jour.')
  })

  function formatDate(date: Date) {
    return new Date(date).toLocaleDateString('fr-FR')
  }
</script>
