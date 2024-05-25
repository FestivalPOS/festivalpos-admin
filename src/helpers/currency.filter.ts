export function currency(value) {
  if (!value) return ''
  return new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF' }).format(value)
}
