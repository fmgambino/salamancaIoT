export function qs(selector, scope = document) { return scope.querySelector(selector); }
export function qsa(selector, scope = document) { return Array.from(scope.querySelectorAll(selector)); }
export function initials(name = '') { return name.split(' ').filter(Boolean).slice(0, 2).map(v => v[0]?.toUpperCase() || '').join('') || 'U'; }
export function formatDate(date) { return new Date(date).toLocaleString('es-AR'); }
export function createIcon(name, size = 18) { return `<i data-lucide="${name}" style="width:${size}px;height:${size}px"></i>`; }
export function badgeClass(status) {
  const value = String(status).toLowerCase();
  if (['active','online','óptimo','normal'].includes(value)) return 'success';
  if (['warning','pending_payment','baja'].includes(value)) return 'warning';
  if (['offline','expired','error'].includes(value)) return 'danger';
  return 'info';
}
