import RemoveAccents from 'remove-accents'

interface WeightedText {
  text: string
  weight: 'normal' | 'bold'
}

function toSearchFormat(input: string): string {
  return RemoveAccents.remove(input.toLowerCase())
}

export default function emphasizeSearch({
  input,
  searchString
}: {
  input: string
  searchString: string
}): WeightedText[] {
  const index = toSearchFormat(input).indexOf(toSearchFormat(searchString))
  if (index === -1 || searchString === '') {
    return [{ text: input, weight: 'normal' }]
  }

  const before = input.slice(0, index)
  const match = input.slice(index, index + searchString.length)
  const after = input.slice(index + searchString.length)
  const result: WeightedText[] = []
  if (before) {
    result.push({ text: before, weight: 'normal' })
  }
  result.push({ text: match, weight: 'bold' })
  if (after) {
    result.push({ text: after, weight: 'normal' })
  }

  return result
}
