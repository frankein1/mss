<template>
  <p class="fr-text--sm">
    Un code de confirmation vient de vous être envoyé par email. Saisissez-le
    ci-dessous pour finaliser le transfert. Le code est valable 10 minutes.
  </p>
  <AtomAlert
    v-if="topLevelError"
    :alert-type="AlertType.Error"
    :message="topLevelError"
    class="fr-mb-2w"
  />

  <form
    ref="formRef"
    novalidate
    @submit.prevent="onSubmit"
  >
    <VeeInput
      name="confirmationCode"
      label="Code de confirmation"
      required
    />

    <DsfrButtonGroup
      inline-layout-when="always"
      align="right"
    >
      <li>
        <DsfrButton
          label="Retour"
          type="button"
          secondary
          @click="emit('previous')"
        />
      </li>
      <li>
        <DsfrButton
          label="Confirmer le transfert"
          type="submit"
          :disabled="submitting"
          data-testid="transfer-code-submit"
        />
      </li>
    </DsfrButtonGroup>
  </form>
</template>

<script setup lang="ts">
  import { z } from 'zod'
  import type { UserRole } from '@prisma/client'
  import { AlertType } from '~/utils/constants/alert'
  import { isTRPCClientError } from '~/utils/error'
  import { validationCodeConstraint } from '~~/server/schema'

  const props = defineProps<{
    user: {
      id: string
    }
  }>()

  const emit = defineEmits<{
    previous: []
    transferred: []
  }>()

  const codeSchema = z.object({ confirmationCode: validationCodeConstraint })

  const { handleSubmit } = useForm<{ confirmationCode: string }>({
    validationSchema: toTypedSchema(codeSchema)
    // initialValues: { confirmationCode: '' }
  })

  const formRef = useTemplateRef('formRef')
  const { selectedStructure, newRole } = useTransferUserState()
  const submitting = ref(false)
  const topLevelError = ref('')
  const trpcClient = useTrpcClient()

  const TRANSFER_ERROR_RULES: { regex: RegExp; message: string }[] = [
    {
      regex: /Invalid code/,
      message: 'Le code de confirmation est invalide ou a expiré.'
    },
    {
      regex: /Cannot transfer an Administrator/,
      message: "Le transfert d'un administrateur est impossible."
    },
    {
      regex: /Cannot transfer a disabled user/,
      message: "Le transfert d'un utilisateur désactivé est impossible."
    },
    {
      regex: /Cannot transfer a user with no structure/,
      message: "Le transfert d'un utilisateur sans structure est impossible."
    },
    {
      regex: /Cannot transfer a user from a disabled structure/,
      message: 'Le transfert depuis une structure désactivée est impossible.'
    },
    {
      regex: /Cannot transfer a user to a disabled structure/,
      message: 'Le transfert vers une structure désactivée est impossible.'
    },
    {
      regex: /Cannot transfer the last structure manager of a structure/,
      message:
        'Le transfert du dernier gestionnaire de structure est impossible.'
    },
    {
      regex: /User already belongs to structure/,
      message:
        'Cet utilisateur est déjà rattaché à la structure de destination.'
    }
  ]

  function resolveTransferError(err: unknown): string {
    if (!isTRPCClientError(err)) {
      return 'Une erreur est survenue lors du transfert.'
    }

    const referentMatch = err.message.match(
      /still referent on (\d+) family file\(s\)/
    )
    if (referentMatch) {
      return `Impossible de transférer un utilisateur encore référent de ${referentMatch[1]} dossier(s) foyer(s). Utilisez d'abord l'outil de transfert de référents.`
    }

    for (const { regex, message } of TRANSFER_ERROR_RULES) {
      if (regex.test(err.message)) {
        return message
      }
    }

    return 'La demande de transfert a été refusée.'
  }

  const { onSubmit } = useCatchFormErrors(handleSubmit, async values => {
    submitting.value = true
    topLevelError.value = ''
    try {
      await trpcClient.admin.transferUser.mutate({
        userId: props.user.id,
        newStructureId: selectedStructure.value!.id,
        newRole: newRole.value as UserRole,
        confirmationCode: values.confirmationCode
      })
      emit('transferred')
    } catch (err) {
      topLevelError.value = resolveTransferError(err)
    } finally {
      submitting.value = false
    }
  })
</script>
