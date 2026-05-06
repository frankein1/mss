<template>
  <PageContainer>
    <AtomBreadcrumb :links="breadcrumbs.structure.AppStructure()" />
    <PageTitle :title="title" />

    <AtomLazyComponent
      :error="Boolean(error)"
      message="Les informations de votre stucture n'ont pas pu être chargées."
      :pending="status === 'pending'"
    >
      <AtomTabs
        class="stats-tabs"
        tab-list-name="Statistiques de la structure"
        :tab-titles="
          authState.isStructureManager()
            ? [
                userTabTitle,
                structureTabTitle,
                socialSupportSubjectsTabTitle,
                letterTemplatesTabTitle
              ]
            : [
                structureTabTitle,
                socialSupportSubjectsTabTitle,
                letterTemplatesTabTitle
              ]
        "
        :heading-level="2"
      >
        <template
          v-if="authState.isStructureManager()"
          #[userTabTitle.panelId]
        >
          <StructureUsers />
        </template>

        <template #[structureTabTitle.panelId]>
          <StructureInfo
            v-if="data"
            class="fr-mb-5w"
            :structure="data.structure"
            @edit="onEdit"
          />
        </template>
        <template #[socialSupportSubjectsTabTitle.panelId]>
          <SocialSupportSubjects
            v-if="data"
            :subjects="data.socialSupportSubjects"
            :edit-path="routes.structure.AppStructureSubjects.path()"
            @refresh="refresh"
          />
        </template>
        <template #[letterTemplatesTabTitle.panelId]>
          <section class="feature-section bg-color-white fr-p-4w">
            <p class="fr-mb-3w">
              Créez des modèles de courriers Word (.docx) pré-remplis
              automatiquement avec les données des dossiers de vos
              bénéficiaires.
            </p>
            <NuxtLink
              class="fr-btn fr-btn--icon-left fr-icon-settings-4-line"
              :to="routes.structure.AppStructureLetterTemplates.path()"
            >
              Configurer les modèles de courriers
            </NuxtLink>
          </section>
        </template>
      </AtomTabs>
    </AtomLazyComponent>
  </PageContainer>
</template>

<script lang="ts" setup>
  import StructureInfoForm from '~/components/Structure/StructureInfoForm.vue'
  import type { EditStructureInfoInput } from '~/server/schema'
  import { routes } from '~/utils/routes'
  import { breadcrumbs } from '~/utils/breadcrumbs'

  const title = routes.structure.AppStructure.title
  useHead({ title })

  const authState = useAuthState()
  const trpcClient = useTrpcClient()
  const modal = useModal()
  const snackbar = useSnackbar()
  const route = useRoute()
  const isSubmitting = ref(false)

  const { data, error, status, refresh } =
    await trpcClient.structure.getStructure.useQuery()

  const userTabTitle = {
    tabId: 'Utilisateurs',
    panelId: panelId('Utilisateurs'),
    title: 'Utilisateurs',
    icon: 'fr-icon-group-line'
  }
  const structureTabTitle = {
    tabId: 'Infos structure',
    panelId: panelId('Infos structure'),
    title: 'Infos structure',
    icon: 'fr-icon-home-4-line'
  }
  const socialSupportSubjectsTabTitle = {
    tabId: 'Objets d’accompagnement',
    panelId: panelId('Objets d’accompagnement'),
    title: 'Objets d’accompagnement',
    icon: 'fr-icon-checkbox-circle-line'
  }
  const letterTemplatesTabTitle = {
    tabId: 'Modèles de courriers',
    panelId: panelId('Modèles de courriers'),
    title: 'Modèles de courriers',
    icon: 'fr-icon-draft-line'
  }

  // Structure info
  function onEdit() {
    if (!data || !data.value) {
      return
    }

    modal.open(StructureInfoForm, {
      title: 'Modifier les informations de ma structure',
      structure: data.value.structure,
      validate: onUpdateStructureInfo
    })
  }

  if (route.query.modifyStructure === 'true' && data && data.value) {
    modal.open(StructureInfoForm, {
      title: 'Modifier les informations de ma structure',
      structure: data.value.structure,
      validate: onUpdateStructureInfo,
      triggerOpen: true,
      dpoScroll: true
    })
  }

  function onUpdateStructureInfo(values: EditStructureInfoInput) {
    useTrpcMutation({
      mutation: () => trpcClient.structure.updateStructureInfo.mutate(values),
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
</script>

<style lang="scss" scoped>
  :deep(.fr-tabs__panel) {
    padding-top: 2rem !important;
  }
</style>
