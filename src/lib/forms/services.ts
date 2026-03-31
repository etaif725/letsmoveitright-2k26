export const BLUE_MOON_SERVICE_OPTIONS = [
  'RV Generator Repair',
  'RV AC & Heating',
  'Electrical Systems',
  'Slide-Out Systems',
  'Plumbing & Water',
  'Collision & Insurance',
] as const

export function getMultiSelectValues(select: HTMLSelectElement): string[] {
  return Array.from(select.selectedOptions).map((option) => option.value)
}
