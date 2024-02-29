<template>
  <form
    ref="form"
    novalidate
    class="fr-container--fluid"
    @submit.prevent="onCreateSocialSupportSubject"
  >
    <div
      class="fr-grid-row fr-grid-row--gutters form-grid social-support-subject-form-row"
    >
      <VeeInput
        name="name"
        :label="socialSupportSubjectFieldLabels.name + ' de la nouvelle aide'"
        required
      />

      <div class="fr-col-3">
        <button
          class="fr-btn fr-btn--sm"
          type="submit"
        >
          Ajouter</button
        >f
      </div>
    </div>
  </form>
</template>

<script lang="ts" setup>
  import type { CreateCustomSocialSupportSubjectInput } from '~/server/schema'
  import { createCustomSocialSupportSubjectSchema } from '~/server/schema'
  import { socialSupportSubjectFieldLabels } from '~/client/labels'
  import {
    defaultLegallyNotRequiredSocialSupportSubjectLabels,
    defaultLegallyRequiredSocialSupportSubjectLabels
  } from '~/client/options'

  const props = defineProps<{
    structureId: string
    adminView: boolean
  }>()

  const emit = defineEmits<{
    createSocialSupportSubject: [socialSupportSubjectName: string]
  }>()

  const trpcClient = useTrpcClient()

  const form = ref<HTMLFormElement | null>(null)

  const { handleSubmit, setErrors } =
    useForm<CreateCustomSocialSupportSubjectInput>({
      validationSchema: toTypedSchema(createCustomSocialSupportSubjectSchema)
    })

  const onCreateSocialSupportSubject = handleSubmit(async ({ name }) => {
    const exists = await socialSupportSubjectExists(name)
    if (exists) {
      setErrors({ name: 'Cette aide existe déjà !' })
    } else {
      emit('createSocialSupportSubject', name)
      form.value?.reset()
    }
  })

  async function socialSupportSubjectExists(name: string) {
    const cleanName = name.toLocaleLowerCase()

    const requiredObjectNames = Object.values(
      defaultLegallyRequiredSocialSupportSubjectLabels
    ).map(name => name.toLocaleLowerCase())

    if (requiredObjectNames.includes(cleanName)) {
      return true
    }

    const optionalObjectNames = Object.values(
      defaultLegallyNotRequiredSocialSupportSubjectLabels
    ).map(name => name.toLocaleLowerCase())
    if (optionalObjectNames.includes(cleanName)) {
      return true
    }

    if (props.adminView) {
      return !!(await trpcClient.admin.getSocialSupportSubject.query({
        structureId: props.structureId,
        name
      }))
    }

    return !!(await trpcClient.structure.getSocialSupportSubject.query({
      structureId: props.structureId,
      name
    }))
  }
</script>

<style scoped>
  .social-support-subject-form-row {
    align-items: center;
  }
</style>
