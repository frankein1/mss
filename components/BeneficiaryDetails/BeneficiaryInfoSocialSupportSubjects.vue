<template>
  <div class="fr-container">
    <div class="fr-col-12">
      <h5 class="fr-text--md">Accompagnements</h5>
    </div>
    <ul class="fr-tags-group">
      <li
        v-for="subject in socialSupportSubjects"
        :key="subject.id"
      >
        <p class="fr-tag">
          {{ subject.name }}
        </p>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import type { SocialSupportSubjectIdAndName } from '~/types/socialSupportSubject'

  defineProps<{
    socialSupportSubjects: SocialSupportSubjectIdAndName[]
  }>()
</script>
