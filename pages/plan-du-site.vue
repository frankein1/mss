<template>
  <div class="landing-main-container fr-container fr-mt-5w">
    <h1>{{ routes.siteMap.title }}</h1>

    <ul>
      <li
        v-for="item in siteMapItems"
        :key="item.to"
      >
        <NuxtLink :to="item.to">
          {{ item.label }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { routes } from '~/utils/routes'

  const authState = useAuthState()
  const { application } = usePermissions()

  useHead({
    title: routes.siteMap.title
  })

  definePageMeta({
    layout: 'landing'
  })

  const siteMapItems = computed(() => {
    const items = []
    const isManager = authState.isStructureManager()
    if (authState.isAdmin()) {
      // Admin only
      items.push({
        to: routes.admin.AdminOverview.path(),
        label: routes.admin.AdminOverview.title
      })
      items.push({
        to: routes.admin.AdminStructures.path(),
        label: routes.admin.AdminStructures.title
      })
      items.push({
        to: routes.admin.AdminUsers.path(),
        label: routes.admin.AdminUsers.title
      })
      items.push({
        to: routes.admin.AdminUsersAdd.path(),
        label: routes.admin.AdminUsersAdd.title
      })
      items.push({
        to: routes.admin.AdminEmails.path(),
        label: routes.admin.AdminEmails.title
      })
      items.push({
        to: routes.admin.AdminIntegrations.path(),
        label: routes.admin.AdminIntegrations.title
      })
    } else {
      // Non-admin only
      items.push({
        to: routes.user.AppOverview.path(),
        label: routes.user.AppOverview.title
      })
      items.push({
        to: routes.beneficiary.AppBeneficiaries.path(),
        label: routes.beneficiary.AppBeneficiaries.title
      })
      items.push({
        to: routes.beneficiary.AppBeneficiariesAdd.path(),
        label: routes.beneficiary.AppBeneficiariesAdd.title
      })
      items.push({
        to: routes.file.AppHistory.path(),
        label: routes.file.AppHistory.title
      })
      if (application.value.module.stats) {
        items.push({
          to: routes.stats.AppStats.path(),
          label: routes.stats.AppStats.title
        })
      }
      items.push({
        to: routes.structure.AppPartners.path(),
        label: routes.structure.AppPartners.title
      })
      items.push({
        to: routes.structure.AppStructure.path(),
        label: routes.structure.AppStructure.title
      })
      if (application.value.module.users) {
        items.push({
          to: routes.structure.AppUsers.path(),
          label: routes.structure.AppUsers.title
        })
        items.push({
          to: routes.structure.AppStructureSubjects.path(),
          label: routes.structure.AppStructureSubjects.title
        })
      }
      if (isManager) {
        items.push({
          to: routes.cgu.CGUManager.path(),
          label: routes.cgu.CGUManager.title
        })
      } else {
        items.push({
          to: routes.cgu.CGUUser.path(),
          label: routes.cgu.CGUUser.title
        })
      }
    }
    // All users
    items.push({
      to: routes.landing.PolitiqueConfidentialite.path(),
      label: routes.landing.PolitiqueConfidentialite.title
    })

    return items
  })
</script>
