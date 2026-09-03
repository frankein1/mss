<template>
  <PageContainer class="fr-p-5w">
    <PageTitle :title="title" />

    <AtomLoader
      v-if="pending"
      class="fr-mx-auto"
    />

    <AtomAlert
      v-else-if="error"
      :alert-type="AlertType.Error"
      message="Les informations de votre structure n'ont pas pu être chargées."
    />
    <div v-else-if="data">
      <StructureAdminInfo
        :structure="data.structure"
        @edit="editAdminInfo"
        @disable="disableStructure"
        @toggle-rdv="toggleRdvspIntegration"
      />

      <StructureAdminUsers
        class="fr-mb-5w"
        :structure-id="data.structure.id"
        :users="data.users"
      />

      <SocialSupportSubjects
        class="fr-mb-5w"
        :subjects="data.socialSupportSubjects"
        :edit-path="routes.admin.AdminStructureSubjects.path(structureId)"
        @refresh="refresh"
      />
    </div>
  </PageContainer>
</template>

<script lang="ts" setup>
  import StructureAdminInfoForm from '~/components/Structure/StructureAdminInfoForm.vue'
  import type { CreateStructureInput } from '~~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import StructureDisableActiveModal from '~/components/Structure/StructureDisableActiveModal.vue'
  import StructureDisableInactiveModal from '~/components/Structure/StructureDisableInactiveModal.vue'
  import { routes } from '~/utils/routes'
  import type { AdminStructureInfo } from '~/components/Structure/types'
  import { canBeDisabled } from '~/utils/structure'

  const title = routes.structure.AppStructure.title

  useHead({ title })

  const route = useRoute()
  const trpcClient = useTrpcClient()
  const modal = useModal()
  const snackbar = useSnackbar()

  const isSubmitting = ref(false)

  const structureId = route.params.id as string

  const { data, pending, error, refresh } =
    await trpcClient.admin.getStructure.useQuery({ id: structureId })

  function disableStructure() {
    if (!data?.value?.structure) {
      return
    }

    const structure = data.value.structure

    if (canBeDisabled(structure)) {
      modal.open(StructureDisableInactiveModal, {
        title: 'Désactiver une structure inactive',
        structure,
        disable: onDisable,
        cancel: onCancel
      })
      return
    }
    modal.open(StructureDisableActiveModal, {
      title: 'Désactiver une structure active',
      structure,
      disable: onDisable,
      requestCode: onRequestCode,
      cancel: onCancel
    })
  }

  function onCancel() {
    modal.close()
  }

  /** An active structure can only be disabled with a code sent by email,
   * see server/route/admin/authorizeDisableStructure.mutation.ts
   */
  async function onRequestCode(structure: AdminStructureInfo) {
    let sent = false
    await useTrpcMutation({
      isSubmitting,
      mutation: () =>
        trpcClient.admin.authorizeDisableStructure.mutate({ id: structure.id }),
      onSuccess: () => {
        sent = true
      },
      onFailure: () => {
        snackbar.error("L'envoi du code de confirmation a échoué.")
      }
    })
    return sent
  }

  /** Disable structure
   * see server/route/admin/disableStructure.mutation.ts
   */
  function onDisable(structure: AdminStructureInfo, code?: string) {
    useTrpcMutation({
      isSubmitting,
      mutation: () =>
        trpcClient.admin.disableStructure.mutate({ id: structure.id, code }),
      onSuccess: () => {
        modal.close()
        snackbar.success('Structure désactivée.')
        navigateTo(routes.admin.AdminStructures.path())
      },
      onFailure: () => {
        snackbar.error(
          code
            ? 'Le code de confirmation est invalide ou expiré.'
            : 'La désactivation a échoué.'
        )
      }
    })
  }

  function editAdminInfo() {
    if (!data || !data.value) {
      return
    }

    modal.open(StructureAdminInfoForm, {
      title: 'Modifier les informations de la structure',
      structure: data.value.structure,
      validate: updateInfo
    })
  }

  function updateInfo(values: CreateStructureInput) {
    useTrpcMutation({
      mutation: () =>
        trpcClient.admin.updateStructureInfo.mutate({
          id: structureId,
          ...values
        }),
      isSubmitting,
      onSuccess: () => {
        modal.close()
        refresh()
        snackbar.success(
          'Les informations de votre structure ont été mises à jour.'
        )
      },
      onFailure: () => {
        snackbar.error(
          'La modification des informations de votre structure a échoué.'
        )
      }
    })
  }

  function toggleRdvspIntegration(externalRdvspActive: boolean) {
    const values = { id: data.value?.structure?.id || '', externalRdvspActive }

    useTrpcMutation({
      mutation: () => trpcClient.admin.toggleRdvsp.mutate(values),
      onSuccess: () => {
        const msg = externalRdvspActive
          ? 'La fonctionnalité de prise de rendez-vous est maintenant disponible pour tous les agents de la structure'
          : 'La fonctionnalité de prise de rendez-vous a été désactivée'
        snackbar.success(msg)
      },
      onFailure: () => {
        snackbar.error("L'activation de la fonctionnalité a échoué")
      }
    })
  }
</script>
