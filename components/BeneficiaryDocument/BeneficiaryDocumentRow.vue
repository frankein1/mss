<template>
  <tr>
    <td class="type-data">{{ documentTypeKeys.value(document.type) }}</td>
    <td>
      <span
        class="name-container"
        :title="document.name"
        >{{ document.name }}</span
      >
      <span
        v-if="document.confidential"
        class="fr-badge fr-badge--warning fr-ml-1w"
        >CONFIDENTIEL</span
      >
      <span
        v-if="hasUnreadNotifications"
        class="fr-badge fr-badge--new fr-badge--no-icon fr-ml-1w"
      >
        <span class="fr-icon-notification-3-fill fr-icon--sm fr-mr-1v"></span>
        NOUVEAU
      </span>
    </td>
    <td>{{ formatDate(document.created) }}</td>
    <td class="tags-data">
      <span
        v-if="document.tags.length"
        class="fr-tag"
        >{{ documentTagKeys.value(document.tags[0] as DocumentTag) }}</span
      >
      <span
        v-if="document.tags.length > 1"
        class="fr-tag fr-ml-1w"
        :title="
          document.tags
            .slice(1)
            .map(t => documentTagKeys.value(t as DocumentTag))
            .join(', ')
        "
        >+{{ document.tags.length - 1 }}</span
      >
    </td>
    <td>
      <ul class="fr-btns-group fr-btns-group--inline">
        <template v-if="permissions.view">
          <li>
            <button
              class="fr-btn fr-btn--tertiary-no-outline fr-icon-eye-line"
              title="Voir dans une nouvelle fenêtre"
              :aria-label="`Voir ${document.name} - Ouvre une nouvelle fenêtre`"
              @click="onView"
            >
              Voir
            </button>
          </li>
          <li>
            <a
              ref="downloadLink"
              target="_blank"
              :download="document.name"
              hidden
            />
            <button
              class="fr-btn fr-btn--tertiary-no-outline fr-icon-download-line"
              title="Télécharger"
              :aria-label="`Télécharger ${document.name}`"
              @click="onDownload"
            >
              Télécharger
            </button>
          </li>
        </template>
        <li v-if="permissions.edit">
          <button
            class="fr-btn fr-btn--tertiary-no-outline fr-icon-pencil-line"
            data-fr-opened="false"
            aria-controls="global-modal"
            title="Modifier"
            :aria-label="`Modifier ${document.name}`"
            @click="onEdit"
          >
            Modifier
          </button>
        </li>
        <li v-if="permissions.delete">
          <button
            class="fr-btn fr-btn--tertiary-no-outline fr-icon-delete-line"
            title="Supprimer"
            :aria-label="`Supprimer ${document.name}`"
            @click="onDelete"
          >
            Supprimer
          </button>
        </li>
      </ul>
    </td>
  </tr>
</template>

<script lang="ts" setup>
  import BeneficiaryDocumentEditForm from './BeneficiaryDocumentEditForm.vue'
  import { GetDocument } from './types'
  import { EditDocumentInput } from '~/server/schema'
  import { DocumentTag } from '~/types/document'
  import { DocumentEventAction, EventCategory } from '~/types/matomo'
  import { documentTypeKeys, documentTagKeys } from '~/client/options'
  import { DocumentPermissions } from '~/server/security'

  const modal = useModal()
  const matomo = useMatomo()
  const snackbar = useSnackbar()
  const trpcClient = useTrpcClient()

  const props = defineProps<{
    document: GetDocument
    permissions: DocumentPermissions
  }>()

  const emit = defineEmits<{
    updated: [document: GetDocument]
    deleted: []
  }>()

  const downloadLink = ref<HTMLLinkElement | null>(null)

  const hasUnreadNotifications = computed(
    () => !!props.document._count.notifications
  )

  function onView() {
    matomo.trackEvent(EventCategory.Document, DocumentEventAction.See)
    useTrpcMutation({
      mutation: () =>
        trpcClient.documents.createViewUrl.mutate({
          key: props.document.key
        }),
      onSuccess: ({ url }) => {
        window.open(url, '_blank')?.focus()
      },
      onFailure: () => {
        snackbar.error('Le chargement du document a échoué.')
      }
    })
  }

  function onDownload() {
    matomo.trackEvent(EventCategory.Document, DocumentEventAction.Download)
    useTrpcMutation({
      mutation: () =>
        trpcClient.documents.createViewUrl.mutate({
          key: props.document.key
        }),
      onSuccess: ({ downloadUrl }) => {
        const link = downloadLink.value
        if (link) {
          link.href = downloadUrl
          link.type = props.document.type
          link.click()
        }
      },
      onFailure: () => {
        snackbar.error('Le chargement du document a échoué.')
      }
    })
  }

  function onEdit() {
    matomo.trackEvent(EventCategory.Document, DocumentEventAction.Edit)
    modal.open({
      title: 'Modifier le document',
      contentComponent: BeneficiaryDocumentEditForm,
      contentComponentProps: {
        document: props.document,
        permissions: props.permissions
      },
      contentComponentEvents: {
        updateDocument: onUpdateDocument
      }
    })
  }

  function onUpdateDocument(values: EditDocumentInput) {
    useTrpcMutation({
      mutation: () => trpcClient.documents.edit.mutate(values),
      onSuccess: document => {
        emit('updated', document)
        modal.close()
      },
      onFailure: () => {
        snackbar.error('La modification du document a échoué.')
      }
    })
  }

  function onDelete() {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      return
    }

    useTrpcMutation({
      mutation: () =>
        trpcClient.documents.delete.mutate({
          documentKey: props.document.key
        }),
      onSuccess: () => {
        emit('deleted')
      },
      onFailure: () => {
        snackbar.error('La suppression du document a échoué.')
      }
    })
  }
</script>

<style lang="scss" scoped>
  .name-container {
    word-break: break-word; // Allows to split dashed or underscored document names
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  .type-data,
  .tags-data {
    white-space: nowrap;
  }

  .fr-btns-group.fr-btns-group--inline {
    flex-wrap: initial;
  }

  .fr-btns-group .fr-btn {
    margin-bottom: 0;
  }
</style>
