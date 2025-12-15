<template>
  <div
    class="fr-input-group"
    :class="{
      'fr-input-group--error': error
    }"
  >
    <label
      v-if="!noLabel"
      class="fr-label"
      :for="id"
    >
      {{ label }}
      <span
        v-if="required"
        class="color-red"
        >*</span
      >
      <span
        v-if="hint"
        class="fr-hint-text"
      >
        {{ hint }}
      </span>
    </label>
    <button
      type="button"
      class="fr-btn fr-btn--secondary fr-btn--sm"
      :aria-describedby="ariaDescribedby"
      :aria-labelledby="labelledBy"
      @click="triggerFileInput"
    >
      {{ label }}
    </button>
    <span class="fr-ml-2v fr-text--sm">{{ selectedFile?.name }}</span>
    <input
      :id="id"
      ref="fileInput"
      :accept="accept"
      class="fr-upload fr-hidden"
      :class="{ 'fr-input--error': error }"
      :name="name"
      type="file"
      :aria-describedby="ariaDescribedby"
      :aria-labelledby="labelledBy"
      @change="onFileChange"
    />
  </div>

  <div
    class="fr-input-group"
    :class="{
      'fr-input-group--error': error
    }"
  >
    <label
      class="fr-label"
      for="file-name"
      >Renommer le document
    </label>
    <input
      id="file-name"
      v-model="customFileName"
      class="fr-input"
      type="text"
      :disabled="!selectedFile"
      @change="onNameChange"
    />
    <div
      :id="errorId"
      class="fr-messages-group"
      aria-live="polite"
    >
      <p
        v-if="error"
        class="fr-message fr-message--error"
      >
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useField } from 'vee-validate'

  const props = withDefaults(
    defineProps<{
      name: string
      accept?: string
      label: string
      hint?: string
      noLabel?: boolean
      labelledBy?: string
      required?: boolean
    }>(),
    {
      accept: '',
      hint: undefined,
      noLabel: false,
      labelledBy: undefined,
      required: false
    }
  )

  // use `toRef` to create reactive references to `name` prop which is passed to `useField`
  // this is important because vee-validte needs to know if the field name changes
  // https://vee-validate.logaretm.com/v4/guide/composition-api/caveats
  const name = toRef(() => props.name)
  const fileInput = ref<HTMLInputElement | null>(null)
  const selectedFile = ref<File | null>(null)
  const customFileName = ref('')
  const { errorMessage: error, setValue } = useField<File | null>(name)
  const { id, errorId } = useFormFieldId(name)

  const ariaDescribedby = computed(() =>
    error.value ? errorId.value : undefined
  )

  const onFileChange = (e: Event) => {
    const input = e.target as HTMLInputElement
    if (input.files && input.files[0]) {
      selectedFile.value = input.files[0]
      customFileName.value = selectedFile.value.name
      setValue(selectedFile.value)
    } else {
      selectedFile.value = null
      customFileName.value = ''
      setValue(null)
    }
  }

  const onNameChange = () => {
    if (!selectedFile.value) {
      return
    }
    const oldFile = selectedFile.value
    const fileName = customFileName.value.trim()

    if (!fileName) {
      setValue(null)
      selectedFile.value = null
      return
    }

    // Create a copy of the file
    const newFile = new File([oldFile], fileName, { type: oldFile.type })
    selectedFile.value = newFile

    // update file
    if (fileInput.value) {
      const dt = new DataTransfer()
      dt.items.add(newFile)
      fileInput.value.files = dt.files
    }
    setValue(newFile)
  }

  const triggerFileInput = () => {
    if (fileInput.value) {
      fileInput.value.click()
    }
  }
</script>
