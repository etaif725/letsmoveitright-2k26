export function getTextBlocks(text: string): string[] {
  const normalized = text.replace(/\r\n/g, '\n').trim()

  if (!normalized) return []

  if (normalized.includes('\n')) {
    return normalized
      .split(/\n{2,}|\n/)
      .map((block) => block.trim())
      .filter(Boolean)
  }

  if (normalized.length > 220) {
    return normalized
      .split(/(?<=[.!?])\s+(?=[A-Z0-9"'])/)
      .map((block) => block.trim())
      .filter(Boolean)
  }

  return [normalized]
}

export function plainTextToParagraphHtml(text: string): string {
  return getTextBlocks(text)
    .map((block) => `<p>${block}</p>`)
    .join('')
}
