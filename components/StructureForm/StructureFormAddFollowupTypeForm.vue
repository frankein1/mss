<template>
  <form
    ref="form"
    novalidate
    class="fr-container--fluid"
    @submit.prevent="onCreateFollowupType"
  >
    <div
      class="fr-grid-row fr-grid-row--gutters form-grid follow-up-type-form-row"
    >
      <VeeInput
        name="name"
        :label="followupTypeFieldLabels.name + ' de la nouvelle aide'"
        required
      />

      <div class="fr-col-3">
        <button
          class="fr-btn fr-btn--sm"
          type="submit"
        >
          Ajouter
        </button>
      </div>
    </div>
  </form>
</template>

<script lang="ts" setup>
  import type { CreateCustomFollowupTypeInput } from '~/server/schema'
  import { createCustomFollowupTypeSchema } from '~/server/schema'
  import { followupTypeFieldLabels } from '~/client/labels'
  import {
    defaultLegallyNotRequiredFollowupTypeLabels,
    defaultLegallyRequiredFollowupTypeLabels
  } from '~/client/options/followupType'

  const props = defineProps<{
    structureId: string
    adminView: boolean
  }>()

  const emit = defineEmits<{
    createFollowupType: [followupTypeName: string]
  }>()

  const trpcClient = useTrpcClient()

  const form = ref<HTMLFormElement | null>(null)

  const { handleSubmit, setErrors } = useForm<CreateCustomFollowupTypeInput>({
    validationSchema: toTypedSchema(createCustomFollowupTypeSchema)
  })

  const onCreateFollowupType = handleSubmit(async ({ name }) => {
    const exists = await followupTypeExists(name)
    if (exists) {
      setErrors({ name: 'Cette aide existe déjà!' })
    } else {
      emit('createFollowupType', name)
      form.value?.reset()
    }
  })

  async function followupTypeExists(name: string) {
    const cleanName = name.toLocaleLowerCase()

    let data
    const requiredTypeNames = Object.values(
      defaultLegallyRequiredFollowupTypeLabels
    ).map(name => name.toLocaleLowerCase())

    if (requiredTypeNames.includes(cleanName)) {
      return true
    }

    const optionalTypeNames = Object.values(
      defaultLegallyNotRequiredFollowupTypeLabels
    ).map(name => name.toLocaleLowerCase())
    if (optionalTypeNames.includes(cleanName)) {
      return true
    }

    if (props.adminView) {
      data = await trpcClient.admin.getFollowupType.query({
        structureId: props.structureId,
        name
      })
    } else {
      data = await trpcClient.structure.getFollowupType.query({
        structureId: props.structureId,
        name
      })
    }
    return !!data
  }
</script>

<style scoped>
  .follow-up-type-form-row {
    align-items: center;
  }
</style>
