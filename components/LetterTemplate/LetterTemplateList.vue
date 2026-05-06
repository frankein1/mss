<template>
  <div>
    <!-- Empty state -->
    <div
      v-if="!templates.length"
      class="fr-py-6w fr-text--center"
    >
      <img
        src="/pictograms/document.svg"
        alt=""
        class="fr-mb-3w"
        style="height: 80px"
      />
      <p class="fr-text--lg fr-mb-3w">Vous n'avez aucun document.</p>
      <button
        class="fr-btn fr-btn--icon-left fr-icon-download-line"
        type="button"
        @click="openUploadModal"
      >
        Importer un document
      </button>
    </div>

    <!-- List -->
    <template v-else>
      <div class="fr-grid-row fr-grid-row--middle fr-mb-2w">
        <div class="fr-col">
          <p class="fr-mb-0">
            {{ templates.length }} document{{ templates.length > 1 ? 's' : '' }}
          </p>
        </div>
        <div class="fr-col-auto">
          <button
            class="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-download-line"
            type="button"
            @click="openUploadModal"
          >
            Importer un document
          </button>
        </div>
      </div>

      <div class="fr-table fr-table--no-caption fr-table--layout-fixed">
        <table>
          <thead>
            <tr>
              <th scope="col">Nom du document</th>
              <th scope="col">Ajouté par</th>
              <th scope="col">Ajouté le</th>
              <th
                scope="col"
                class="fr-text--right"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="template in templates"
              :key="template.id"
            >
              <td>{{ template.name }}</td>
              <td>
                {{ template.createdBy.firstName }}
                {{ template.createdBy.lastName }}
              </td>
              <td>
                {{ new Date(template.createdAt).toLocaleDateString('fr-FR') }}
              </td>
              <td class="fr-text--right">
                <a
                  :href="`/api/letter-template/${template.id}`"
                  download
                  class="fr-btn fr-btn--tertiary-no-outline fr-btn--icon-only fr-icon-download-line fr-mr-1w"
                  :title="`Télécharger ${template.name}`"
                  :aria-label="`Télécharger ${template.name}`"
                />
                <button
                  class="fr-btn fr-btn--tertiary-no-outline fr-btn--icon-only fr-icon-edit-line fr-mr-1w"
                  type="button"
                  :title="`Renommer ${template.name}`"
                  :aria-label="`Renommer ${template.name}`"
                  @click="openRenameModal(template)"
                />
                <button
                  class="fr-btn fr-btn--tertiary-no-outline fr-btn--icon-only fr-icon-delete-line"
                  type="button"
                  :title="`Supprimer ${template.name}`"
                  :aria-label="`Supprimer ${template.name}`"
                  @click="openDeleteConfirm(template)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import type { RouterOutput } from '~/server/trpc/routers'
  import LetterTemplateUploadModal from './LetterTemplateUploadModal.vue'
  import LetterTemplateRenameModal from './LetterTemplateRenameModal.vue'
  import LetterTemplateDeleteModal from './LetterTemplateDeleteModal.vue'

  type Template = RouterOutput['letterTemplate']['list'][0]

  defineProps<{ templates: Template[] }>()
  const emit = defineEmits<{ refresh: [] }>()

  const modal = useModal()
  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()

  function openUploadModal() {
    modal.open(LetterTemplateUploadModal, {
      title: 'Importer un document',
      triggerOpen: true,
      onSuccess: () => emit('refresh')
    })
  }

  function openRenameModal(template: Template) {
    modal.open(LetterTemplateRenameModal, {
      title: 'Renommer le document',
      triggerOpen: true,
      templateId: template.id,
      initialName: template.name,
      onSuccess: () => emit('refresh')
    })
  }

  function openDeleteConfirm(template: Template) {
    modal.open(LetterTemplateDeleteModal, {
      title: 'Supprimer le modèle',
      triggerOpen: true,
      templateName: template.name,
      onConfirm: async () => {
        try {
          await trpcClient.letterTemplate.delete.mutate({ id: template.id })
          modal.close()
          emit('refresh')
          snackbar.success('Le modèle a été supprimé.')
        } catch {
          snackbar.error('La suppression a échoué.')
        }
      }
    })
  }
</script>
