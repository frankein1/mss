<template>
  <div
    :id="`document-${document.key}`"
    class="fr-card fr-card--sm force-focus-visible"
    tabindex="0"
  >
    <div class="fr-card__body">
      <div class="fr-card__content">
        <h3 class="fr-card__title">
          <span>{{ document.name }}</span>
          <ul
            class="fr-btns-group fr-btns-group--inline fr-btns-group--sm fr-ml-1v"
          >
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
              class="fr-btn fr-btn--tertiary-no-outline fr-icon-delete-line btn-delete-action"
              @click="onDelete"
            >
              Supprimer le document
            </button>
          </ul>
        </h3>
        <div class="fr-card__start">
          <ul class="fr-badges-group">
            <li v-if="document.confidential">
              <p class="fr-badge fr-badge--warning">Confidentiel</p>
            </li>
            <li
              v-for="tag in document.tags"
              :key="tag"
            >
              <p
                class="fr-badge"
                :class="getDocumenTagClass(tag)"
              >
                {{ documentTagOptions.get(tag) }}
              </p>
            </li>
            <li v-if="hasUnreadNotifications">
              <p class="fr-badge fr-badge--new fr-badge--no-icon">
                <span class="fr-icon-notification-3-fill fr-icon--sm"></span>
              </p>
            </li>
          </ul>
        </div>
        <div class="fr-card__end">
          <p class="fr-card__detail">
            {{ formatMimeType(document.mimeType) }} –
            {{ formatByteSize(document.size) }}
          </p>
        </div>
      </div>
      <div class="fr-card__footer">
        <ul class="fr-links-group">
          <li>
            <button
              class="fr-link fr-icon-eye-line"
              target="_blank"
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
          </li>
          <li>
            <button
              class="fr-download__link"
              target="_blank"
              :title="'Télécharger ' + document.name"
              @click="onDownload"
            >
              Télécharger
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import BeneficiaryDocumentEditForm from './BeneficiaryDocumentEditForm.vue'
  import { getDocumenTagClass } from '~/client/classes/document'
  import { documentTagOptions } from '~/client/options/document'
  import { EditDocumentInput } from '~/server/schema'
  import {
    GetBeneficiaryDocumentOutput,
    GetBeneficiaryOutput
  } from '~/server/routers'
  import { canEditDocument, canDeleteDocument } from '~/server/security/rules'
  import { useAuthStore } from '~/store/auth'

  const authStore = useAuthStore()

  const props = defineProps<{
    document: GetBeneficiaryDocumentOutput
    beneficiary: GetBeneficiaryOutput
  }>()

  const emit = defineEmits<{
    (e: 'refreshDocuments'): void
  }>()

  const modal = useModal()

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

  const onDownload = async () => {
    if (process.client) {
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

  const onView = async () => {
    if (process.client) {
      const { url } = await useTrpcClient().documents.createViewUrl.mutate({
        key: props.document.key
      })
      window.open(url, '_blank')?.focus()
    }
  }

  function onEdit() {
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

<style lang="scss" scoped>
  @use '@gouvfr/dsfr/src/core/index' as dsfr;

  $card-padding: 1rem;

  .fr-card__title {
    @include dsfr.text-style(md);

    display: flex;
    justify-content: space-between;
    align-items: center;
    word-break: break-all;
  }

  .fr-card__body {
    padding: 0 #{$card-padding};
  }

  .fr-card--sm .fr-card__content {
    padding: #{$card-padding} #{$card-padding} 0.5rem;
    margin: 0 -#{$card-padding};
  }

  .fr-card__footer {
    margin: 0 -#{$card-padding};
  }

  .fr-card--sm .fr-card__footer {
    padding: 0 #{$card-padding} #{$card-padding};
  }

  .fr-card--sm .fr-card__end {
    margin-top: 0;
    padding-top: 0;
  }

  .fr-links-group {
    display: flex;
    justify-content: space-between;
  }

  .fr-card__footer .fr-links-group {
    margin: 0;
  }

  .fr-links-group > li {
    line-height: initial;
  }

  // Force overriding the default icon of target=blank anchors to display the eye icon
  .fr-link.fr-icon-eye-line::after {
    mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBkPSJNMTIgM2M1LjM5MiAwIDkuODc4IDMuODggMTAuODE5IDktLjk0IDUuMTItNS40MjcgOS0xMC44MTkgOS01LjM5MiAwLTkuODc4LTMuODgtMTAuODE5LTlDMi4xMjEgNi44OCA2LjYwOCAzIDEyIDNabTAgMTZjNC4yIDAgNy44NDItMi45MDUgOC43NzctN2E5LjAwNSA5LjAwNSAwIDAgMC0xNy41NTQgMEE5LjAwNSA5LjAwNSAwIDAgMCAxMiAxOVptMC0yLjVhNC41IDQuNSAwIDEgMSAwLTkgNC41IDQuNSAwIDAgMSAwIDlabTAtMmEyLjUgMi41IDAgMSAwIDAtNSAyLjUgMi41IDAgMCAwIDAgNVoiLz48L3N2Zz4=');
  }

  // Force displaying the download icon as the link is not within a fr-download container
  .fr-download__link::after {
    mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBkPSJNMyAxOWgxOHYySDN2LTJabTEwLTUuODI4TDE5LjA3MSA3LjFsMS40MTQgMS40MTRMMTIgMTcgMy41MTUgOC41MTUgNC45MjkgNy4xIDExIDEzLjE3VjJoMnYxMS4xNzJaIi8+PC9zdmc+');
  }

  .fr-links-group .fr-link {
    margin: 0;
  }

  .fr-btns-group {
    flex-wrap: nowrap;

    &.fr-btns-group--inline .fr-btn {
      margin: 0;
    }
  }
</style>
