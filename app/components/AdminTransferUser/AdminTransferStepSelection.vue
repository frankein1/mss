<template>
  <AtomAlert
    v-if="topLevelError"
    :alert-type="AlertType.Error"
    :message="topLevelError"
    class="fr-mb-2w"
  />
  <FormErrors
    v-if="errors.length > 1"
    :errors="errors"
  />

  <form
    ref="formRef"
    novalidate
    @submit.prevent="onSubmit"
  >
    <VeeStructureCombobox
      ref="structureRef"
      name="newStructureId"
      label="Structure de destination"
      required
      :exclude-structure-id="user.currentStructureId"
      :initial-selection="selectedStructure"
      @select="onStructureSelected"
      @clear="onStructureCleared"
    />

    <VeeSelect
      name="newRole"
      label="Nouveau rôle"
      :options="withEmptyValue(nonAdminUserRoleKeys.options)"
      required
    />

    <div
      v-if="selectedStructureLocal && newRoleLabel"
      class="fr-alert fr-alert--warning fr-alert--sm fr-my-2w"
    >
      <dl class="admin-transfer-user-form__preview">
        <div>
          <dt>Utilisateur</dt>
          <dd data-testid="preview-user">{{ user.displayName }}</dd>
        </div>
        <div>
          <dt>Structure actuelle</dt>
          <dd data-testid="preview-from-structure">
            {{ user.currentStructureName }}
          </dd>
        </div>
        <div>
          <dt>Structure de destination</dt>
          <dd data-testid="preview-to-structure">
            {{ selectedStructureLocal.name }}
          </dd>
        </div>
        <div>
          <dt>Nouveau rôle</dt>
          <dd data-testid="preview-new-role">{{ newRoleLabel }}</dd>
        </div>
      </dl>
    </div>

    <VeeCheckbox
      class="fr-mb-2w"
      :disabled="!Boolean(selectedStructureLocal) || !Boolean(newRoleLabel)"
      name="ackChecked"
      label="J'ai bien pris connaissance des détails du transfert."
    />

    <hr />
    <p>
      Vous allez recevoir un code de confirmation unique sur votre adresse email
      <span class="fr-text--bold">{{ user?.email }}</span
      >. Ne fermez pas cette fenêtre.
    </p>

    <DsfrButtonGroup
      inline-layout-when="always"
      align="right"
    >
      <li>
        <DsfrButton
          label="Annuler"
          type="button"
          secondary
          @click="emit('cancelled')"
        />
      </li>
      <li>
        <DsfrButton
          label="Recevoir le code"
          type="submit"
          :disabled="sendingCode"
          data-testid="transfer-form-next"
        />
      </li>
    </DsfrButtonGroup>
  </form>
</template>

<script setup lang="ts">
  import { z } from 'zod'
  import type { StructureOption } from '~/components/VeeForm/types'
  import type { UserRole } from '@prisma/client'
  import { nonAdminUserRoleKeys } from '~~/client/options'
  import {
    nonAdminUserRoleSchema,
    requiredUuid
  } from '~~/server/schema/helpers.schema'
  import { AlertType } from '~/utils/constants/alert'

  defineProps<{
    user: {
      id: string
      displayName: string
      email: string
      currentStructureId: string
      currentStructureName: string
    }
  }>()

  const emit = defineEmits<{
    cancelled: []
    next: []
  }>()

  const formRef = useTemplateRef('formRef')
  const { selectedStructure, newRole } = useTransferUserState()
  const selectedStructureLocal = ref<StructureOption | null>(
    selectedStructure.value
  )

  const selectionSchema = z.object({
    newStructureId: requiredUuid,
    newRole: nonAdminUserRoleSchema,
    ackChecked: z.literal(true, {
      errorMap: () => ({
        message:
          'Veuillez confirmer la prise en compte des détails du transfert.'
      })
    })
  })

  type SelectionFormValues = {
    newStructureId: string
    newRole: UserRole | ''
    ackChecked: boolean
  }

  const { handleSubmit } = useForm<SelectionFormValues>({
    validationSchema: toTypedSchema(selectionSchema),
    initialValues: {
      newStructureId: selectedStructure.value?.id ?? '',
      newRole: newRole.value,
      ackChecked: false
    }
  })

  const sendingCode = ref(false)
  const topLevelError = ref('')
  const trpcClient = useTrpcClient()

  const newRoleValue = useFieldValue<string>('newRole')
  const newRoleLabel = computed(() =>
    newRoleValue.value
      ? (nonAdminUserRoleKeys.value(newRoleValue.value) ?? '')
      : ''
  )

  function onStructureSelected(structure: StructureOption) {
    selectedStructureLocal.value = structure
  }

  function onStructureCleared() {
    selectedStructureLocal.value = null
  }

  const { onSubmit, caughtErrors } = useCatchFormErrors(
    handleSubmit,
    async values => {
      sendingCode.value = true
      topLevelError.value = ''

      updateStepperValues(values)
      await generateAuthorizationCode()
    }
  )

  function updateStepperValues(values: SelectionFormValues) {
    selectedStructure.value = selectedStructureLocal.value
    newRole.value = values.newRole
  }

  async function generateAuthorizationCode() {
    try {
      await trpcClient.admin.authorizeUserTransfer.mutate()
      emit('next')
    } catch {
      topLevelError.value =
        "La génération du code d'autorisation a échoué. Si vous avez effectué beaucoup d'appels à l'export, veuillez attendre une ou deux minutes."
    } finally {
      sendingCode.value = false
    }
  }

  const { errors } = useDisplayFormErrors(formRef, caughtErrors, {
    newStructureId: 'Structure de destination',
    newRole: 'Nouveau rôle',
    ackChecked: 'Confirmation'
  })
</script>

<style scoped lang="scss">
  .admin-transfer-user-form__preview {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 0.5rem 1.5rem;

    dt {
      font-weight: 600;
    }

    dd {
      margin: 0;
    }

    div {
      display: contents;
    }
  }
</style>
