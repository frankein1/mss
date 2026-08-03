<template>
  <section class="sss">
    <AtomCallout>
      <div class="sss__note">
        <p class="fr-callout__text">
          Les aides légales et facultatives sélectionnées ci-dessous
          correspondent aux
          <strong>
            objets des instructions de dossiers et des synthèses d’entretiens </strong
          >, visibles par tous les membres de votre structure.
          <strong>Ces intitulés alimenteront vos statistiques</strong> et vous
          permettront de facilement retrouver vos dossiers.
        </p>

        <img
          src="/pictograms/inclusion.svg"
          class="img fr-hidden fr-unhidden-sm"
          alt=""
        />
      </div>
    </AtomCallout>

    <SocialSupportSubjectsEmpty v-if="subjects.length === 0" />
    <ul
      v-else
      class="sss__items"
    >
      <SocialSupportSubjectsItem
        v-for="(item, index) in subjects"
        :id="item.id"
        :key="index"
        :label="item.name"
        :is-default="!!item.default"
        @edit="editSubject(item.id, item.name)"
        @remove="removeSubject(item.id, item.name)"
      />
    </ul>

    <div
      v-if="application.edit.structure"
      class="fr-grid-row fr-grid-row--right"
    >
      <NuxtLink
        class="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-add-line"
        :to="editPath"
      >
        Ajouter un accompagnement
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
  import type { SocialSupportSubjects } from './types'
  import SocialSupportSubjectEdition from './SocialSupportSubjectEdition.vue'
  import SocialSupportSubjectDeletion from './SocialSupportSubjectDeletion.vue'
  import type { UpdateSocialSupportSubjectNameInput } from '~/server/schema'

  defineProps<{
    subjects: SocialSupportSubjects
    editPath: string
  }>()

  const emits = defineEmits<{
    refresh: []
  }>()

  const modal = useModal()
  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()
  const { isAdmin } = useAuthState()

  const { application } = usePermissions()

  const isSubmittingModification = ref(false)
  const isSubmittingDeletion = ref(false)

  const nameCanBeUpdated = async (name: string, id?: string) => {
    const subjectWithSameNameExists =
      await trpcClient.structure.findSocialSupportSubject.query({
        name: name.trim().toLocaleLowerCase()
      })
    if (subjectWithSameNameExists) {
      if (id) {
        return subjectWithSameNameExists.id === id
      }
      return false
    }
    return true
  }

  function editSubject(id: string, name: string) {
    modal.open(SocialSupportSubjectEdition, {
      title: "Modifier un objet d'accompagnement",
      id,
      name,
      isSubmitting: isSubmittingModification.value,
      validate: (name: string, id: string) => nameCanBeUpdated(name, id),
      update: onUpdateStructureSubject
    })
  }

  const updateSubjectMutation = isAdmin()
    ? trpcClient.admin.updateSocialSupportSubject.useMutation()
    : trpcClient.structure.updateSocialSupportSubject.useMutation()

  const removeSubjectMutation = isAdmin()
    ? trpcClient.admin.makeInactiveSocialSupportSubject.useMutation()
    : trpcClient.structure.makeInactiveSocialSupportSubject.useMutation()

  function onUpdateStructureSubject(
    values: UpdateSocialSupportSubjectNameInput
  ) {
    useTrpcMutation({
      mutation: () => updateSubjectMutation.mutate(values),
      isSubmitting: isSubmittingModification,
      onSuccess: () => {
        modal.close()
        emits('refresh')
        snackbar.success('Objet d’accompagnement modifié avec succès')
      },
      onFailure: () => {
        snackbar.error("La modification de l'objet d'accompagnement a échoué")
      }
    })
  }

  function removeSubject(id: string, name: string) {
    modal.open(SocialSupportSubjectDeletion, {
      title: `Souhaitez-vous vraiment retirer l’objet “${name}” de vos accompagnements ?`,
      isSubmitting: isSubmittingDeletion.value,
      delete: () => onDeleteStructureSubject(id)
    })
  }

  function onDeleteStructureSubject(id: string) {
    useTrpcMutation({
      mutation: () => removeSubjectMutation.mutate({ id }),
      isSubmitting: isSubmittingModification,
      onSuccess: () => {
        modal.close()
        emits('refresh')
        snackbar.success('Objet d’accompagnement supprimé avec succès')
      },
      onFailure: () => {
        snackbar.error("La suppression de l'objet d'accompagnement a échoué")
      }
    })
  }
</script>

<style scoped lang="scss">
  @use '@gouvfr/dsfr/src/module/media-query' as dsfr-media-query;

  .sss > *:not(:last-of-type) {
    margin-bottom: 1.5rem;
  }

  .sss__title {
    color: var(--primary);
  }

  .sss__note {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .sss__items {
    padding: 1rem 0;

    @include dsfr-media-query.respond-from('lg') {
      columns: 2;
      column-gap: 3rem;
    }
  }

  .img {
    max-height: 100px;
    height: auto;
  }
</style>
