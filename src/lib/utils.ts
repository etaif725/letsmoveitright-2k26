type ClassValue = string | boolean | undefined | null | ClassValue[]

export function cn(...classes: ClassValue[]): string {
  return classes
    .flat()
    .filter((x): x is string => typeof x === 'string' && x.length > 0)
    .join(' ')
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return new Date(date).toLocaleDateString('en-US', options || defaultOptions)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + '...'
}

export function getImageUrl(path: string): string {
  if (path.startsWith('http')) return path
  return `/images/${path}`
}
