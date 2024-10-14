export const cleanEmptyParagraph = (
  rawText: string | undefined
): string | undefined => {
  if (!rawText) {
    return undefined
  }
  return rawText.replace(/\n+/g, '\n')
}
