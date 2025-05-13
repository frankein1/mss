<template>
  <MssLayout>
    <template #skipLinks>
      <DsfrSkipLinks
        :links="[
          { id: 'main-content', text: 'Contenu principal' },
          { id: 'navigation', text: 'Menu' },
          { id: 'secondary-navigation', text: 'Menu secondaire' },
          { id: 'topbar', text: 'Configuration' }
        ]"
    /></template>
    <slot />
  </MssLayout>
</template>
