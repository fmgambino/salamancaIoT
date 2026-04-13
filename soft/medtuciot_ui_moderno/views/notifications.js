import { renderAppLayout } from './layout.js';
import { state } from '../assets/js/state.js';
import { createIcon } from '../assets/js/utils.js';
export async function renderNotificationsView() {
  const content = `
    <div class="content-stack">
      <div class="page-header">
        <div>
          <h1 class="page-title">Notificaciones</h1>
          <p class="page-subtitle">Enviá avisos a todos los clientes, a uno o a varios seleccionados.</p>
        </div>
        <div class="toolbar"><button class="btn" data-action="mark-notifications-read">${createIcon('check-check', 16)} Marcar todas leídas</button></div>
      </div>

      <div class="grid grid-2">
        <section class="panel">
          <div class="panel-header"><h2 class="section-title">Nueva notificación</h2><span class="badge success">Segmentación</span></div>
          <form id="notification-form" class="form-grid">
            <div class="form-row">
              <label>Destino</label>
              <select class="select" name="scope">
                <option value="all">Todos los clientes</option>
                <option value="one">Un cliente</option>
                <option value="some">Algunos clientes</option>
              </select>
            </div>
            <div class="form-row">
              <label>Clientes</label>
              <div class="notification-recipient-list">
                ${state.clients.map(c => `
                  <label class="notification-recipient-item">
                    <input type="checkbox" name="recipients" value="${c.name}">
                    <div><strong>${c.name}</strong><div class="muted">${c.plan} · ${c.devices} devices</div></div>
                  </label>
                `).join('')}
              </div>
            </div>
            <div class="form-row"><label>Título</label><input class="input" name="title" required placeholder="Ej. Mantenimiento programado"></div>
            <div class="form-row"><label>Mensaje</label><textarea class="textarea" name="message" required placeholder="Escribí el contenido de la notificación"></textarea></div>
            <button class="btn btn-primary" type="submit">${createIcon('send', 16)} Enviar notificación</button>
          </form>
        </section>

        <section class="panel notification-panel">
          <div class="panel-header"><h2 class="section-title">Historial</h2><span class="badge info">${state.notifications.length}</span></div>
          <ul class="list-clean">
            ${state.notifications.map(n => `
              <li class="notification-item">
                <div class="panel-header" style="margin-bottom:4px"><strong>${n.title}</strong><span class="badge ${n.read ? 'info' : 'warning'}">${n.target}</span></div>
                <p class="muted">${n.message}</p>
                <div class="mini-stat">${createIcon('clock-3', 15)} ${n.date}</div>
              </li>
            `).join('')}
          </ul>
        </section>
      </div>
    </div>
  `;
  return renderAppLayout({ title: 'Notificaciones', content, route: '/admin/notificaciones', mode: 'admin' });
}
