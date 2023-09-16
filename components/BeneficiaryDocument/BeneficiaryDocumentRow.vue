<template>
  <tr>
    <td>{{ documentTypeLabels[document.type] }}</td>
    <td>
      <div class="name-container">
        {{ document.name }}
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
        >+{{ document.tags.length - 1 }}</span
      >
    </td>
    <td>
      <button
        class="fr-btn fr-btn--tertiary-no-outline fr-icon-eye-line"
        :title="'Nouvel onglet - Voir ' + document.name"
        @click="onView"
      >
        Voir
      </button>
      <a
        ref="downloadLink"
        target="_blank"
        :download="document.name"
        hidden
      />
      <button
        class="fr-btn fr-btn--tertiary-no-outline fr-icon-download-line"
        :title="'Télécharger ' + document.name"
        @click="onDownload"
      >
        Télécharger
      </button>
      <button
        v-if="canEdit"
        class="fr-btn fr-btn--tertiary-no-outline fr-icon-pencil-line"
        data-fr-opened="false"
        aria-controls="global-modal"
        @click="onEdit"
      >
        Modifier le document
      </button>
      <button
        v-if="canDelete"
        class="fr-btn fr-btn--tertiary-no-outline fr-icon-delete-line"
        @click="onDelete"
      >
        Supprimer le document
      </button>
    </td>
  </tr>
</template>

<script lang="ts" setup>
  import BeneficiaryDocumentEditForm from './BeneficiaryDocumentEditForm.vue'
  import { DocumentItem } from './types'
  import { GetBeneficiaryOutput } from '~/server/routers'
  import { canEditDocument, canDeleteDocument } from '~/server/security/rules'
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

  const onView = async () => {
    if (process.client) {
      matomo.trackEvent(EventCategory.Document, DocumentEventAction.See)
      const { url } = await useTrpcClient().documents.createViewUrl.mutate({
        key: props.document.key
      })
      window.open(url, '_blank')?.focus()
    }
  }

  const onDownload = async () => {
    if (process.client) {
      matomo.trackEvent(EventCategory.Document, DocumentEventAction.Download)
      const { url } = await useTrpcClient().documents.createViewUrl.mutate({
        key: props.document.key
      })
      const link = downloadLink.value
      if (link) {
        link.href = url
        link.type = props.document.type
        link.click()
      }
    }
  }

  function onEdit() {
    matomo.trackEvent(EventCategory.Document, DocumentEventAction.Edit)
    modal.open(
      'Modifier le document',
      BeneficiaryDocumentEditForm,
      { document: props.document, beneficiary: props.beneficiary },
      {
        updateDocument: onUpdateDocument
      }
    )
  }

  async function onUpdateDocument(values: EditDocumentInput) {
    await useTrpcClient().documents.edit.mutate(values)
    emit('refreshDocuments')
    modal.close()
  }

  async function onDelete() {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      return
    }
    await useTrpcClient().documents.delete.mutate({
      documentKey: props.document.key
    })
    emit('refreshDocuments')
  }
</script>

<style scoped>
  .name-container {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
</style>
