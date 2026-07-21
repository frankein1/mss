<template>
  <div />
</template>

<script lang="ts" setup>
  import { routes } from '~/utils/routes'

  const { application } = usePermissions()

  await navigateTo(
    application.value.module.users
      ? routes.structure.AppStructureUsers.path()
      : routes.structure.AppStructureInfo.path(),
    { replace: true }
  )
</script>
