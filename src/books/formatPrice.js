const clpFormatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
});

export function formatPrice(price) {
  return clpFormatter.format(price).replace(/\s/g, '');
}
