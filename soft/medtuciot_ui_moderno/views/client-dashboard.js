import { renderAppLayout } from './layout.js';
import { state } from '../assets/js/state.js';
import { createIcon } from '../assets/js/utils.js';
export async function renderClientDashboardView() {
  const selectedDevice = (state.devicesByPlace[state.selectedPlaceId] || []).find(d => d.id === state.selectedDeviceId) || state.devicesByPlace[state.selectedPlaceId]?.[0];
  const sensorTiles = state.sensors.map(sensor => `
    <article class="tile">
      <div>
        <h3 class="tile-title">${createIcon(sensor.icon, 22)} ${sensor.title}</h3>
        <div style="font-size:1.45rem;font-weight:800">${sensor.value}</div>
        <div class="tile-sub">${sensor.sub}</div>
      </div>
      <div class="badge ${sensor.trend === 'Baja' ? 'warning' : 'success'}">${createIcon('trending-up', 14)} ${sensor.trend}</div>
      <div class="tile-actions">
        <button class="btn icon-btn" title="Editar">${createIcon('pencil', 15)}</button>
        <button class="btn icon-btn" title="Eliminar">${createIcon('trash-2', 15)}</button>
      </div>
    </article>
  `).join('');
  const actuators = state.actuators.map(item => `
    <article class="tile" style="min-height:132px">
      <div class="panel-header"><strong>${createIcon(item.icon, 18)} ${item.title}</strong><button class="btn icon-btn" title="Info">${createIcon('info', 15)}</button></div>
      <div class="toolbar"><div class="switch ${item.active ? 'active' : ''}" data-action="toggle-actuator" data-id="${item.id}"></div><span class="muted">${item.active ? 'Activo' : 'Inactivo'}</span></div>
    </article>
  `).join('');
  const content = `
    <div class="content-stack">
      <section class="hero-band">
        <div class="page-header">
          <div>
            <h1 class="page-title">Dashboard — ${state.places.find(p => p.id === state.selectedPlaceId)?.name || 'Lugar'}</h1>
            <p class="page-subtitle">Seleccioná lugar y dispositivo desde el header para ver sensores, actuadores y acciones rápidas.</p>
          </div>
          <div class="client-actions">
            <span class="badge success">${createIcon(selectedDevice?.online ? 'wifi' : 'wifi-off', 14)} ${selectedDevice?.online ? 'Device online' : 'Device offline'}</span>
            <button class="btn">${createIcon('rotate-ccw', 16)} Historial de reinicios</button>
            <button class="btn btn-primary">${createIcon('power', 16)} Reset remoto</button>
          </div>
        </div>
      </section>

      <section class="client-sensor-grid">${sensorTiles}</section>

      <section class="panel">
        <div class="panel-header"><h2 class="section-title">Actuadores</h2><span class="badge info">${selectedDevice?.name || '-'}</span></div>
        <div class="actuator-grid">${actuators}</div>
      </section>
    </div>
  `;
  return renderAppLayout({ title: 'Panel cliente', content, route: '/cliente/dashboard', mode: 'client' });
}
