import RemoveAccents from 'remove-accents'
import { inferProcedureOutput } from '@trpc/server'
import { AppRouter } from '~/server/trpc/routers'
import { ArrayElement } from '~/types/utils'

type BeneficiarySearchResult = ArrayElement<
  inferProcedureOutput<AppRouter['beneficiary']['search']>
>

function toSearchFormat(input: string): string {
  return RemoveAccents.remove(input.toLowerCase())
}

function getMatchScore({
  input,
  searchResult
}: {
  input: string
  searchResult: BeneficiarySearchResult
}) {
  const [
    usualNameNormalized,
    birthNameNormalized,
    firstNameNormalized,
    inputNormalized
  ] = [
    searchResult.usualName ?? '',
    searchResult.birthName ?? '',
    searchResult.firstName ?? '',
    input
  ].map(toSearchFormat)
  if (usualNameNormalized.includes(inputNormalized)) {
    return 3
  }
  if (birthNameNormalized.includes(inputNormalized)) {
    return 2
  }
  if (firstNameNormalized.includes(inputNormalized)) {
    return 1
  }
  return 0
}

export default function sortBeneficiarySearchResults(input: string) {
  return function sortResults(
    a: BeneficiarySearchResult,
    b: BeneficiarySearchResult
  ) {
    const scoreDiff =
      getMatchScore({ input, searchResult: b }) -
      getMatchScore({ input, searchResult: a })

    if (scoreDiff !== 0) {
      return scoreDiff
    }

    return (a.usualName ?? a.birthName ?? '').toLowerCase() <
      (b.usualName ?? b.birthName ?? '')
      ? -1
      : 1
  }
}
