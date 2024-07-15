const AdminRoute = '/admin'

export const routes = {
  Admin: {
    name: 'Admin',
    title: "Mon espace d'administration",
    path: () => `${AdminRoute}`
  },
  AdminOverview: {
    name: 'AdminOverview',
    title: 'Tableau de bord',
    path: () => `${AdminRoute}/overview`
  },
  AdminLogin: {
    name: 'AdminLogin',
    title: '',
    path: () => ''
  },
  AdminStructures: {
    name: 'AdminStructures',
    title: '',
    path: () => `${AdminRoute}/structures`
  },
  AdminStructure: {
    name: 'AdminStructure',
    title: '',
    path: (structureId: string) => `${AdminRoute}/structures/${structureId}`
  },
  AdminStructureSubjects: {
    name: 'AdminStructureSubjects',
    title: '',
    path: () => ''
  },
  AdminUsers: {
    name: 'AdminUsers',
    title: '',
    path: () => `${AdminRoute}/users`
  },
  AdminUsersAdd: {
    name: 'AdminUsersAdd',
    title: '',
    path: () => `${AdminRoute}/users/add`
  },
  AdminUser: {
    name: 'AdminUser',
    title: '',
    path: (userId: string) => `${AdminRoute}/users/${userId}`
  },
  AdminEmails: {
    name: 'AdminEmails',
    title: '',
    path: () => `${AdminRoute}/emails`
  },
  AdminIntegrations: {
    name: 'AdminIntegrations',
    title: '',
    path: () => `${AdminRoute}/integrations`
  }
} as const
