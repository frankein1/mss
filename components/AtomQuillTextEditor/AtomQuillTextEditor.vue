<script setup>
  import { QuillEditor } from '@vueup/vue-quill'
  import '@vueup/vue-quill/dist/vue-quill.snow.css'

  const toolbar = [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline'],
    ['image', 'code-block']
  ]

  const editorContent = ref('<p>Hello World!</p>')
  const contentHTML = ref('')

  function showContent() {
    contentHTML.value = editorContent.value
  }
</script>

<template>
  <div>
    <QuillEditor
      v-model:content="editorContent"
      theme="snow"
      :toolbar="toolbar"
      content-type="html"
    />
    <br />
    <button @click="showContent">Show Content</button>
    <br />
    <div
      id="content_container"
      class="ql-container ql-snow"
    >
      <div
        id="content"
        class="ql-editor"
        v-html="contentHTML"
      ></div>
    </div>
  </div>
</template>

<style>
  #content_container {
    border: none;
  }
</style>
