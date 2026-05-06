import { breadcrumbs as user } from './user'
import { routes } from '~/utils/routes'

const r = routes.structure
type Routes = typeof r

function getBread<
  T extends
    | 'AppStructureEdit'
    | 'AppStructureSubjects'
    | 'AppStructure'
    | 'AppPartners'
    | 'AppStructureUserAdd'
    | 'AppStructureLetterTemplates'
>(name: T) {
  const title = r[name].title as Routes[T]['title']
  return [{ text: title, to: r[name].path() }]
}

export const breadcrumbs = {
  AppPartners: () => [...user.AppOverview(), ...getBread('AppPartners')],
  AppStructure: () => [...user.AppOverview(), ...getBread('AppStructure')],
  AppStructureEdit: () => [
    ...user.AppOverview(),
    ...getBread('AppStructureEdit')
  ],
  AppStructureSubjects: () => [
    ...user.AppOverview(),
    ...getBread('AppStructureSubjects')
  ],
  AppStructureUserEdit: (userName: string) => [
    ...user.AppOverview(),
    ...getBread('AppStructure'),
    ...getBreadStructureUserEdit(userName)
  ],
  AppStructureUserDelete: (userName: string) => [
    ...user.AppOverview(),
    ...getBread('AppStructure'),
    ...getBreadStructureUserEdit(userName)
  ],
  AppStructureUserAdd: () => [
    ...user.AppOverview(),
    ...getBread('AppStructure'),
    ...getBread('AppStructureUserAdd')
  ],
  AppStructureLetterTemplates: () => [
    ...user.AppOverview(),
    ...getBread('AppStructure'),
    ...getBread('AppStructureLetterTemplates')
  ]
}

const getBreadStructureUserEdit = (userName: string) => {
  return [
    {
      text: r.AppStructureUserEdit.title(userName),
      to: r.AppStructureUserEdit.path(userName)
    }
  ]
}
