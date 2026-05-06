<template>
  <form
    novalidate
    @submit.prevent="onSubmit"
  >
    <p class="fr-text--bold">
      Avez-vous bien formaté votre document avant de l'importer ?
    </p>

    <div class="fr-input-group fr-mb-3w">
      <label
        class="fr-label"
        for="letter-template-name"
      >
        Nom du document <span class="fr-hint-text">Obligatoire</span>
      </label>
      <input
        id="letter-template-name"
        v-model="name"
        class="fr-input"
        type="text"
        required
        maxlength="200"
        :aria-describedby="nameError ? 'letter-template-name-error' : undefined"
        :aria-invalid="nameError ? true : undefined"
      />
      <p
        v-if="nameError"
        id="letter-template-name-error"
        class="fr-error-text"
      >
        {{ nameError }}
      </p>
    </div>

    <div class="fr-upload-group fr-mb-3w">
      <label
        class="fr-label"
        for="letter-template-file"
      >
        Ajouter un fichier
        <span class="fr-hint-text">
          Taille maximale : 20 Mo. Formats supportés : .docx. Un seul fichier
          possible.
        </span>
      </label>
      <input
        id="letter-template-file"
        ref="fileInput"
        class="fr-upload"
        type="file"
        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        @change="onFileChange"
      />
      <p
        v-if="fileError"
        class="fr-error-text"
      >
        {{ fileError }}
      </p>
    </div>

    <AtomAlert
      v-if="uploadError"
      :alert-type="AlertType.Error"
      :message="uploadError"
      class="fr-mb-2w"
    />

    <ul
      class="fr-btns-group fr-btns-group--inline-md fr-btns-group--right fr-mt-2w"
    >
      <li>
        <button
          class="fr-btn fr-btn--secondary fr-mb-0"
          type="button"
          :disabled="isSubmitting"
          @click="modal.close()"
        >
          Annuler
        </button>
      </li>
      <li>
        <button
          class="fr-btn fr-mb-0"
          type="submit"
          :disabled="isSubmitting"
          :data-submitting="isSubmitting"
        >
          Confirmer
        </button>
      </li>
    </ul>
  </form>
</template>

<script setup lang="ts">
  import { AlertType } from '~/utils/constants/alert'

  const props = defineProps<{ onSuccess: () => void }>()

  const modal = useModal()
  const name = ref('')
  const selectedFile = ref<File | null>(null)
  const nameError = ref('')
  const fileError = ref('')
  const uploadError = ref('')
  const isSubmitting = ref(false)
  const fileInput = ref<HTMLInputElement | null>(null)

  function onFileChange(e: Event) {
    const input = e.target as HTMLInputElement
    selectedFile.value = input.files?.[0] ?? null
    fileError.value = ''
  }

  async function onSubmit() {
    nameError.value = ''
    fileError.value = ''
    uploadError.value = ''

    if (!name.value.trim()) {
      nameError.value = 'Le nom du document est requis'
      return
    }
    if (!selectedFile.value) {
      fileError.value = 'Veuillez sélectionner un fichier .docx'
      return
    }

    isSubmitting.value = true
    try {
      const formData = new FormData()
      formData.append('name', name.value.trim())
      formData.append('file', selectedFile.value)

      const res = await $fetch('/api/letter-template/upload', {
        method: 'POST',
        body: formData
      })

      if (res) {
        modal.close()
        props.onSuccess()
      }
    } catch (e: any) {
      uploadError.value =
        e?.data?.message || "L'import du document a échoué. Veuillez réessayer."
    } finally {
      isSubmitting.value = false
    }
  }
</script>
