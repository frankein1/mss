<template>
  <form
    ref="form"
    novalidate
    @submit.prevent="onSubmit"
  >
    <VeeMultiSelect
      label="Type de document"
      :options="[
        { value: 'pdf', label: 'PDF' },
        { value: 'word', label: 'Word (.docx)' },
        { value: 'excel', label: 'Excel (.xlsx)' },
        { value: 'txt', label: 'Texte (.txt)' },
        { value: 'image', label: 'Image (.jpg, .png)' },
        { value: 'ppt', label: 'PowerPoint (.pptx)' },
        { value: 'csv', label: 'CSV' }
      ]"
      label-class="label-class"
      :required="true"
      name="documents"
      :dropdown="true"
      placeholder="Placeholder"
      :disabled="false"
      :readonly="false"
      :disabled-options="['txt']"
      hint="hint"
      :icons="{ pdf: 'icone' }"
    />

    <VeeMultiSelect
      label="Choix de pays"
      :options="[
        { value: 'fr', label: 'France' },
        { value: 'de', label: 'Allemagne' },
        { value: 'us', label: 'États-Unis' },
        { value: 'jp', label: 'Japon' },
        { value: 'br', label: 'Brésil' },
        { value: 'za', label: 'Afrique du Sud' }
      ]"
      label-class="label-class"
      :required="true"
      name="pays"
      :dropdown="false"
      placeholder="Liste de pays"
      :disabled="false"
      :readonly="false"
      :disabled-options="['jp']"
      hint="hint"
    />

    <button type="submit">Valider</button>
  </form>
</template>

<script setup lang="ts">
  import { useForm } from 'vee-validate'

  const form = ref<HTMLFormElement | null>(null)

  type InitialValue = { [key: string]: boolean }

  const { handleSubmit } = useForm<{ county: InitialValue[] }>({
    validationSchema: null,
    initialValues: {
      county: [{ '26': true }, { '93': true }]
    }
  })

  const { onSubmit } = useCatchFormErrors(handleSubmit, values => {
    console.log(values)
  })
</script>
