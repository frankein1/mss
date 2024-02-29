<template>
  <div class="fr-container">
    <div class="fr-col-12 fr-pb-2w fr-text--bold">Accompagnements</div>
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
