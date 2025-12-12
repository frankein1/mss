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
    </label>
    <div
      class="dropdown-zone"
      :class="{ 'is-dragover': isDragOver }"
      @dragover.prevent="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <p
        v-if="selectedFile"
        class="text--success fr-text--bold"
      >
        Document ajouté !
      </p>
      <p class="fr-mb-1v">
        Glissez-déposez un document, ou
        <button
          type="button"
          class=""
          :aria-describedby="ariaDescribedby"
          :aria-labelledby="labelledBy"
          @click="triggerFileInput"
        >
          {{ label }}</button
        >.
      </p>
      <p
        v-if="hint"
        class="fr-hint-text"
      >
        {{ hint }}
      </p>
    </div>
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

  // Drag n drop

  const isDragOver = ref(false)

  const onDragOver = (event: DragEvent) => {
    event.preventDefault()
    isDragOver.value = true
  }
  const onDragLeave = () => {
    isDragOver.value = false
  }

  const onDrop = (event: DragEvent) => {
    event.preventDefault()
    if (!event.dataTransfer?.files?.length) {
      return
    }
    const file = event.dataTransfer.files[0]
    if (!file) {
      return
    }
    selectedFile.value = file
    customFileName.value = file.name
    if (fileInput.value) {
      const dt = new DataTransfer()
      dt.items.add(file)
      fileInput.value.files = dt.files
    }
    setValue(file)
  }
</script>
<style lang="scss" scoped>
  .dropdown-zone {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3rem;
    background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='16' ry='16' stroke='%234550E5' stroke-width='2' stroke-dasharray='6%2c 6' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e");
    border-radius: 16px;
    margin-top: 1rem;

    &.is-dragover {
      background-color: rgb(69 80 229 / 5%);
    }

    p {
      text-align: center;
    }

    button {
      cursor: pointer;
      border: none;
      background: none;
      color: blue;
      padding: 0;
      display: inline-block;
    }
  }
</style>
