import { dataInclusionStructures } from './mocked-structures'

export function downloadStructures() {
  return {
    data: dataInclusionStructures,
    headers: new Headers({ location: 'https://' }),
    error: null
  }
}
