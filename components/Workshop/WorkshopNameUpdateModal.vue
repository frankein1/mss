<template>
  <form @submit.prevent="submit">
    <VeeInput
      name="name"
      required
      label="Nom de l'atelier / thématique (obligatoire)"
    />

    <DsfrButtonGroup
      inline-layout-when="always"
      align="right"
    >
      <li>
        <DsfrButton
          label="Annuler"
          type="button"
          secondary
          @click="modal.close"
        ></DsfrButton>
      </li>

      <li>
        <DsfrButton
          label="Enregistrer les modifications"
          type="submit"
          :submitting="isSubmitting"
          :readonly="isSubmitting"
        ></DsfrButton>
      </li>
    </DsfrButtonGroup>
  </form>
</template>

<script setup lang="ts">
  import z from 'zod'
  import { requiredLimitedStringConstraint } from '~/server/schema'

  const modal = useModal()

  interface NameUpdateInput {
    name: string
  }

  const { isSubmitting, onUpdate, initialValues } = defineProps<{
    isSubmitting: boolean
    initialValues: NameUpdateInput
    onUpdate: (values: NameUpdateInput) => void
  }>()

  const { handleSubmit } = useForm<NameUpdateInput>({
    validationSchema: toTypedSchema(
      z.object({
        name: requiredLimitedStringConstraint(300)
      })
    ),
    initialValues
  })

  const submit = handleSubmit(onUpdate)
</script>
