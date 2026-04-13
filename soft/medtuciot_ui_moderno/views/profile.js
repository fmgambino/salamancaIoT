import { renderAppLayout } from './layout.js';
import { state } from '../assets/js/state.js';
import { initials } from '../assets/js/utils.js';
export async function renderProfileView() {
  const content = `
    <div class="content-stack">
      <div class="page-header">
        <div><h1 class="page-title">Mi perfil</h1><p class="page-subtitle">Hacé clic en la foto para cambiar el avatar y personalizar tu sesión.</p></div>
      </div>
      <section class="panel profile-card">
        <div class="avatar avatar-lg" data-action="open-avatar-picker">${state.avatar ? `<img src="${state.avatar}" alt="avatar">` : initials(state.profile.fullName)}</div>
        <div class="user-meta"><strong>${state.profile.fullName}</strong><span>${state.profile.email}</span><div class="toolbar" style="margin-top:12px"><span class="badge success">${state.profile.role}</span><span class="badge info">${state.profile.company}</span></div></div>
      </section>
      <div class="grid grid-2">
        <section class="panel">
          <h2 class="section-title">Datos personales</h2>
          <form class="form-grid">
            <div class="form-row"><label>Nombre</label><input class="input" value="${state.profile.fullName}"></div>
            <div class="form-row"><label>Email</label><input class="input" value="${state.profile.email}"></div>
            <div class="form-row"><label>Rol</label><input class="input" value="${state.profile.role}" disabled></div>
            <button class="btn btn-primary" type="button">Guardar cambios</button>
          </form>
        </section>
        <section class="panel">
          <h2 class="section-title">Preferencias</h2>
          <div class="form-grid">
            <label class="notification-recipient-item"><input type="checkbox" checked> Notificaciones críticas</label>
            <label class="notification-recipient-item"><input type="checkbox" checked> Alertas por email</label>
            <label class="notification-recipient-item"><input type="checkbox"> Activar vibración móvil</label>
          </div>
        </section>
      </div>
    </div>
  `;
  return renderAppLayout({ title: 'Mi perfil', content, route: '/admin/perfil', mode: 'admin' });
}
