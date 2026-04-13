import { state } from '../assets/js/state.js';
import { createIcon, initials } from '../assets/js/utils.js';
export function renderHeader(title = 'Panel', mode = 'admin') {
  const devices = state.devicesByPlace[state.selectedPlaceId] || [];
  return `
    <header class="topbar">
      <div class="topbar-left">
        <div>
          <div class="breadcrumbs">${mode === 'client' ? 'Cliente / Visualización' : 'Administrador / Operación'}</div>
          <strong>${title}</strong>
        </div>
      </div>
      <div class="topbar-right">
        ${mode === 'client' ? `
          <div class="header-selects">
            <select id="place-select" class="top-chip">
              ${state.places.map(p => `<option value="${p.id}" ${p.id === state.selectedPlaceId ? 'selected' : ''}>${p.name}</option>`).join('')}
            </select>
            <select id="device-select" class="top-chip">
              ${devices.map(d => `<option value="${d.id}" ${d.id === state.selectedDeviceId ? 'selected' : ''}>${d.name}</option>`).join('')}
            </select>
          </div>
        ` : ''}
        <button class="btn icon-btn" data-action="toggle-theme" title="Cambiar tema">${createIcon('moon-star', 18)}</button>
        <button class="btn icon-btn" data-nav="/admin/notificaciones" title="Notificaciones">${createIcon('bell', 18)}</button>
        <button class="btn icon-btn" title="Pantalla completa">${createIcon('expand', 18)}</button>
        <div class="avatar" data-action="open-avatar-picker" title="Cambiar foto de perfil">
          ${state.avatar ? `<img src="${state.avatar}" alt="avatar">` : initials(state.profile.fullName)}
        </div>
        <button class="btn" data-action="logout">${createIcon('log-out', 16)} Salir</button>
      </div>
      <input type="file" id="avatar-input" class="hidden" accept="image/*">
    </header>
  `;
}
