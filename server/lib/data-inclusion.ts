import { ofetch } from 'ofetch'

interface DataInclusionPage {
  items: unknown[]
  total: number
  page: number
  size: number
  pages: number
}

export async function fetchStructuresPages(
  apiUrl: string,
  apiToken: string,
  currentPage: number,
  pageSize = 5000
): Promise<DataInclusionPage> {
  const url = `${apiUrl}/api/v1/structures?page=${currentPage}&size=${pageSize}&exclure_doublons=true`

  const data = await ofetch<DataInclusionPage>(url, {
    headers: {
      Authorization: `Bearer ${apiToken}`,
      Accept: 'application/json'
    }
  })

  return data
}
