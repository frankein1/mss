<template>
  <MssLayout>
    <template #skipLinks>
      <DsfrSkipLinks
        :links="[
          { id: 'main-content', text: 'Contenu principal' },
          { id: 'navigation', text: 'Menu principal' },
          {
            id: 'secondary-navigation',
            text: 'Menu de navigation du formulaire'
          },
          { id: 'topbar', text: 'Configuration' }
        ]"
    /></template>
    <slot />
  </MssLayout>
</template>
