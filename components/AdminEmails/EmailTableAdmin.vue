<template>
  <div
    v-if="emails?.length"
    ref="tableContainer"
    class="table-container fr-mt-3w"
    tabindex="0"
  >
    <div
      class="fr-table fr-table--bordered fr-table--no-caption fr-mb-0 fr-pt-0"
    >
      <table>
        <caption>
          Liste des emails
        </caption>
        <thead>
          <tr>
            <th scope="col">Destinataire</th>
            <th scope="col">Objet</th>
            <th scope="col">Statut</th>
            <TableSortableHeader
              :sort="sort.sentDate"
              label="Date d'envoi"
              @update:sort="emit('update:sort', { sentDate: $event })"
            />
            <th scope="col">Nombre d'essais</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="email in emails"
            :key="email.id"
          >
            <td>{{ email.to }}</td>
            <td>{{ email.subject }}</td>
            <td>
              <span
                class="fr-badge"
                :class="[emailStatusBadgeClasses[email.status]]"
                >{{ EmailStatusLabels[email.status] }}</span
              >
            </td>
            <td>{{ formatDate(email.sentDate, 'DD/MM/YYYY HH:mm') }}</td>
            <td>{{ email.retryNumber }}</td>
            <td>
              <ul class="fr-btns-group fr-btns-group--icon-left">
                <li>
                  <button
                    class="fr-btn fr-btn--secondary fr-icon-send-plane-line"
                    :disabled="
                      email.status === EmailStatus.Sending ||
                      email.status === EmailStatus.ToSend
                    "
                    @click="onSend(email.id)"
                  >
                    Renvoyer
                  </button>
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { EmailStatus } from '@prisma/client'
  import { Emails } from './types'
  import { EmailStatusLabels } from '~/client/options'
  import type { EmailAdminSort } from '~/types/table'
  import { emailStatusBadgeClasses } from '~/client/classes/email'

  const snackbar = useSnackbar()
  const trpcClient = useTrpcClient()

  const props = defineProps<{
    emails: Emails
    pending: boolean
    sort: EmailAdminSort
  }>()

  const emit = defineEmits<{
    'update:sort': [sort: EmailAdminSort]
    'refreshEmails': []
  }>()

  const { tableContainer } = useTable(toRef(() => props.pending))

  function onSend(id: string) {
    useTrpcMutation({
      mutation: () =>
        trpcClient.admin.sendEmail.mutate({
          id
        }),
      onSuccess: () => {
        snackbar.success('Email en cours de renvoi.')
        emit('refreshEmails')
      },
      onFailure: () => {
        snackbar.error("Le renvoi de l'email a échoué.")
      }
    })
  }
</script>
