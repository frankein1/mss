import { ofetch } from 'ofetch'
const BASE_URL = 'https://data.education.gouv.fr'

interface DataEducationSchools {
  total_count: number
  results: unknown[]
}

export async function fetchDataEducationSchools(
  apiKey: string | undefined,
  limit: number,
  offset: number,
  refine?: string[]
): Promise<DataEducationSchools> {
  const url = `${BASE_URL}/api/explore/v2.1/catalog/datasets/fr-en-annuaire-education/records`

  return ofetch<DataEducationSchools>(url, {
    query: {
      lang: 'fr',
      limit,
      offset,
      ...(refine?.length && { refine })
    },
    headers: {
      ...(apiKey && { Authorization: `Apikey ${apiKey}` }),
      Accept: 'application/json'
    }
  })
}
