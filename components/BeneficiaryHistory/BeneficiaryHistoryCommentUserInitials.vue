<template>
  <div class="user-initials">{{ userInitials }}</div>
</template>

<script setup lang="ts">
  import { User } from '@prisma/client'

  const props = defineProps<{
    user: Pick<User, 'firstName' | 'lastName'>
  }>()

  const userInitials = computed(() =>
    `${props.user.firstName[0]}${props.user.lastName[0]}`.toUpperCase()
  )
</script>

<style>
  .user-initials {
    padding: 0.25rem 0.5rem;
    width: fit-content;
    height: 2rem;
    background-color: var(--primary);
    color: #fff;
    border-radius: 0.25rem;
  }
</style>
