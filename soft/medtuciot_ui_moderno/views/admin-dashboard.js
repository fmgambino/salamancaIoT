import { renderAppLayout } from './layout.js';
import { state } from '../assets/js/state.js';
import { createIcon } from '../assets/js/utils.js';
import { statusBadge } from '../components/badges.js';
export async function renderAdminDashboardView() {
  const statCards = [
    ['Clientes activos', state.summary.totalClients, 'building-2', '8 con plan PyME / 4 Business'],
    ['Dispositivos', state.summary.totalDevices, 'cpu', '37 online en este momento'],
    ['Alertas', state.summary.alerts, 'triangle-alert', '3 críticas y 2 informativas'],
    ['Notificaciones', state.notifications.length, 'bell', 'Campañas y avisos recientes']
  ].map(([label, value, icon, foot]) => `
    <article class="metric-card">
      <div class="metric-label">${label}</div>
      <p class="metric-value">${value}</p>
      <div class="metric-foot">${createIcon(icon, 16)} ${foot}</div>
    </article>
  `).join('');

  const content = `
    <section class="content-stack">
      <section class="hero-band">
        <div class="page-header">
          <div>
            <h1 class="page-title">Un panel más moderno para operar tu red IoT</h1>
            <p class="page-subtitle">Sidebar colapsable, acciones con iconos SVG, notificaciones por cliente y perfil editable con avatar.</p>
          </div>
          <div class="quick-actions">
            <button class="btn btn-primary" data-nav="/admin/notificaciones">${createIcon('send', 16)} Enviar aviso</button>
            <button class="btn" data-nav="/cliente/dashboard">${createIcon('monitor-smartphone', 16)} Ver panel cliente</button>
          </div>
        </div>
        <div class="hero-actions">
          <span class="badge success">${createIcon('badge-check', 14)} UI actualizada</span>
          <span class="badge info">${createIcon('layout-grid', 14)} Sidebar colapsable</span>
          <span class="badge warning">${createIcon('bell-ring', 14)} Notificaciones segmentadas</span>
        </div>
      </section>

      <section class="stat-grid">${statCards}</section>

      <section class="panel-grid">
        <article class="panel notification-panel">
          <div class="panel-header"><h2 class="section-title">Actividad reciente</h2><span class="badge info">Tiempo real</span></div>
          <ul class="list-clean">
            ${state.notifications.slice(0, 5).map(n => `<li class="notification-item"><strong>${n.title}</strong><p class="muted">${n.message}</p><span class="badge ${n.read ? 'info' : 'success'}">${n.target}</span></li>`).join('')}
          </ul>
        </article>
        <article class="panel">
          <div class="panel-header"><h2 class="section-title">Resumen de clientes</h2><span class="badge success">Operativo</span></div>
          <ul class="list-clean">
            ${state.clients.map(c => `<li class="kv"><div><strong>${c.name}</strong><div class="muted">Plan ${c.plan} · ${c.devices} devices</div></div>${statusBadge(c.status)}</li>`).join('')}
          </ul>
        </article>
      </section>
    </section>
  `;
  return renderAppLayout({ title: 'Dashboard', content, route: '/admin/dashboard', mode: 'admin' });
}
