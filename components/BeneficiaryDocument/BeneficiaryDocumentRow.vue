<template>
  <tr>
    <td>{{ documentTypeLabels[document.type] }}</td>
    <td>
      <div class="name-column">
        <span
          class="name-container"
          :class="{
            'name-container-1-badge':
              document.confidential || hasUnreadNotifications,
            'name-container-2-badges':
              document.confidential && hasUnreadNotifications
          }"
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
      </div>
    </td>
    <td>{{ formatDate(document.created) }}</td>
    <td>
      <span
        v-if="document.tags.length"
        class="fr-tag"
        >{{ documentTagLabels[document.tags[0] as DocumentTag] }}</span
      >
      <span
        v-if="document.tags.length > 1"
        class="fr-tag fr-ml-1w"
        :title="
          document.tags
            .slice(1)
            .map(t => documentTagLabels[t as DocumentTag])
            .join(', ')
        "
        >+{{ document.tags.length - 1 }}</span
      >
    </td>
    <td>
      <ul class="fr-btns-group fr-btns-group--inline">
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
        <li v-if="canEdit">
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
        <li v-if="canDelete">
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
  import { GetBeneficiaryOutput, DocumentItem } from '~/server/trpc/routers'
  import { canEditDocument, canDeleteDocument } from '~/server/security'
  import { EditDocumentInput } from '~/server/schema'
  import { useAuthStore } from '~/store/auth'
  import { DocumentTag } from '~/types/document'
  import { DocumentEventAction, EventCategory } from '~/types/matomo'
  import {
    documentTypeLabels,
    documentTagLabels
  } from '~/client/options/document'

  const authStore = useAuthStore()
  const modal = useModal()
  const { matomo } = useMatomo()
  const snackbar = useSnackbar()
  const trpcClient = useTrpcClient()

  const props = defineProps<{
    document: DocumentItem
    beneficiary: GetBeneficiaryOutput
  }>()

  const emit = defineEmits<{
    refreshDocuments: []
  }>()

  const downloadLink = ref<HTMLLinkElement | null>(null)

  const user = computed(() => authStore.getAuthUser)

  const canEdit = computed(() =>
    canEditDocument(user.value, props.beneficiary, props.document)
  )

  const canDelete = computed(() =>
    canDeleteDocument(user.value, props.beneficiary)
  )

  const hasUnreadNotifications = computed(
    () => !!props.document._count.Notification
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
      onSuccess: ({ url }) => {
        const link = downloadLink.value
        if (link) {
          link.href = url
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
        beneficiary: props.beneficiary
      },
      contentComponentEvents: {
        updateDocument: onUpdateDocument
      }
    })
  }

  function onUpdateDocument(values: EditDocumentInput) {
    useTrpcMutation({
      mutation: () => trpcClient.documents.edit.mutate(values),
      onSuccess: () => {
        emit('refreshDocuments')
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
        emit('refreshDocuments')
      },
      onFailure: () => {
        snackbar.error('La suppression du document a échoué.')
      }
    })
  }
</script>

<style lang="scss" scoped>
  .name-column {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .name-container {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &.name-container-1-badge {
      max-width: 180px;
    }

    &.name-container-2-badges {
      max-width: 60px;
    }
  }

  .fr-btns-group .fr-btn {
    margin-bottom: 0;
  }
</style>
