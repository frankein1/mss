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
          application.module.users
            ? [userTabTitle, structureTabTitle, supportTabTitle]
            : [structureTabTitle, supportTabTitle]
        "
        :heading-level="2"
      >
        <template
          v-if="application.module.users"
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
        <template #[supportTabTitle.panelId]>
          <section class="fr-accordion big-accordion feature-section">
            <h3 class="fr-accordion__title">
              <button
                type="button"
                class="fr-accordion__btn big-accordion__btn"
                aria-expanded="true"
                aria-controls="accordion-dispositifs"
              >
                Dispositifs proposés par votre structure
              </button>
            </h3>
            <div
              id="accordion-dispositifs"
              class="fr-collapse fr-collapse--expanded"
            >
              <SupportProgramNames />
            </div>
          </section>
          <section class="fr-accordion big-accordion feature-section fr-mt-4v">
            <h3 class="fr-accordion__title">
              <button
                type="button"
                class="fr-accordion__btn big-accordion__btn"
                aria-expanded="true"
                aria-controls="accordion-objets-accompagnement"
              >
                Objets d’accompagnements proposés par votre structure
              </button>
            </h3>
            <div
              id="accordion-objets-accompagnement"
              class="fr-collapse fr-collapse--expanded"
            >
              <SocialSupportSubjects
                v-if="data"
                :subjects="data.socialSupportSubjects"
                :edit-path="routes.structure.AppStructureSubjects.path()"
                @refresh="refresh"
              />
            </div>
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

  const trpcClient = useTrpcClient()
  const modal = useModal()
  const snackbar = useSnackbar()
  const route = useRoute()
  const { application } = usePermissions()
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
  const supportTabTitle = {
    tabId: 'Accompagnements et Dispositifs',
    panelId: panelId('Accompagnements et Dispositifs'),
    title: 'Accompagnements et Dispositifs',
    icon: 'fr-icon-checkbox-circle-line'
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

  .big-accordion {
    --default-padding: 2.5rem;

    .big-accordion__btn {
      padding: var(--default-padding);
      font-size: 1.5rem;
      font-weight: 700;

      &[aria-expanded='true'] {
        background: none;
        border-bottom: 1px solid var(--border-default-grey);
      }
    }

    .fr-collapse--expanded {
      padding: var(--default-padding);
    }
  }
</style>
