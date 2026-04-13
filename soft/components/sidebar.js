import { createIcon } from '../assets/js/utils.js';
export function renderSidebar(route = '/admin/dashboard') {
  const items = [
    ['/admin/dashboard', 'Dashboard', 'layout-dashboard'],
    ['/admin/clients', 'Clientes', 'building-2'],
    ['/admin/devices', 'Devices', 'cpu'],
    ['/admin/notificaciones', 'Notificaciones', 'bell'],
    ['/admin/perfil', 'Mi perfil', 'user-circle-2'],
    ['/cliente/dashboard', 'Panel cliente', 'monitor-smartphone']
  ];
  return `
    <aside class="sidebar">
      <div class="sidebar-brand" data-action="toggle-sidebar" title="Colapsar menú">
        <div class="brand-mark">${createIcon('activity', 22)}</div>
        <div class="brand-copy">
          <strong>MedTuCIoT</strong>
          <span>Electrónica Gambino</span>
        </div>
      </div>
      <div class="sidebar-section-title">Principal</div>
      <nav class="sidebar-nav">
        ${items.map(([path, label, icon]) => `
          <a class="sidebar-link ${route === path ? 'active' : ''}" href="#${path}">
            ${createIcon(icon, 18)}
            <span class="sidebar-text">${label}</span>
            ${path === '/admin/notificaciones' ? '<span class="nav-badge">3</span>' : ''}
          </a>
        `).join('')}
      </nav>
    </aside>
  `;
}
