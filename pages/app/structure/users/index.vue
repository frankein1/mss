<template>
  <StructureUsers />
</template>

<script lang="ts" setup>
  import { routes } from '~/utils/routes'

  const { application } = usePermissions()

  if (!application.value.module.users) {
    await navigateTo(routes.structure.AppStructureInfo.path(), {
      replace: true
    })
  }
</script>
